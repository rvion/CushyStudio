import type { Field_enum } from './FieldEnum'

import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'

import { EnumSelectorUI } from './EnumSelectorUI'

export const WidgetEnum_SelectUI = observer(function WidgetEnum_SelectUI_(p: { field: Field_enum<any> }) {
   const field = p.field
   const slotName = field.config.slotName
   const clearable = useMemo(
      () => (field.canBeToggledWithinParent ? (): void => field.disableSelfWithinParent() : undefined),
      [field.canBeToggledWithinParent],
   )
   return (
      <EnumSelectorUI
         value={() => field.status}
         slotName={slotName}
         clearable={clearable}
         onChange={(e) => {
            if (e == null) return // ❓
            field.value = e
         }}
      />
   )
   // <>
   //     {/* <InstallModelBtnUI widget={widget} modelFolderPrefix={} /> */}
   //     <Button icon='mdiUndoVariant' disabled={!widget.hasChanges} onClick={() => widget.reset()}></Button>
   // </>
})
