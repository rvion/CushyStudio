import type { WidgetPromptUISt } from '../WidgetPromptUISt'

import { observer } from 'mobx-react-lite'

export const Plugin_PreviewPromptUI = observer(function Plugin_PreviewPromptUI_(p: {
    //
    uist: WidgetPromptUISt
}) {
    const uist = p.uist
    return (
        <div>
            <pre tw='whitespace-pre-wrap text-sm'>{uist.compiled.promptIncludingBreaks}</pre>
            {/* <pre tw='whitespace-pre-wrap text-sm'>{uist.compiled.negativePrompt}</pre> */}
        </div>
    )
})
