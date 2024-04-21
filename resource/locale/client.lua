local settings = require 'resource.settings'

local function loadLocaleFile(key)
    local file = LoadResourceFile(cache.resource, ('locales/%s.json'):format(key))
        or LoadResourceFile(cache.resource, 'locales/zh-tw.json')

    return file and json.decode(file) or {}
end

function lib.getLocaleKey() return settings.locale end

---@param key string
function lib.setLocale(key)
    TriggerEvent('ox_lib:setLocale', key)
    SendNUIMessage({
        action = 'setLocale',
        data = loadLocaleFile(key)
    })
end

RegisterNUICallback('init', function(_, cb)
    cb(1)

    SendNUIMessage({
        action = 'setLocale',
        data = loadLocaleFile(settings.locale)
    })
end)

if not settings.locale then lib.setLocale(GetConvar('ox:locale', 'zh-tw')) end

lib.locale(settings.locale)
