import type { Tint } from './Tint'

import { getNum } from '../tinyCSS/CSSVar'

export type UI_Tint = Z.Choices<{
   l: Z.Choice<{
      lightness: Z.Number
      contrast: Z.Number
   }>
   c: Z.Choice<{
      chroma: Z.Number
      chromaBlend: Z.Number
   }>
   h: Z.Choice<{
      hue: Z.Number
      hueShift: Z.Number
   }>
}>

export const ui_tint = (ui: Z.Builder, def?: Tint): UI_Tint => {
   return ui.choices(
      {
         l: ui.choice(
            {
               lightness: ui.number({
                  label: 'Manual',
                  text: 'lightness',
                  min: 0,
                  max: 1,
                  default: getNum(def?.lightness, 0.1),
                  step: 0.1,
                  icon: IKONS.mdiGradientHorizontal,
               }),
               contrast: ui.number({
                  label: 'Relative',
                  text: 'contrast',
                  min: -1,
                  softMin: 0,
                  max: 1,
                  default: getNum(def?.contrast, 0.1),
                  step: 0.1,
                  icon: IKONS.mdiInvertColors,
               }),
            },
            {
               uiui: [
                  [`&.contrast`, { Title: null, Icon: null, Indent: null }],
                  [`&.lightness`, { Title: null, Icon: null, Indent: null }],
               ],
               appearance: 'tab',
               label: 'Light',
               default: def?.lightness ? 'lightness' : 'contrast',
            },
         ),
         c: ui.choice(
            {
               chroma: ui.number({
                  label: 'Manual',
                  min: 0,
                  max: 0.47,
                  default: getNum(def?.chroma, 0.1),
                  step: 0.1,
                  icon: IKONS.mdiPalette,
               }),
               chromaBlend: ui.number({
                  label: 'Relative',
                  text: 'multiply',
                  min: 0,
                  softMax: 2,
                  default: getNum(def?.chromaBlend, 1),
                  step: 0.1,
                  icon: IKONS.mdiEyedropper,
               }),
            },
            {
               appearance: 'tab',
               label: 'Chroma',
               default: def?.chroma ? 'chroma' : 'chromaBlend',
            },
         ),
         h: ui.choice(
            {
               hue: ui.number({
                  label: 'Manual',
                  min: -360,
                  softMin: 0,
                  max: 360,
                  default: getNum(def?.hue, 220),
                  step: 1,
                  icon: IKONS.mdiPalette,
               }),
               hueShift: ui.number({
                  label: 'Relative',
                  text: 'shift',
                  min: -360,
                  softMin: 0,
                  max: 360,
                  default: getNum(def?.hueShift, 0),
                  step: 10,
                  icon: IKONS.mdiEyedropper,
               }),
            },
            {
               appearance: 'tab',
               label: 'Hue',
               default: def?.hue ? 'hue' : 'hueShift',
            },
         ),
      },
      {
         default: {
            l: def?.lightness != null || def?.contrast != null ? true : undefined,
            c: def?.chroma != null || def?.chromaBlend != null ? true : undefined,
            h: def?.hue != null || def?.hueShift != null ? true : undefined,
         },
         presets: [
            {
               icon: IKONS.mdiText,
               label: 'Text (v1)',
               apply(w): void {
                  w.setValue({
                     l: { contrast: 0.9 },
                     c: { chromaBlend: 1 },
                     h: { hue: 0 },
                  })
               },
            },
            {
               icon: IKONS.mdiText,
               label: 'Text (colored)',
               apply(w): void {
                  w.setValue({
                     l: { contrast: 0.7 },
                     c: { chroma: 0.3 },
                     h: { hueShift: 180 },
                  })
               },
            },
            {
               icon: IKONS.mdiText,
               label: 'Text (subtle)',
               apply(w): void {
                  w.setValue({ l: { contrast: 0.3 } })
               },
            },
            {
               icon: IKONS.mdiSquareCircle,
               label: 'base 100',
               apply(w): void {
                  w.setValue({ l: { contrast: 0.05 } })
               },
            },
         ],
      },
   )
}

export const run_tint = (ui: ReturnType<typeof ui_tint>['$value']): Tint => {
   return {
      // l
      lightness: ui.l?.lightness,
      contrast: ui.l?.contrast,
      // c
      chroma: ui.c?.chroma,
      chromaBlend: ui.c?.chromaBlend,
      // h
      hue: ui.h?.hue,
      hueShift: ui.h?.hueShift,
   }
}
