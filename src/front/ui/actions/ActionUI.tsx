import { observer } from 'mobx-react-lite'
import { Message } from 'rsuite'
import { PossibleActionFile, ToolAndCode } from 'src/back/PossibleActionFile'
import { DraftL } from 'src/models/Draft'
import { ActionFormUI } from './ActionFormUI'

export const ActionUI = observer(function ActionUI_(p: {
    //
    paf: PossibleActionFile
    tac: ToolAndCode
}) {
    const toolsR = p.tac.tools
    if (!toolsR.success) {
        return (
            <Message type='error'>
                <pre tw='bg-red-900'>{JSON.stringify(toolsR.error, null, 4)}</pre>
            </Message>
        )
    }
    const tool = toolsR.value[0]
    const focusedDraft: Maybe<DraftL> = tool?.focusedDraft.item
    if (focusedDraft == null) return <>no draft selected</>
    return <ActionFormUI paf={p.paf} draft={focusedDraft} />
})
