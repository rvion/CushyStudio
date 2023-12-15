import { observer } from 'mobx-react-lite'
import { Widget, Widget_list } from 'src/controls/Widget'
import { Button, Message } from 'src/rsuite/shims'
import { ListControlsUI } from '../shared/ListControlsUI'
import { WidgetDI } from './WidgetUI.DI'
import SortableList, { SortableItem, SortableKnob } from 'react-easy-sort'
import { forwardRef } from 'react'
import { RevealUI } from 'src/rsuite/RevealUI'
import { isWidgetCollapsible } from '../shared/isWidgetCollapsible'

export const WidgetListUI = observer(function WidgetListUI_<T extends Widget>(p: { widget: Widget_list<T> }) {
    const req = p.widget
    const values = req.state.items
    const min = req.input.min
    const WidgetUI = WidgetDI.WidgetUI
    if (WidgetUI == null) return <Message type='error'>Internal list failure</Message>

    // const len = values.length
    // const indexWidth = len.toString().length
    return (
        <div className='_WidgetListUI' tw='flex-grow w-full'>
            <ListControlsUI req={p.widget} />
            <SortableList onSortEnd={p.widget.moveItem} className='list' draggedItemClassName='dragged'>
                <div tw='flex flex-col gap-1'>
                    {values.map((v, ix) => (
                        <SortableItem key={v.state.id}>
                            <div key={v.id} tw='flex flex-col'>
                                <div key={v.id} tw='flex items-start'>
                                    <SortableKnob>
                                        <ListDragHandleUI ix={ix} />
                                    </SortableKnob>
                                    <ListItemCollapseBtnUI req={v} />
                                    {v.state.collapsed && <WidgetUI widget={v} />}
                                    {!v.state.collapsed && <div tw='flex-1' />}
                                    <Button
                                        appearance='subtle'
                                        disabled={min ? req.state.items.length <= min : undefined}
                                        tw='self-start'
                                        onClick={() => req.removeItem(v)}
                                        size='sm'
                                    >
                                        X
                                    </Button>
                                </div>
                                {!v.state.collapsed && <WidgetUI widget={v} />}
                            </div>
                        </SortableItem>
                    ))}
                </div>
            </SortableList>
            <ListControlsUI req={p.widget} />
        </div>
    )
})

const ListDragHandleUI = forwardRef<HTMLDivElement, { ix: number }>((props, ref) => {
    return (
        <div ref={ref}>
            <RevealUI cursor='cursor-move'>
                <div tw='btn btn-sm btn-ghost opacity-50'>
                    <span className='material-symbols-outlined'>menu</span>
                </div>
                <div>{props.ix}</div>
            </RevealUI>
        </div>
    )
})

export const ListItemCollapseBtnUI = observer(function ListItemCollapseBtnUI_(p: { req: Widget }) {
    const v = p.req
    const isCollapsible = isWidgetCollapsible(p.req)
    if (!isCollapsible) return null
    return (
        <div
            tw='btn btn-ghost btn-sm'
            // style={{ width: `${indexWidth}rem` }}
            onClick={() => (v.state.collapsed = !Boolean(v.state.collapsed))}
        >
            {v.state.collapsed ? ( //
                <span className='material-symbols-outlined'>keyboard_arrow_right</span>
            ) : (
                <span className='material-symbols-outlined'>keyboard_arrow_down</span>
            )}
            {/* {ix} */}
        </div>
    )
})
