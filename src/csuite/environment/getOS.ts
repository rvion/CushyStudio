// basic OS detection that works both in the browser and in electron

type _OS = 'Mac' | 'iOS' | 'Windows' | 'Android' | 'Linux' | 'unknown'

let _os: Maybe<_OS>

export function getOS() {
    if (_os) return _os
    _os = getOS_()
    return _os
}

function getOS_(): 'Mac' | 'iOS' | 'Windows' | 'Android' | 'Linux' | 'unknown' {
    try {
        const userAgent = window.navigator.userAgent
        const platform = window.navigator.platform
        if (['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'].indexOf(platform) !== -1) return 'Mac'
        else if (['iPhone', 'iPad', 'iPod'].indexOf(platform) !== -1) return 'iOS'
        else if (['Win32', 'Win64', 'Windows', 'WinCE'].indexOf(platform) !== -1) return 'Windows'
        else if (/Android/.test(userAgent)) return 'Android'
        else if (/Linux/.test(platform)) return 'Linux'
        return 'unknown'
    } catch (e) {
        return 'unknown'
    }
}
