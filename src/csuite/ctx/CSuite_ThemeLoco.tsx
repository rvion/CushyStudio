import type { Kolor } from '../kolor/Kolor'
import type { OKLCH } from '../kolor/OKLCH'
import type { CSuiteConfig } from './CSuiteConfig'

import { makeAutoObservable } from 'mobx'

import { formatOKLCH } from '../kolor/formatOKLCH'

export class CSuite_ThemeLoco implements CSuiteConfig {
    constructor() {
        makeAutoObservable(this)
    }
    // form behaviour
    clickAndSlideMultiplicator = 1
    showWidgetUndo = true
    showWidgetMenu = true
    showWidgetDiff = true
    showToggleButtonBox = false
    // theme
    base: OKLCH = { lightness: 0.9999, chroma: 0, hue: 240 }
    get baseStr() {
        return formatOKLCH(this.base)
    }
    get shiftDirection() {
        return this.base.lightness > 0.5 ? -1 : 1
    }
    text: Kolor = { contrast: 0.824 }

    inputBorder = 0.08
    labelText = { contrast: 0.48, chroma: 0.035 }
    inputHeight: number = 1.6
    showWidgetExtra: boolean = true
    truncateLabels?: boolean | undefined = false
}
