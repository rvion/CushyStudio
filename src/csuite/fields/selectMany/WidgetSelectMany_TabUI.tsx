import type { SelectKey } from '../selectOne/SelectOneKey'
import type { Field_selectMany } from './FieldSelectMany'

import { InputBoolUI } from '../../checkbox/InputBoolUI'
import { makeLabelFromPrimitiveValue } from '../../utils/makeLabelFromFieldName'
import { getJustifyContent } from '../choices/TabPositionConfig'
import { convertSelectKeyToReactKey } from '../selectOne/SelectOneKey'

export const WidgetSelectMany_TabUI = obs(function WidgetSelectMany_TabUI_<VALUE, KEY extends SelectKey>(p: {
   field: Field_selectMany<VALUE, KEY>
}) {
   const field = p.field

   return (
      <div>
         <div
            tw='flex select-none flex-wrap gap-x-0.5 gap-y-0 rounded'
            style={{ justifyContent: getJustifyContent(field.ϟconfig.tabPosition) }}
         >
            {p.field.options.map((option) => {
               const isSelected = field.selectedKeys.includes(option.id)

               return (
                  <InputBoolUI
                     key={convertSelectKeyToReactKey(option.id)}
                     value={isSelected}
                     display='button'
                     text={option.label ?? makeLabelFromPrimitiveValue(option.id)}
                     onValueChange={(value) => {
                        if (value != isSelected) field.toggleId(option.id)
                        field.ϟtouch()
                     }}
                     onBlur={() => field.ϟtouch()}
                     toggleGroup={p.field.ϟuid}
                  />
               )
            })}

            {/* ERROR ITEMS (items that are no longer valid to pick from) */}
            {/* We need to display them so we can properly uncheck them. */}
            {field.selectedKeys
               .filter((v) => !field.possibleKeys.includes(v))
               .map((missingId) => (
                  <InputBoolUI
                     key={convertSelectKeyToReactKey(missingId)}
                     value={true}
                     style={{ border: '1px solid oklch(var(--er))' }}
                     display='button'
                     text={makeLabelFromPrimitiveValue(missingId)}
                     onValueChange={(value) => {
                        field.toggleId(missingId)
                        field.ϟtouch()
                     }}
                     onBlur={() => field.ϟtouch()}
                     toggleGroup={p.field.ϟuid}
                  />
               ))}
         </div>
      </div>
   )
})
