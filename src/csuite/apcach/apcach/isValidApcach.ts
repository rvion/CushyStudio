import { Apcach } from './apcach'

// 💬 2024-06-16 rvion
// | probably not a good way to do things here.
// | we should really move toward using proper classes
export function isValidApcach(el: Apcach | string): el is Apcach {
    if (typeof el === 'string') return false

    // prettier-ignore
    return (
        el.contrastConfig != null &&
        el.alpha          != null &&
        el.chroma         != null &&
        el.hue            != null &&
        el.lightness      != null
    )
}
