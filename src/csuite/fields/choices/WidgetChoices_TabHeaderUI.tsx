import type { SchemaDict } from '../../model/SchemaDict'
import type { Field_choices } from './FieldChoices'

import { observer } from 'mobx-react-lite'

import OverflowingRowUI from '../../../panels/PanelDraft/OverflowingRowUI'
import { Button } from '../../button/Button'
import { InputBoolUI } from '../../checkbox/InputBoolUI'
import { useCSuite } from '../../ctx/useCSuite'
import { Frame } from '../../frame/Frame'
import { getJustifyContent } from './TabPositionConfig'

// ============================================================================================================

export const WidgetChoices_TabHeaderUI = observer(function WidgetChoicesTab_LineUI_<T extends SchemaDict>(p: {
   field: Field_choices<T>
}) {
   const field = p.field
   const choices = field.choicesWithLabels // choicesStr.map((v) => ({ key: v }))
   const csuite = useCSuite()
   const isActive = !p.field.canBeToggledWithinParent || !p.field.isInsideDisabledBranch
   return (
      <div
         tw='flex flex-1 select-none flex-wrap gap-x-1 gap-y-0.5 rounded'
         style={{ justifyContent: getJustifyContent(field.config.tabPosition) }}
      >
         {choices.map((c) => {
            const isSelected = isActive && field.isBranchEnabled(c.key) // serial.branches[c.key]
            return (
               <InputBoolUI
                  toggleGroup={field.id}
                  icon={c.icon}
                  key={c.key}
                  value={isSelected}
                  display='button'
                  mode={p.field.isMulti ? 'checkbox' : 'radio'}
                  text={c.label ?? c.key}
                  box={isSelected ? undefined : { text: csuite.labelText }}
                  onValueChange={(value) => {
                     // 🔴 seems dubious
                     p.field.enableSelfWithinParent()

                     if (value != isSelected) {
                        field.toggleBranch(c.key)
                     }
                     p.field.touch()
                  }}
               />
            )
         })}
         {p.field.canBeToggledWithinParent && (
            <Button
               tw='flex-shrink flex-grow-0'
               size='input'
               borderless
               subtle
               square
               icon='mdiClose'
               disabled={!isActive}
               onClick={() => {
                  p.field.disableSelfWithinParent()
                  p.field.touch()
               }}
            />
         )}
      </div>
   )
})

export const WidgetChoices_TabHeaderSingleLineUI = observer(function WidgetChoices_TabHeaderSingleLine<
   T extends SchemaDict,
>(p: { field: Field_choices<T> }) {
   const field = p.field
   const choices = field.choicesWithLabels // choicesStr.map((v) => ({ key: v }))
   const csuite = useCSuite()
   return (
      <Frame tw='h-widget grid grid-rows-1' expand>
         <OverflowingRowUI tw='gap-1'>
            {choices.map((c) => {
               const isSelected = field.isBranchEnabled(c.key) // serial.branches[c.key]
               return (
                  <InputBoolUI
                     toggleGroup={field.id}
                     icon={c.icon}
                     key={c.key}
                     value={isSelected}
                     display='button'
                     mode={p.field.isMulti ? 'checkbox' : 'radio'}
                     text={c.label ?? c.key}
                     box={isSelected ? undefined : { text: csuite.labelText }}
                     onValueChange={(value) => {
                        if (value != isSelected) {
                           field.toggleBranch(c.key)
                        }
                     }}
                  />
               )
            })}
         </OverflowingRowUI>
      </Frame>
   )
})
