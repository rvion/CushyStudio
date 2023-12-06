import { observer } from 'mobx-react-lite'
import { Widget, Widget_listExt } from 'src/controls/Widget'
import { Button } from 'src/rsuite/shims'
import { WidgetDI } from './WidgetUI.DI'

export const WidgetListExt_ValuesUI = observer(function WidgetListExtValuesUI_<T extends Widget>(p: { req: Widget_listExt<T> }) {
    const req = p.req
    const values = req.state.items
    const len = values.length
    const indexWidth = len < 10 ? 1 : len < 100 ? 2 : 3
    const WidgetUI = WidgetDI.WidgetUI
    const min = req.input.min
    return (
        <div tw='flex flex-col gap-1'>
            {values.map((x, ix) => {
                const v = x.item
                return (
                    <div key={v.id} tw='flex items-start'>
                        <div style={{ width: `${indexWidth}rem` }}>{ix}</div>
                        <input value={x.fill} onChange={(ev) => (x.fill = ev.target.value)} type='color' tw='w-7'></input>
                        <Button
                            style={{ width: `${indexWidth}rem` }}
                            appearance='subtle'
                            size='sm'
                            onClick={() => (v.state.collapsed = !Boolean(v.state.collapsed))}
                        >
                            {v.state.collapsed ? '▸' : '▿'}
                        </Button>
                        <WidgetUI widget={v} />
                        <Button
                            appearance='subtle'
                            disabled={min ? req.state.items.length <= min : undefined}
                            tw='self-start'
                            onClick={() => req.removeItem(x)}
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
