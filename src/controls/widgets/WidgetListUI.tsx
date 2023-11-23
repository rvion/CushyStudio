import { observer } from 'mobx-react-lite'
import { Widget, Widget_list } from 'src/controls/Widget'
import { Button, Message } from 'src/rsuite/shims'
import { ListControlsUI } from '../shared/ListControlsUI'
import { WidgetDI } from './WidgetUI.DI'
import SortableList, { SortableItem, SortableKnob } from 'react-easy-sort'
import { forwardRef } from 'react'
import { RevealUI } from 'src/rsuite/RevealUI'

export const WidgetListUI = observer(function WidgetListUI_<T extends Widget>(p: { req: Widget_list<T> }) {
    const req = p.req
    const values = req.state.items
    const min = req.input.min
    const WidgetUI = WidgetDI.WidgetUI
    if (WidgetUI == null) return <Message type='error'>Internal list failure</Message>

    const len = values.length
    const indexWidth = len.toString().length
    return (
        <div className='_WidgetListUI' tw='flex-grow w-full'>
            <ListControlsUI req={p.req} />
            <SortableList onSortEnd={p.req.moveItem} className='list' draggedItemClassName='dragged'>
                <div tw='flex flex-col gap-1'>
                    {values.map((v, ix) => (
                        <SortableItem key={v.state.id}>
                            <div key={v.id} tw='flex items-start'>
                                <SortableKnob>
                                    <CustomKnob ix={ix} />
                                </SortableKnob>
                                <Button
                                    style={{ width: `${indexWidth}rem` }}
                                    appearance='subtle'
                                    size='sm'
                                    onClick={() => (v.state.collapsed = !Boolean(v.state.collapsed))}
                                >
                                    {v.state.collapsed //
                                        ? '▸'
                                        : '▿'}
                                    {ix}
                                </Button>
                                <WidgetUI req={v} />
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
                        </SortableItem>
                    ))}
                </div>
            </SortableList>
        </div>
    )
})

const CustomKnob = forwardRef<HTMLDivElement, { ix: number }>((props, ref) => {
    return (
        <div ref={ref}>
            <RevealUI cursor='cursor-move'>
                <div tw='btn btn-sm btn-ghost'>
                    <span className='material-symbols-outlined'>menu</span>
                </div>
                <div>{props.ix}</div>
            </RevealUI>
        </div>
    )
})
