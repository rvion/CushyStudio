import type { Field_group } from './FieldGroup'
import type { ReactNode } from 'react'

import { Button } from '../../button/Button'
import { UI } from '../../components/UI'
import { WidgetSingleLineSummaryUI } from '../../form/WidgetSingleLineSummaryUI'

// HEADER
export const WidgetGroup_LineUI = obs(function WidgetGroup_LineUI_(p: {
   //
   field: Field_group<any>
}) {
   const field = p.field
   if (p.field.zSerial.collapsed)
      return <WidgetSingleLineSummaryUI>{p.field.zSummary}</WidgetSingleLineSummaryUI>

   const preferences = cushy.preferences
   const presets = field.zConfig.presets
   const presetCount = presets?.length ?? 0
   const out: ReactNode[] = []
   const showFoldButtons = preferences.interface.zValue.widget.showFoldButtons
   const hasFoldableSubfields = field.zHasFoldableSubfields
   if (presets && presetCount > 0 && field.zConfig.presetButtons) {
      out.push(
         ...presets.map((preset, ix) => (
            <UI.Button //
               key={preset.label + ix}
               // square
               // subtle
               icon={preset.icon}
               onClick={(ev) => {
                  preset.apply(field)
                  ev.stopPropagation()
                  field.zTouch()
               }}
               children={preset.label}
            />
         )),
      )
   }
   if (showFoldButtons && hasFoldableSubfields) {
      out.push(
         <div tw='ml-auto flex gap-0.5' key='lShd8JZuFZ'>
            <Button //
               square
               subtle
               borderless
               icon={IKONS.mdiUnfoldMoreHorizontal}
               disabled={!field.zHasFoldableSubfieldsThatAreFolded}
               onClick={() => {
                  p.field.zExpandAllChildren()
                  field.zTouch()
               }}
            />

            <Button //
               square
               subtle
               borderless
               icon={IKONS.mdiUnfoldLessHorizontal}
               disabled={!field.zHasFoldableSubfieldsThatAreUnfolded}
               onClick={() => {
                  p.field.zCollapseAllChildren()
                  field.zTouch()
               }}
            />
         </div>,
      )
   }
   if (out.length == 0) return null
   return out
})
