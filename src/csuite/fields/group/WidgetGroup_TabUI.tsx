import type { Field_group } from './FieldGroup'

import { useId, useState } from 'react'

import { InputBoolCheckboxUI } from '../../checkbox/InputBoolCheckboxUI'

export const WidgetGroup_TabUI = obs(function WidgetGroup_TabUI_(p: {
   className?: string
   field: Field_group<any>
   defaultTab?: string
}) {
   const groupFields = p.field.zSubFieldsWithKeys
   const keys = groupFields.map((s) => s.key)
   const [tabId, setTabId] = useState(() => p.defaultTab ?? keys[0]!)
   const uid = useId()
   return (
      <div tw='flex'>
         <div>
            {keys.map((fieldName, ix) => {
               return (
                  <InputBoolCheckboxUI
                     toggleGroup={uid.toString()}
                     key={ix}
                     value={tabId === fieldName}
                     onClick={() => setTabId(fieldName)}
                  >
                     {fieldName}
                  </InputBoolCheckboxUI>
               )
            })}
         </div>
         <div>{p.field.zFields[tabId]?.render() ?? 'Aucun onglet selectionné'}</div>
      </div>
   )
})
