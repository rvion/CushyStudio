import type { BaseSelectEntry, Field_selectOne } from './FieldSelectOne'

import { observer } from 'mobx-react-lite'

import { Button } from '../../button/Button'

export const WidgetSelectOne_RollUI = observer(function WidgetSelectOne_RollUI_<T extends BaseSelectEntry>(p: {
    field: Field_selectOne<T>
}) {
    const field = p.field
    const selected = field.serial.val
    const idx = field.choices.findIndex((c) => c.id === selected?.id)
    const curr = field.value
    const next = field.choices[(idx + 1) % field.choices.length]

    return (
        <>
            <Button
                //
                subtle
                icon={curr.icon}
                disabled={next == null}
                onClick={() => (field.value = next!)}
            >
                {curr.label}
            </Button>
        </>
    )
})
