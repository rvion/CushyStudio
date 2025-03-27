import type { CushySchemaBuilder } from '../../controls/CushyBuilder'

export type UI_Justify = Z.XSelectOne_<'full' | 'L' | 'center' | 'R'>

export const ui_justify = (ui: CushySchemaBuilder): UI_Justify =>
   ui.selectOneOptionId(
      [
         { id: 'full', icon: IKONS.mdiFormatAlignJustify, label: '' },
         { id: 'L', icon: IKONS.mdiFormatAlignLeft, label: '' },
         { id: 'center', icon: IKONS.mdiFormatAlignCenter, label: '' },
         { id: 'R', icon: IKONS.mdiFormatAlignRight, label: '' },
      ],
      {
         appearance: 'roll',
         wrap: false,
      },
   )

export const run_justify = (value: ReturnType<typeof ui_justify>['ҨValue']): string | undefined => {
   if (value === 'full') return 'w-full'
   if (value === 'center') return 'max-w-xl m-auto'
   if (value === 'L') return 'max-w-xl'
   if (value === 'R') return 'max-w-xl ml-auto'
   return
}
