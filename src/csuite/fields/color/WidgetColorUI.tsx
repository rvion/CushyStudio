import type { Field_color } from './FieldColor'

import { observer } from 'mobx-react-lite'

export const WidgetColorUI = observer(function WidgetColorUI_(p: { field: Field_color }) {
    const field = p.field
    return (
        <input //
            value={field.serial.value}
            type='color'
            onChange={(ev) => (field.value = ev.target.value)}
        />
    )
})
