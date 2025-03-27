import type { Field_group } from './FieldGroup'
import type { ReactNode } from 'react'

import { Button } from '../../button/Button'
import { UI } from '../../components/UI'
import { useCSuite } from '../../ctx/useCSuite'

// import { WidgetSingleLineSummaryUI } from '../../form/WidgetSingleLineSummaryUI'

export const WidgetGroup_LineUI = obs(function WidgetGroup_LineUI_(p: { field: Field_group<any> }) {
   const field = p.field
   // if (p.field.serial.collapsed)
   //    return <WidgetSingleLineSummaryUI>{p.field.summary}</WidgetSingleLineSummaryUI>
   const preferences = cushy.preferences

   const presets = field.ϟconfig.presets
   const presetCount = presets?.length ?? 0
   const out: ReactNode[] = []
   const showFoldButtons = preferences.interface.ϟvalue.widget.showFoldButtons
   const hasFoldableSubfields = field.ϟhasFoldableSubfields
   if (presets && presetCount > 0 && field.ϟconfig.presetButtons) {
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
                  field.ϟtouch()
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
               disabled={!field.ϟhasFoldableSubfieldsThatAreFolded}
               onClick={() => {
                  p.field.ϟexpandAllChildren()
                  field.ϟtouch()
               }}
            />

            <Button //
               square
               subtle
               borderless
               icon={IKONS.mdiUnfoldLessHorizontal}
               disabled={!field.ϟhasFoldableSubfieldsThatAreUnfolded}
               onClick={() => {
                  p.field.ϟcollapseAllChildren()
                  field.ϟtouch()
               }}
            />
         </div>,
      )
   }
   if (out.length == 0) return null
   return out
})
