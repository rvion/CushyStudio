import { makeAutoObservable } from 'mobx'
import { STATE } from 'src/state/state'

export type Theme = 'light' | 'dark'

export class ThemeManager {
    toggle() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark'
    }
    get theme(): Theme {
        return this.st.configFile.value.theme ?? 'dark'
    }
    set theme(v: Theme) {
        this.st.configFile.update({ theme: v })
    }

    constructor(public st: STATE) {
        //
        makeAutoObservable(this)
    }
}
