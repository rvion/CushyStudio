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
      return cushy.preferences.interface.zFields.tooltipDelay.zValue
   }

   get showFoldButtons(): boolean {
      return this.st.preferences.interface.zFields.widget.zFields.showFoldButtons.zValue ?? true
   }

   // sizes ------------------------------------------------------
   get widgetHeight(): number {
      return this.st.preferences.interface.zFields.widgetHeight.zValue ?? 1.8
   }

   get inputHeight(): number {
      return this.st.preferences.interface.zFields.inputHeight.zValue ?? 1.6
   }

   get insideHeight(): number {
      return this.st.preferences.interface.zFields.insideHeight.zValue ?? 1.2
   }

   get inputRoundness(): number {
      return this.st.preferences.theme.zValue.global.roundness ?? 5
   }

   // misc ------------------------------------------------------
   get clickAndSlideMultiplicator(): number {
      return this.st.clickAndSlideMultiplicator ?? 1
   }

   get showWidgetUndo(): boolean {
      return this.st.preferences.interface.zFields.widget.zFields.showUndo.zValue ?? true
   }

   get showWidgetMenu(): boolean {
      return this.st.preferences.interface.zFields.widget.zFields.showMenu.zValue ?? true
   }

   get showWidgetDiff(): boolean {
      return this.st.preferences.interface.zFields.widget.zFields.showDiff.zValue ?? true
   }

   get showToggleButtonBox(): boolean {
      return this.st.preferences.interface.zFields.widget.zFields.showToggleButtonBox.zValue ?? false
   }

   get labellayout(): FormGlobalLayoutMode {
      const x = this.st.preferences.theme.zFields.labelLayout.zValue
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
      return this.st.preferences.theme.base.zValue
   }

   get base(): Kolor {
      return Kolor.fromString(this.baseStr)
   }

   get shiftDirection(): 1 | -1 {
      return this.base.lightness > 0.5 ? -1 : 1
   }

   labelBackground: TintExt = 0 // 3 // {}

   get text(): Tint {
      return run_tint(this.st.preferences.theme.zValue.global.text.base)
   }

   get inputContrast(): TintExt {
      return this.st.preferences.theme.zValue.global.contrast
   }

   get inputBorder(): TintExt {
      return this.st.preferences.theme.zValue.global.border ?? 10
   }

   get labelText(): Tint | undefined {
      const raw = this.st.preferences.theme.zValue.global.labelText.base
      if (raw == null) return undefined
      return run_tint(raw)
   }

   get fieldGroups(): {
      border: Maybe<number>
      contrast: Maybe<number>
   } {
      return {
         border: this.st.preferences.theme.fieldGroups.zValue?.border,
         contrast: this.st.preferences.theme.fieldGroups.zValue?.contrast,
      }
   }
}
