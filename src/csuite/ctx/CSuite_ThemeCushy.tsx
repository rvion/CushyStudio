import type { FormGlobalLayoutMode } from '../../state/conf/FormGlobalLayoutMode'
import type { STATE } from '../../state/state'
import type { Tint, TintExt } from '../kolor/Tint'
import type { CSuiteConfig } from './CSuiteConfig'

import { makeAutoObservable } from 'mobx'

import { Kolor } from '../kolor/Kolor'
import { run_tint } from '../kolor/prefab_Tint'

export class CSuite_ThemeCushy implements CSuiteConfig {
    constructor(private st: STATE) {
        makeAutoObservable(this)
    }

    get tooltipDelay(): Maybe<number> {
        return cushy.preferences.interface.value.tooltipDelay
    }

    get showFoldButtons(): boolean {
        return this.st.preferences.interface.value.showWidgetFoldButtons ?? true
    }

    // sizes ------------------------------------------------------
    get widgetHeight(): number {
        return this.st.preferences.interface.value.widgetHeight ?? 1.8
    }

    get inputHeight(): number {
        return this.st.preferences.interface.value.inputHeight ?? 1.6
    }

    get insideHeight(): number {
        return this.st.preferences.interface.value.insideHeight ?? 1.2
    }

    // misc ------------------------------------------------------
    get clickAndSlideMultiplicator(): number {
        return this.st.clickAndSlideMultiplicator ?? 1
    }

    get showWidgetUndo(): boolean {
        return this.st.preferences.interface.value.showWidgetUndo ?? true
    }

    get showWidgetMenu(): boolean {
        return this.st.preferences.interface.value.showWidgetMenu ?? true
    }

    get showWidgetDiff(): boolean {
        return this.st.preferences.interface.value.showWidgetDiff ?? true
    }

    get showToggleButtonBox(): boolean {
        return this.st.preferences.interface.value.showToggleButtonBox ?? false
    }

    get labellayout(): FormGlobalLayoutMode {
        const x = this.st.theme.value.labelLayout
        if (x.id === 'fluid') return 'fluid'
        if (x.id === 'fixed-left') return 'fixed-left'
        if (x.id === 'fixed-right') return 'fixed-right'
        if (x.id === 'mobile') return 'mobile'
        return 'fixed-right'
    }

    showWidgetExtra: boolean = true
    truncateLabels?: boolean | undefined = false

    // theme

    get baseStr(): string {
        return this.st.theme.root.value.base
    }

    get base(): Kolor {
        return Kolor.fromString(this.baseStr)
    }

    get shiftDirection(): 1 | -1 {
        return this.base.lightness > 0.5 ? -1 : 1
    }

    labelBackground: TintExt = 0 // 3 // {}

    get text(): Tint {
        return run_tint(this.st.theme.value.text)
    }

    get inputContrast(): TintExt {
        return this.st.theme.value.inputContrast
    }

    get inputBorder(): TintExt {
        return this.st.theme.value.inputBorder ?? 10
    }

    get labelText(): Tint | undefined {
        const raw = this.st.theme.value.textLabel
        if (raw == null) return undefined
        return run_tint(raw)
    }

    get fieldGroups(): {
        border: Maybe<number>
        contrast: Maybe<number>
    } {
        return {
            border: this.st.theme.value.fieldGroups?.border,
            contrast: this.st.theme.value.fieldGroups?.contrast,
        }
    }
}
