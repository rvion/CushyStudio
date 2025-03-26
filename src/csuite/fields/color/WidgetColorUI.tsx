import type { Field_color } from './FieldColor'

export const WidgetColorUI = obs(function WidgetColorUI_(p: { field: Field_color }) {
   const field = p.field
   return (
      <input //
         value={field.serial.value}
         type='color'
         onBlur={() => field.touch()}
         onChange={(ev) => {
            field.value = ev.target.value
            p.field.touch()
         }}
      />
   )
})
