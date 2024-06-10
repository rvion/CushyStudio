import type { STATE } from '../../state/state'
import type { Kolor } from '../kolor/Kolor'
import type { OKLCH } from '../kolor/OKLCH'
import type { CSuiteConfig } from './CSuiteConfig'

import { makeAutoObservable } from 'mobx'

import { getLCHFromString } from '../kolor/getLCHFromString'
import { run_Kolor } from '../kolor/prefab_Kolor'
import { NumberVar } from '../tinyCSS/CSSVar'

export class CSuite_ThemeCushy implements CSuiteConfig {
    constructor(private st: STATE) {
        makeAutoObservable(this)
    }

    // form behaviour
    get clickAndSlideMultiplicator() {
        return this.st.clickAndSlideMultiplicator ?? 1
    }
    get showWidgetUndo() {
        return this.st.theme.value.showWidgetUndo ?? true
    }
    get showWidgetMenu() {
        return this.st.theme.value.showWidgetMenu ?? true
    }
    get showWidgetDiff() {
        return this.st.theme.value.showWidgetDiff ?? true
    }
    get showToggleButtonBox() {
        return this.st.theme.value.showToggleButtonBox ?? false
    }
    showWidgetExtra: boolean = true
    truncateLabels?: boolean | undefined = false
    get inputHeight() {
        return this.st.theme.value.inputHeight ?? 1.6
    }
    // theme
    get baseStr() {
        return this.st.theme.root.value.base
    }
    get base(): OKLCH {
        return getLCHFromString(this.baseStr)
    }
    get shiftDirection() {
        return this.base.lightness > 0.5 ? -1 : 1
    }
    get text(): Kolor {
        return run_Kolor(this.st.theme.value.text)
    }

    inputBorder = new NumberVar(
        //
        'input-border',
        () => (this.st.theme.value.border ?? 20) / 100,
    )

    get labelText(): Kolor | undefined {
        const raw = this.st.theme.value.textLabel
        if (raw == null) return undefined
        return run_Kolor(raw)
    }

    // get value(): THEME {
    //     return {
    //         ...defaultDarkTheme,
    //     }
    // }
}
