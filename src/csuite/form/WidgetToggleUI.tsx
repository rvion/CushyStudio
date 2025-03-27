import type { Field } from '../model/Field'

import { InputBoolUI } from '../checkbox/InputBoolUI'

export type WidgetToggleProps = {
   className?: string
   field: Field
}

export const WidgetToggleUI = obs(function WidgetToggleUI_(p: WidgetToggleProps) {
   const isTogglable = p.field.ϟcanBeToggledWithinParent
   if (!isTogglable) return null
   // if (!isFieldOptional(p.field)) return
   // const field = p.field as Field_optional
   const isActive = p.field.ϟisEnabledWithinParent
   return (
      <InputBoolUI // toggle to activate/deactivate the optional widget
         toggleGroup={p.field.ϟuid}
         tw='UI-WidgetToggle !self-center'
         className={p.className}
         value={isActive}
         expand={false}
         onValueChange={(value) =>
            isActive //
               ? p.field.ϟdisableSelfWithinParent()
               : p.field.ϟenableSelfWithinParent()
         }
      />
   )
})
