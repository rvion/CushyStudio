import type { DovLook } from './DovAppearance'

import { cva, type VariantProps } from 'class-variance-authority'

export const flexCVA = cva('', {
   variants: {
      flex: {
         true: ['flex'],
         // 1: ['flex flex-1'],
         'inline-flex': ['inline-flex'],
         false: [],
      },
      direction: {
         horizontal: ['flex-row'],
         vertical: ['flex-col'],
      },
      align: {
         start: ['items-start'],
         center: ['items-center'],
         end: ['items-end'],
         stretch: ['items-stretch'],
      },
      justify: {
         start: ['justify-start'],
         center: ['justify-center'],
         end: ['justify-end'],
         between: ['justify-between'],
         evenly: ['justify-evenly'],
      },
      wrap: {
         true: ['flex-wrap'],
      },
      gap: {
         large: ['gap-8'],
         normal: ['gap-4'],
         small: ['gap-2'],
         extraSmall: ['gap-1'],
         smallest: ['gap-0.5'],
         none: ['gap-0'],
      },
   },
   defaultVariants: {
      flex: true,
      direction: 'vertical',
      align: 'start',
      justify: 'start',
      gap: 'small',
   },
})

export type DovFlexProps = VariantProps<typeof flexCVA>

export const lookToFlexProps = (look: Maybe<DovLook>): DovFlexProps => {
   if (look == null) return {}
   if (look === 'command') return { flex: true, justify: 'start' }
   if (look === 'error-hover-command') return { flex: true, justify: 'start' }
   return {}
}
