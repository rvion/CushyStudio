import type { DropdownProps } from '../dropdown/Dropdown'
import type { Field } from '../model/Field'

import { UI } from '../components/UI'

export type WidgetPresetsProps = {
   field: Field
} & Omit<DropdownProps, 'title'>

export const WidgetPresetsUI = obs(function WidgetPresets({
   //own props
   field,

   // modified dropdown props
   button,
   content, // 🔶 discarded

   // rest
   ...rest
}: WidgetPresetsProps) {
   const presets = field.zConfig.presets
   const presetCount = presets?.length ?? 0
   if (presets == null) return null
   if (presetCount == 0) return null
   const title = `${presetCount} preset${presetCount > 1 ? 's' : ''}`
   return (
      <UI.Dropdown
         title={title}
         button={
            button ?? (
               <UI.Button
                  /* borderless */
                  tooltip={title}
                  tooltipPlacement='top'
                  subtle
                  borderless
                  icon={IKONS.mdiBookOutline}
                  // children={presetCount}
               />
            )
         }
         content={() => {
            return presets.map((preset) => (
               <UI.Dropdown.Item //
                  key={preset.label}
                  icon={preset.icon}
                  onClick={() => preset.apply(field)}
                  label={preset.label}
               />
            ))
         }}
         {...rest}
      />
   )
})
