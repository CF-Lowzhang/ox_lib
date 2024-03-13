import { Box, createStyles, Text } from '@mantine/core';
import React from 'react';

const useStyles = createStyles((theme) => ({
  container: {
    textAlign: 'center',
    borderTopLeftRadius: theme.radius.md,
    borderTopRightRadius: theme.radius.md,
    backgroundColor: theme.colors.dark[6],
    height: 60,
    lineHeigh: 1.55,
    width: 384,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border:'0.2vw solid rgba(123,144,183,0.3)', 
    borderRadius:'0.4vw',
  },
  heading: {
    fontSize: 26,
    textTransform: 'uppercase',
    fontWeight: 1000,
  },
}));

const Header: React.FC<{ title: string }> = ({ title }) => {
  const { classes } = useStyles();

  return (
    <Box className={classes.container}>
      <Text className={classes.heading}>{title}</Text>
    </Box>
  );
};

export default React.memo(Header);
