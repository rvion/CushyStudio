import { makeAutoObservable } from 'mobx'
import { STATE } from 'src/state/state'

export type ThemeName = 'light' | 'dark' | 'cupcake' | 'aqua' | 'valentine' | 'wireframe'

export class ThemeManager {
    themes: ThemeName[] = ['light', 'dark', 'cupcake', 'aqua', 'valentine', 'wireframe']
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
