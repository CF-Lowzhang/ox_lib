import { useCallback, useEffect, useState } from 'react';
import type { SkillCheckProps } from '../../typings';
import { useInterval } from '@mantine/hooks';

interface Props {
  angle: number;
  offset: number;
  multiplier: number;
  skillCheck: SkillCheckProps;
  className: string;
  handleComplete: (success: boolean) => void;
}

const Indicator: React.FC<Props> = ({ angle, offset, multiplier, handleComplete, skillCheck, className }) => {
  const [indicatorAngle, setIndicatorAngle] = useState(-90);
  const [keyPressed, setKeyPressed] = useState<false | string>(false);
  const interval = useInterval(
    () => {
      setIndicatorAngle((prevState) => {
        const newAngle = prevState + multiplier;
        // console.log(`Interval tick: new indicator angle = ${newAngle}`);
        return newAngle;
      });
    },
    1
  );

  const keyHandler = useCallback(
    (e: KeyboardEvent) => {
      // console.log(`Key event: e.key = ${e.key}, e.code = ${e.code}, e.which = ${e.which}`);
      let convKey = '';

      if (e.code.startsWith('Key')) {
        convKey = e.code.charAt(3).toLowerCase(); // i.e. 'KeyW' -> 'w'
      } else if (e.code.startsWith('Digit')) {
        convKey = e.code.charAt(5); // i.e. 'Digit7' -> '7'
      } else {
        convKey = e.code.toLowerCase();
      }

      // console.log(`Converted key: ${convKey}`);
      setKeyPressed(convKey);
    },
    [skillCheck]
  );

  useEffect(() => {
    setIndicatorAngle(-90);
    // console.log(`useEffect [skillCheck]: Reset indicator angle to -90`);
    window.addEventListener('keydown', keyHandler);
    interval.start();
    // console.log(`useEffect [skillCheck]: Added keydown event listener and started interval`);

    return () => {
      window.removeEventListener('keydown', keyHandler);
      interval.stop();
      // console.log(`useEffect [skillCheck]: Cleanup - removed event listener and stopped interval`);
    };
  }, [skillCheck, keyHandler]);

  useEffect(() => {
    // console.log(`useEffect [indicatorAngle]: Current indicator angle = ${indicatorAngle}`);
    if (indicatorAngle + 90 >= 360) {
      interval.stop();
      // console.log(`useEffect [indicatorAngle]: Indicator angle exceeded limit, stopping interval`);
      handleComplete(false);
    }
  }, [indicatorAngle]);

  useEffect(() => {
    // console.log(`useEffect [keyPressed]: Current keyPressed = ${keyPressed}`);
    if (!keyPressed) return;

    if (skillCheck.keys && !skillCheck.keys.includes(keyPressed)) {
      // console.log(`useEffect [keyPressed]: Key pressed is not in skillCheck.keys`);
      return;
    }

    interval.stop();
    // console.log(`useEffect [keyPressed]: Key pressed is valid, stopping interval`);

    window.removeEventListener('keydown', keyHandler);

    if (keyPressed !== skillCheck.key || indicatorAngle < angle || indicatorAngle > angle + offset) {
      // console.log(`useEffect [keyPressed]: Key press failed the skill check`);
      handleComplete(false);
    } else {
      // console.log(`useEffect [keyPressed]: Key press succeeded the skill check`);
      handleComplete(true);
    }

    setKeyPressed(false);
    // console.log(`useEffect [keyPressed]: Reset keyPressed to false`);
  }, [keyPressed]);

  return <circle transform={`rotate(${indicatorAngle}, 250, 250)`} className={className} />;
};

export default Indicator;