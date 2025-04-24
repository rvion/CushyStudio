import type { Field } from '../model/Field'

import { Frame } from '../../csuite/frame/Frame'
import { IkonOf } from '../../csuite/icons/iconHelpers'

export type WidgetLabelIconProps = {
   className?: string
   field: Field
}

export const WidgetLabelIconUI = obs(function WidgetLabelIconUI_(p: WidgetLabelIconProps) {
   const iconName = p.field.zIcon
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

export const WidgetLabelIconPlacholderUI = obs(function WidgetLabelIconPlacholderUI_(
   p: WidgetLabelIconProps,
) {
   return (
      <Frame //
         tw='UI-WidgetLabelIcon minh-widget flex items-center self-start'
         className={p.className}
         text={{ chroma: 0.2, contrast: 0.9 }}
      >
         <IkonOf name={p.field.zIcon ?? IKONS._} />
      </Frame>
   )
})
