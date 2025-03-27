import type { SchemaDict } from '../../model/SchemaDict'
import type { Field_choices } from './FieldChoices'

import { Button } from '../../button/Button'
import { InputBoolUI } from '../../checkbox/InputBoolUI'
import { useCSuite } from '../../ctx/useCSuite'
import { getJustifyContent } from './TabPositionConfig'

// ============================================================================================================

export const WidgetChoices_TabHeaderUI = obs(function WidgetChoicesTab_LineUI_<T extends SchemaDict>(p: {
   field: Field_choices<T>
}) {
   const field = p.field
   const choices = field.choicesWithLabels // choicesStr.map((v) => ({ key: v }))
   const csuite = useCSuite()

   const isActive = !p.field.zCanBeToggledWithinParent || !p.field.zIsInsideDisabledBranch

   return (
      <div
         tw='flex flex-1 select-none flex-wrap gap-x-1 gap-y-0.5 rounded'
         style={{ justifyContent: getJustifyContent(field.zConfig.tabPosition) }}
      >
         {choices.map((c) => {
            const isSelected = isActive && field.isBranchEnabled(c.key) // serial.branches[c.key]
            return (
               <InputBoolUI
                  icon={c.icon}
                  key={c.key}
                  value={isSelected}
                  display='button'
                  mode={p.field.isMulti ? 'checkbox' : 'radio'}
                  text={c.label ?? c.key}
                  box={isSelected ? undefined : { text: csuite.labelText }}
                  onValueChange={(value) => {
                     if (p.field.zCanBeToggledWithinParent) p.field.zEnableSelfWithinParent()
                     if (value != isSelected) {
                        field.toggleBranch(c.key)
                     }
                     p.field.zTouch()
                  }}
                  toggleGroup={field.zUid}
               />
            )
         })}
         {p.field.zCanBeToggledWithinParent && (
            <Button
               tw='flex-shrink flex-grow-0'
               size='input'
               borderless
               subtle
               square
               icon={IKONS.mdiClose}
               disabled={!isActive}
               onClick={() => {
                  p.field.zDisableSelfWithinParent()
                  p.field.zTouch()
               }}
            />
         )}
      </div>
   )
})
