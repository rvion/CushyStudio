import type { Field_prompt } from '../FieldPrompt'

import { WidgetSingleLineSummaryUI } from '../../csuite/form/WidgetSingleLineSummaryUI'

export const WidgetPrompt_LineUI = obs(function WidgetPrompt_LineUI_(p: { field: Field_prompt }) {
   const field = p.field
   if (field.zSerial.collapsed)
      return <WidgetSingleLineSummaryUI>{field.zSerial.val}</WidgetSingleLineSummaryUI>
   return null
   //         {/* <Button
   //             onClick={() => cushy.layout.addCustomV2(PromptEditorUI, { promptID: field._uid })}
   //             icon={IKONS.mdiAbacus}
   //             subtle
   //             square
   //         /> */}
})
