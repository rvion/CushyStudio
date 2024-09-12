import type { Field_selectOne } from './FieldSelectOne'

import { observer } from 'mobx-react-lite'

import { Button } from '../../button/Button'

export const WidgetSelectOne_RollUI = observer(function WidgetSelectOne_RollUI_<VALUE, KEY extends string>(p: {
    field: Field_selectOne<VALUE, KEY>
}) {
    const field = p.field
    const selected = field.selectedId
    const idx = field.possibleKeys.findIndex((c) => c === selected)
    const curr = field.selectedOption
    if (curr == null) return null // 🔴 2024-08-02: domi: not sure what this UI is supposed to look like
    const nextId = field.possibleKeys[(idx + 1) % field.possibleKeys.length]

    return (
        <>
            <Button
                //
                subtle
                icon={curr.icon}
                disabled={nextId == null}
                onClick={() => (field.selectedId = nextId!)}
            >
                {curr.label}
            </Button>
        </>
    )
})
