// 🔴 LEGACY ; remove me
import type { STATE } from '../state/state'

export type ThemeName = 'dark'
export class ThemeManager {
    constructor(public st: STATE) {}
    themes: ThemeName[] = ['dark']
    get theme(): ThemeName { return 'dark' } // prettier-ignore
    set theme(v: ThemeName) { } // prettier-ignore
}
