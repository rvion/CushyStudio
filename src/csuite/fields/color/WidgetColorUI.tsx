import type { Field_color } from './FieldColor'

export const WidgetColorUI = obs(function WidgetColorUI_(p: { field: Field_color }) {
   const field = p.field
   return (
      <input //
         value={field.ϟserial.value}
         type='color'
         onBlur={() => field.ϟtouch()}
         onChange={(ev) => {
            field.ϟvalue = ev.target.value
            p.field.ϟtouch()
         }}
      />
   )
})
