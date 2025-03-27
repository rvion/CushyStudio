import type { Field_enum } from './FieldEnum'

import { useMemo } from 'react'

import { EnumSelectorUI } from './EnumSelectorUI'

export const WidgetEnum_SelectUI = obs(function WidgetEnum_SelectUI_(p: { field: Field_enum<any> }) {
   const field = p.field
   const slotName = field.ϟconfig.slotName
   const clearable = useMemo(
      () => (field.ϟcanBeToggledWithinParent ? (): void => field.ϟdisableSelfWithinParent() : undefined),
      [field.ϟcanBeToggledWithinParent],
   )
   return (
      <EnumSelectorUI
         value={() => field.status}
         slotName={slotName}
         clearable={clearable}
         onChange={(e) => {
            if (e == null) return // ❓
            field.ϟvalue = e
         }}
      />
   )
   // <>
   //     {/* <InstallModelBtnUI widget={widget} modelFolderPrefix={} /> */}
   //     <Button icon={IKONS.mdiUndoVariant} disabled={!widget.hasChanges} onClick={() => widget.reset()}></Button>
   // </>
})
