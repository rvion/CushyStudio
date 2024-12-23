import type { Field } from '../model/Field'

import { observer } from 'mobx-react-lite'

import { Frame } from '../../csuite/frame/Frame'
import { IkonOf } from '../../csuite/icons/iconHelpers'

export type WidgetLabelIconProps = {
   className?: string
   field: Field
}

export const WidgetLabelIconUI = observer(function WidgetLabelIconUI_(p: WidgetLabelIconProps) {
   const iconName = p.field.icon
   if (iconName == null) return null
   return (
      <Frame //
         tw='UI-WidgetLabelIcon minh-widget flex items-center self-start'
         className={p.className}
         text={{ chroma: 0.2, contrast: 0.9 }}
      >
         <IkonOf name={iconName} />
      </Frame>
   )
})
