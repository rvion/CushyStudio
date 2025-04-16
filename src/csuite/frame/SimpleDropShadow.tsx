import type { CushySchemaBuilder } from '../../controls/CushyBuilder'
import type { TintExt } from '../kolor/Tint'

import { Kolor } from '../kolor/Kolor'

export type SimpleDropShadow = {
   x?: number
   y?: number
   blur?: number
   color?: TintExt
   opacity?: number
}

export type $schemaSimpleDropShadow = X.XGroup<{
   x: X.XNumber
   y: X.XNumber
   blur: X.XNumber
   color: X.XColor
   opacity: X.XNumber
}>

export function run_theme_dropShadow(shadow: SimpleDropShadow): string {
   if (shadow.opacity == 0) {
      return 'unset'
   }

   const col = Kolor.fromString(shadow.color!.toString())
   return `${shadow.x ?? 0}px ${shadow.y ?? 0}px ${shadow.blur ?? 0}px ${shadow.color ? `oklch(${col.lightness} ${col.chroma} ${col.hue} / ${shadow.opacity})` : '#000000'}`
}

export const schemaSimpleDropShadow = (ui: CushySchemaBuilder): $schemaSimpleDropShadow =>
   ui.fields({
      x: ui.int({ default: 0, min: -20, max: 20 }),
      y: ui.int({ default: 1, min: -20, max: 20 }),
      color: ui.colorV2({ default: '#000', description: 'Drop shadow color for inputs' }),
      blur: ui.int({ default: 0, min: 0, max: 20 }),
      opacity: ui.float({ default: 0.5, min: 0, max: 1, step: 0.1 }),
   })
