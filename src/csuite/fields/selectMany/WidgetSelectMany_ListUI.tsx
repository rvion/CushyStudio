import type { Field_selectMany } from './FieldSelectMany'

import { ToggleButtonUI } from '../../checkbox/InputBoolToggleButtonUI'
import { ResizableFrame } from '../../resizableFrame/resizableFrameUI'
import { makeLabelFromPrimitiveValue } from '../../utils/makeLabelFromFieldName'
import { convertSelectKeyToReactKey, type SelectKey } from '../selectOne/SelectOneKey'

export const WidgetSelectMany_ListUI = obs(function WidgetSelectMany_ListUI_<
   VALUE,
   KEY extends SelectKey,
>(p: { field: Field_selectMany<VALUE, KEY> }) {
   const field = p.field
   return (
      <ResizableFrame border tw='w-full'>
         {field.options.slice(0, 100).map((c) => {
            const isSelected = field.selectedKeys.includes(c.id)
            return (
               <ToggleButtonUI
                  key={convertSelectKeyToReactKey(c.id)}
                  value={isSelected}
                  mode='checkbox'
                  showToggleButtonBox
                  tw='w-full [&>p]:text-start' // ❌ misc
                  text={c.label ?? makeLabelFromPrimitiveValue(c.id)}
                  onValueChange={(value) => {
                     if (value != isSelected) field.toggleId(c.id)
                     field.zTouch()
                  }}
                  onBlur={() => field.zTouch()}
                  toggleGroup={p.field.zUid}
               />
            )
         })}
      </ResizableFrame>
   )
})
