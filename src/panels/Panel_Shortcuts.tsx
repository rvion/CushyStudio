import { observer } from 'mobx-react-lite'

import { useSt } from '../state/stateContext'
import { MessageInfoUI } from './MessageUI'
import { ComboUI } from 'src/app/shortcuts/ComboUI'
import { FormControlLabel, FormHelpText } from 'src/rsuite/shims'
import { SectionTitleUI } from 'src/widgets/workspace/SectionTitle'

export const Panel_Shortcuts = observer(function Panel_Shortcuts_() {
    const st = useSt()
    return (
        <div className='_MD flex flex-col gap-2 items-start p-2'>
            <SectionTitleUI label='Shortcuts' className='block' />
            <table>
                <thead>
                    <tr>
                        <th>when</th>
                        <th>shortcut</th>
                        <th>commands</th>
                    </tr>
                </thead>
                <tbody>
                    {st.shortcuts.shortcuts.map((s) => {
                        return (
                            <tr>
                                <td tw='p-1'>{s.when ?? <span tw='opacity-50 italic'>always</span>}</td>
                                <td tw='p-1'>
                                    {s.combos.map((c, ix) => (
                                        <ComboUI key={ix} combo={c} />
                                    ))}
                                </td>
                                <td tw='p-1'>{s.info}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <MessageInfoUI
                markdown={`\
This is unfinished.

A great contribution would be to make those shortcuts editable.

Interesting files:
- ./src/app/shortcuts/shortcuts.ts
- ./src/app/shortcuts/shorcutKeys.ts
`}
            ></MessageInfoUI>
        </div>
    )
})

export const FieldUI = observer(function FieldUI_(p: {
    required?: boolean
    label?: string
    help?: string
    children: React.ReactNode
}) {
    return (
        <div className='flex gap-2 items-center'>
            <FormControlLabel>{p.label}</FormControlLabel>
            {p.children}
            {p.required && <FormHelpText tw='join-item'>Required</FormHelpText>}
        </div>
    )
})
