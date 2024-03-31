import type { Widget_listExt } from './WidgetListExt'
import type { Spec } from '../../Spec'

import { observer } from 'mobx-react-lite'

import { WidgetWithLabelUI } from '../../shared/WidgetWithLabelUI'
import { Button } from '../../../rsuite/shims'

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
            {values.map((sub, ix) => {
                const subWidget = sub.widget
                const proj = sub.shape
                return (
                    <div key={subWidget.id} tw='flex items-start'>
                        <div style={{ width: `${indexWidth}rem` }}>{ix}</div>
                        <input value={proj.fill} onChange={(ev) => (proj.fill = ev.target.value)} type='color' tw='w-7'></input>
                        <Button
                            style={{ width: `${indexWidth}rem` }}
                            appearance='subtle'
                            size='sm'
                            onClick={() => subWidget.setCollapsed(!Boolean(subWidget.serial.collapsed))}
                        >
                            {subWidget.serial.collapsed ? '▸' : '▿'}
                        </Button>
                        <WidgetWithLabelUI rootKey={subWidget.id} widget={subWidget} />
                        <Button
                            appearance='subtle'
                            disabled={min ? widget.entries.length <= min : undefined}
                            tw='self-start'
                            onClick={() => widget.removeItem(subWidget)}
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
