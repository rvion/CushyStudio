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

   showExpandCarets: boolean = true
   showSelectIcons: boolean = false

   get tooltipDelay(): Maybe<number> {
      return cushy.preferences.interface.ϟfields.tooltipDelay.ϟvalue
   }

   get showFoldButtons(): boolean {
      return this.st.preferences.interface.ϟfields.widget.ϟfields.showFoldButtons.ϟvalue ?? true
   }

   // sizes ------------------------------------------------------
   get widgetHeight(): number {
      return this.st.preferences.interface.ϟfields.widgetHeight.ϟvalue ?? 1.8
   }

   get inputHeight(): number {
      return this.st.preferences.interface.ϟfields.inputHeight.ϟvalue ?? 1.6
   }

   get insideHeight(): number {
      return this.st.preferences.interface.ϟfields.insideHeight.ϟvalue ?? 1.2
   }

   get inputRoundness(): number {
      return this.st.preferences.theme.ϟvalue.global.roundness ?? 5
   }

   // misc ------------------------------------------------------
   get clickAndSlideMultiplicator(): number {
      return this.st.clickAndSlideMultiplicator ?? 1
   }

   get showWidgetUndo(): boolean {
      return this.st.preferences.interface.ϟfields.widget.ϟfields.showUndo.ϟvalue ?? true
   }

   get showWidgetMenu(): boolean {
      return this.st.preferences.interface.ϟfields.widget.ϟfields.showMenu.ϟvalue ?? true
   }

   get showWidgetDiff(): boolean {
      return this.st.preferences.interface.ϟfields.widget.ϟfields.showDiff.ϟvalue ?? true
   }

   get showToggleButtonBox(): boolean {
      return this.st.preferences.interface.ϟfields.widget.ϟfields.showToggleButtonBox.ϟvalue ?? false
   }

   get labellayout(): FormGlobalLayoutMode {
      const x = this.st.preferences.theme.ϟfields.labelLayout.ϟvalue
      if (x === 'fluid') return 'fluid'
      if (x === 'fixed-left') return 'fixed-left'
      if (x === 'fixed-right') return 'fixed-right'
      if (x === 'mobile') return 'mobile'
      return 'fixed-right'
   }

   showWidgetExtra: boolean = true
   truncateLabels?: boolean | undefined = false

   // theme

   get baseStr(): string {
      return this.st.preferences.theme.base.ϟvalue
   }

   get base(): Kolor {
      return Kolor.fromString(this.baseStr)
   }

   get shiftDirection(): 1 | -1 {
      return this.base.lightness > 0.5 ? -1 : 1
   }

   labelBackground: TintExt = 0 // 3 // {}

   get text(): Tint {
      return run_tint(this.st.preferences.theme.ϟvalue.global.text.base)
   }

   get inputContrast(): TintExt {
      return this.st.preferences.theme.ϟvalue.global.contrast
   }

   get inputBorder(): TintExt {
      return this.st.preferences.theme.ϟvalue.global.border ?? 10
   }

   get labelText(): Tint | undefined {
      const raw = this.st.preferences.theme.ϟvalue.global.labelText.base
      if (raw == null) return undefined
      return run_tint(raw)
   }

   get fieldGroups(): {
      border: Maybe<number>
      contrast: Maybe<number>
   } {
      return {
         border: this.st.preferences.theme.fieldGroups.ϟvalue?.border,
         contrast: this.st.preferences.theme.fieldGroups.ϟvalue?.contrast,
      }
   }
}
