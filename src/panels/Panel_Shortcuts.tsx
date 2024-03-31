import { observer } from 'mobx-react-lite'

import { ComboUI } from '../app/shortcuts/ComboUI'
import { FormHelpTextUI } from '../rsuite/shims'
import { useSt } from '../state/stateContext'
import { SectionTitleUI } from '../widgets/workspace/SectionTitle'
import { MessageInfoUI } from './MessageUI'

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
            <label>{p.label}</label>
            {p.children}
            {p.required && <FormHelpTextUI tw='join-item'>Required</FormHelpTextUI>}
        </div>
    )
})
