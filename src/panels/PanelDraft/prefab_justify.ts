import type { Builder } from '../../controls/Builder'

export type UI_Justify = X.XSelectOne_<'full' | 'L' | 'center' | 'R'>

export const ui_justify = (ui: Builder): UI_Justify =>
    ui.selectOneStringWithMeta(
        [
            { id: 'full', icon: 'mdiFormatAlignJustify', label: '' },
            { id: 'L', icon: 'mdiFormatAlignLeft', label: '' },
            { id: 'center', icon: 'mdiFormatAlignCenter', label: '' },
            { id: 'R', icon: 'mdiFormatAlignRight', label: '' },
        ],
        {
            appearance: 'roll',
            wrap: false,
            choices: [],
        },
    )

export const run_justify = (value: ReturnType<typeof ui_justify>['$Value']): string | undefined => {
    if (value === 'full') return 'w-full'
    if (value === 'center') return 'max-w-xl m-auto'
    if (value === 'L') return 'max-w-xl'
    if (value === 'R') return 'max-w-xl ml-auto'
    return
}
