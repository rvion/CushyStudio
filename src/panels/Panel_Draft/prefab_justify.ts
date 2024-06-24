import type { FormBuilder } from '../../controls/FormBuilder'

export const ui_justify = (ui: FormBuilder) =>
    ui.selectOne({
        // appearance: 'tab',
        appearance: 'roll',
        wrap: false,
        choices: [
            { id: 'full', icon: 'mdiFormatAlignJustify', label: '' },
            { id: 'L', icon: 'mdiFormatAlignLeft', label: '' },
            { id: 'center', icon: 'mdiFormatAlignCenter', label: '' },
            { id: 'R', icon: 'mdiFormatAlignRight', label: '' },
        ],
    })

export const run_justify = (value: ReturnType<typeof ui_justify>['$Value']): string | undefined => {
    if (value.id === 'full') return 'w-full'
    if (value.id === 'center') return 'max-w-xl m-auto'
    if (value.id === 'L') return 'max-w-xl'
    if (value.id === 'R') return 'max-w-xl ml-auto'
    return
}
