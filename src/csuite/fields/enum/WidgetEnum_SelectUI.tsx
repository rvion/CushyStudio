import type { Field_enum } from './FieldEnum'

import { observer } from 'mobx-react-lite'
import { useCallback } from 'react'

import { EnumSelectorUI } from './EnumSelectorUI'

export const WidgetEnum_SelectUI = observer(function WidgetEnum_SelectUI_(p: {
   //
   field: Field_enum<any>
}) {
   const field = p.field
   const enumName = field.config.enumName
   const clearable = useCallback(
      () => (field.canBeToggledWithinParent ? (): void => field.disableSelfWithinParent() : undefined),
      [field.canBeToggledWithinParent],
   )
   return (
      <EnumSelectorUI
         value={() => field.status}
         enumName={enumName}
         clearable={clearable}
         // substituteValue={req.status}
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
