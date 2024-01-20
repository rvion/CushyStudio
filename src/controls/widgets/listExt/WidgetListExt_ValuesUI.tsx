import type { Widget_listExt } from './WidgetListExt'

import { observer } from 'mobx-react-lite'
import { Widget } from 'src/controls/Widget'
import { Button } from 'src/rsuite/shims'
import { WidgetDI } from '../WidgetUI.DI'

export const WidgetListExt_ValuesUI = observer(function WidgetListExtValuesUI_<T extends Widget>(p: {
    //
    widget: Widget_listExt<T>
}) {
    const widget = p.widget
    const values = widget.entries
    const len = values.length
    const indexWidth = len < 10 ? 1 : len < 100 ? 2 : 3
    const WidgetUI = WidgetDI.WidgetUI
    const min = widget.config.min
    return (
        <div tw='flex flex-col gap-1'>
            {values.map((x, ix) => {
                const v = x.widget
                const proj = x.position
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
                        <WidgetUI widget={v} />
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
