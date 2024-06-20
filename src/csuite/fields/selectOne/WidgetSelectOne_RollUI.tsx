import type { BaseSelectEntry, Widget_selectOne } from './WidgetSelectOne'

import { observer } from 'mobx-react-lite'

import { Button } from '../../button/Button'

export const WidgetSelectOne_RollUI = observer(function WidgetSelectOne_RollUI_<T extends BaseSelectEntry>(p: {
    widget: Widget_selectOne<T>
}) {
    const widget = p.widget
    const selected = widget.serial.val
    const idx = widget.choices.findIndex((c) => c.id === selected?.id)
    const curr = widget.value
    const next = widget.choices[(idx + 1) % widget.choices.length]

    return (
        <>
            <Button
                //
                subtle
                icon={curr.icon}
                disabled={next == null}
                onClick={() => (widget.value = next!)}
            >
                {curr.label}
            </Button>
        </>
    )
})
