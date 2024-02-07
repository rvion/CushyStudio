import type { WidgetPromptUISt } from '../WidgetPromptUISt'

import { observer } from 'mobx-react-lite'

export const Plugin_DebugAST = observer(function Plugin_DebugAST_(p: {
    //
    uist: WidgetPromptUISt
}) {
    const uist = p.uist
    return (
        <div>
            <pre tw='virtualBorder whitespace-pre-wrap text-xs bg-base-200'>{uist.debugView}</pre>
        </div>
    )
})
