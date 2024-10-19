import type { Field } from '../../../csuite/model/Field'

import { observer } from 'mobx-react-lite'

import { csuiteConfig } from '../../../csuite/config/configureCsuite'
import { Ikon } from '../../../csuite/icons/iconHelpers'
import { MessageInfoUI } from '../../../csuite/messages/MessageInfoUI'
import { normalizeProblem } from '../../../csuite/model/Validation'
import { RevealUI } from '../../../csuite/reveal/RevealUI'

/** default error block */

export const WidgetConfigErrorsUI = observer(function WidgetConfigErrorsUI_(p: { field: Field }) {
    // 💬 2024-09-17 rvion:
    // | this component is only visible during dev
    if (!csuiteConfig.isDev) return null

    const field = p.field
    const configPbs = normalizeProblem(field.ownConfigSpecificProblems)
    if (configPbs.length === 0) return null
    return (
        <MessageInfoUI title={`Field Config Invalid (ONLY VISIBLE DURING DEV)`}>
            {configPbs.map((e, i) => (
                // 🦀 Added `h-input` to make it less ugly, but not sure if it's the right way
                <RevealUI key={i} trigger={'click'} content={() => e.longerMessage ?? 'no extra infos'}>
                    <div tw='h-input flex items-center gap-1'>
                        <Ikon.mdiNinja />
                        {e.message}
                    </div>
                </RevealUI>
            ))}
        </MessageInfoUI>
    )
})
