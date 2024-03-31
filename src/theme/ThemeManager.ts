import type { STATE } from '../state/state'

import { makeAutoObservable } from 'mobx'

// prettier-ignore
export type ThemeName =
    | 'light'
    | 'light2'
    | 'dark'
    | 'dark2'
    | 'dark3'
    | 'cupcake'
    | 'valentine'
    | 'wireframe'
    | 'forest'
    | 'dracula'

export class ThemeManager {
    themes: ThemeName[] = [
        // dark themes
        'dark',
        'dark2',
        'dark3',
        'forest',
        'dracula',
        //
        'light',
        'light2',
        'cupcake',
        'valentine',
        'wireframe',
    ]
    toggle() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark'
    }
    get theme(): ThemeName {
        return this.st.configFile.value.theme ?? 'dark'
    }
    set theme(v: ThemeName) {
        this.st.configFile.update({ theme: v })
    }

    constructor(public st: STATE) {
        //
        makeAutoObservable(this)
    }
}
