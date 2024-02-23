import type { Widget_listExt } from './WidgetListExt'
import type { Spec } from 'src/controls/Prop'

import { observer } from 'mobx-react-lite'

import { WidgetWithLabelUI } from 'src/controls/shared/WidgetWithLabelUI'
import { Button } from 'src/rsuite/shims'

export const WidgetListExt_ValuesUI = observer(function WidgetListExtValuesUI_<T extends Spec>(p: {
    //
    widget: Widget_listExt<T>
}) {
    const widget = p.widget
    const values = widget.entries
    const len = values.length
    const indexWidth = len < 10 ? 1 : len < 100 ? 2 : 3
    const min = widget.config.min
    return (
        <div tw='flex flex-col gap-1'>
            {values.map((x, ix) => {
                const v = x.widget
                const proj = x.shape
                return (
                    <div key={v.id} tw='flex items-start'>
                        <div style={{ width: `${indexWidth}rem` }}>{ix}</div>
                        <input value={proj.fill} onChange={(ev) => (proj.fill = ev.target.value)} type='color' tw='w-7'></input>
                        <Button
                            style={{ width: `${indexWidth}rem` }}
                            appearance='subtle'
                            size='sm'
                            onClick={() => (v.serial.collapsed = !Boolean(v.serial.collapsed))}
                        >
                            {v.serial.collapsed ? '▸' : '▿'}
                        </Button>
                        <WidgetWithLabelUI rootKey={v.id} widget={v} />
                        <Button
                            appearance='subtle'
                            disabled={min ? widget.entries.length <= min : undefined}
                            tw='self-start'
                            onClick={() => widget.removeItem(v)}
                            size='sm'
                        >
                            X
                        </Button>
                    </div>
                )
            })}
        </div>
    )
})
