import type { Tint, TintExt } from '../kolor/Tint'
import type { CSuiteConfig } from './CSuiteConfig'

import { makeAutoObservable } from 'mobx'

import { Kolor } from '../kolor/Kolor'

export class CSuite_ThemeLoco implements CSuiteConfig {
    constructor() {
        makeAutoObservable(this)
    }

    // tooltip behaviour
    tooltipDelay = 400

    // form behaviour
    clickAndSlideMultiplicator = 1
    showWidgetUndo = false
    showWidgetMenu = false
    showWidgetDiff = false
    showFoldButtons = false
    showToggleButtonBox = false
    labellayout: 'fixed-left' | 'fixed-right' | 'fluid' = 'fixed-left'

    // theme
    base: Kolor = new Kolor(0.9999, 0, 240)
    labelBackground?: Maybe<TintExt> = undefined
    get baseStr(): string {
        return this.base.toOKLCH()
    }
    get shiftDirection(): 1 | -1 {
        return this.base.lightness > 0.5 ? -1 : 1
    }
    text: Tint = { contrast: 0.824 }

    inputBorder = 0.08
    inputContrast = 0.03
    labelText = { contrast: 0.48, chroma: 0.035 }
    widgetHeight: number = 1.8
    inputHeight: number = 1.6
    showWidgetExtra: boolean = true
    truncateLabels?: boolean | undefined = false
    fieldGroups = {}
}
