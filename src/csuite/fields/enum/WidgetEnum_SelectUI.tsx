import type { Field_enum } from './FieldEnum'

import { useMemo } from 'react'

import { EnumSelectorUI } from './EnumSelectorUI'

export const WidgetEnum_SelectUI = obs(function WidgetEnum_SelectUI_(p: { field: Field_enum<any> }) {
   const field = p.field
   const slotName = field.zConfig.slotName
   const clearable = useMemo(
      () => (field.zCanBeToggledWithinParent ? (): void => field.zDisableSelfWithinParent() : undefined),
      [field.zCanBeToggledWithinParent],
   )
   return (
      <EnumSelectorUI
         value={() => field.status}
         slotName={slotName}
         clearable={clearable}
         onChange={(e) => {
            if (e == null) return // ❓
            field.zValue = e
         }}
      />
   )
   // <>
   //     {/* <InstallModelBtnUI widget={widget} modelFolderPrefix={} /> */}
   //     <Button icon={IKONS.mdiUndoVariant} disabled={!widget.hasChanges} onClick={() => widget.reset()}></Button>
   // </>
})
