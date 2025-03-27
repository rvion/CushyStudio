import type { Field_color } from './FieldColor'

export const WidgetColorUI = obs(function WidgetColorUI_(p: { field: Field_color }) {
   const field = p.field
   return (
      <input //
         value={field.zSerial.value}
         type='color'
         onBlur={() => field.zTouch()}
         onChange={(ev) => {
            field.zValue = ev.target.value
            p.field.zTouch()
         }}
      />
   )
})
