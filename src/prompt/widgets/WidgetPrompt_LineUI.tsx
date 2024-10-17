import type { Field_prompt } from '../FieldPrompt'

import { observer } from 'mobx-react-lite'

import { WidgetSingleLineSummaryUI } from '../../csuite/form/WidgetSingleLineSummaryUI'

export const WidgetPrompt_LineUI = observer(function WidgetPrompt_LineUI_(p: { field: Field_prompt }) {
    const field = p.field
    if (field.serial.collapsed) return <WidgetSingleLineSummaryUI>{field.serial.val}</WidgetSingleLineSummaryUI>
    return null
    //         {/* <Button
    //             onClick={() => cushy.layout.addCustomV2(PromptEditorUI, { promptID: field.id })}
    //             icon='mdiAbacus'
    //             subtle
    //             square
    //         /> */}
})
