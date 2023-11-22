import { observer } from 'mobx-react-lite'
import { Widget, Widget_listExt } from 'src/controls/Widget'
import { Button, Joined, Message } from 'src/rsuite/shims'
import { WidgetDI } from './WidgetUI.DI'
import { InputNumberUI } from 'src/rsuite/InputNumberUI'

export const WidgetListExtUI = observer(function WidgetListExtUI_<T extends Widget>(p: { req: Widget_listExt<T> }) {
    if (p.req.input.mode === 'timeline') return <WidgetListExtUI_timeline req={p.req} />
    if (p.req.input.mode === 'regional') return <WidgetListExtUI_timeline req={p.req} />
    return <WidgetListExtUI_timeline req={p.req} />
})

export const WidgetListExtUI_timeline = observer(function WidgetListExtUI_timeline_<T extends Widget>(p: {
    req: Widget_listExt<T>
}) {
    const req = p.req
    const values = req.state.items
    const max = req.input.max
    const min = req.input.min
    const WidgetUI = WidgetDI.WidgetUI
    if (WidgetUI == null) return <Message type='error'>Internal list failure</Message>

    const len = values.length
    const indexWidth = len < 10 ? 1 : len < 100 ? 2 : 3
    return (
        <div className='_WidgetListExtUI' tw='flex-grow w-full'>
            <Joined>
                <Button
                    tw='btn-sm join-item btn-ghost'
                    disabled={max ? req.state.items.length >= max : undefined}
                    icon={<span className='material-symbols-outlined'>add</span>}
                    onClick={() => req.addItem()}
                >
                    Add
                </Button>
                <Button
                    tw='btn-sm join-item btn-ghost'
                    disabled={max ? req.state.items.length >= max : undefined}
                    icon={<span className='material-symbols-outlined'>delete_forever</span>}
                    onClick={() => req.removemAllItems()}
                >
                    Clear
                </Button>
                <Button
                    tw='btn-sm join-item btn-ghost'
                    disabled={max ? req.state.items.length >= max : undefined}
                    icon={<span className='material-symbols-outlined'>unfold_less</span>}
                    onClick={() => req.collapseAllItems()}
                >
                    Collapse all
                </Button>
                <Button
                    tw='btn-sm join-item btn-ghost'
                    disabled={max ? req.state.items.length >= max : undefined}
                    icon={<span className='material-symbols-outlined'>unfold_more</span>}
                    onClick={() => req.expandAllItems()}
                >
                    Expand All
                </Button>
                {/* <Button
                    tw='btn-sm join-item btn-ghost'
                    disabled={max ? req.state.items.length >= max : undefined}
                    icon={<span className='material-symbols-outlined'>add</span>}
                    onClick={() => {
                        for (let i = 0; i < 100; i++) req.addItem()
                    }}
                >
                    Add 100 more
                </Button> */}
            </Joined>
            <InputNumberUI mode='int' onValueChange={(next) => (req.state.w = next)} />
            <InputNumberUI mode='int' onValueChange={(next) => (req.state.h = next)} />
            <div tw='flex flex-col gap-1'>
                {values.map((x, ix) => {
                    const v = x.item
                    return (
                        <div key={v.id} tw='flex items-start'>
                            <Button
                                style={{ width: `${indexWidth}rem` }}
                                // tw='absolute left-0'
                                appearance='subtle'
                                size='sm'
                                onClick={() => (v.state.collapsed = !Boolean(v.state.collapsed))}
                            >
                                {v.state.collapsed ? '▸' : '▿'}
                                {ix}
                            </Button>
                            {v.state.collapsed ? null : (
                                <div>
                                    [x={x.x}, y={x.y}, w={x.w}, h={x.h}]
                                </div>
                            )}
                            <WidgetUI req={v} />
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
        </div>
    )
})
