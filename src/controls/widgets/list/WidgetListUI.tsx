import type { Widget_listExt } from '../listExt/WidgetListExt'
import type { IWidget } from 'src/controls/IWidget'
import type { Spec } from 'src/controls/Spec'

import { observer } from 'mobx-react-lite'
import { forwardRef } from 'react'
import SortableList, { SortableItem, SortableKnob } from 'react-easy-sort'
import { ErrorBoundary } from 'react-error-boundary'

import { Widget_list } from './WidgetList'
import { getBorderStatusForWidget } from 'src/controls/shared/getBorderStatusForWidget'
import { ListControlsUI } from 'src/controls/widgets/list/ListControlsUI'
import { ErrorBoundaryFallback } from 'src/widgets/misc/ErrorBoundary'

export const WidgetList_LineUI = observer(function WidgetList_LineUI_<T extends Spec>(p: {
    widget: Widget_list<T> | Widget_listExt<T>
}) {
    return (
        <div tw='ml-auto'>
            <ListControlsUI widget={p.widget} />
        </div>
    )
})

export const WidgetList_BodyUI = observer(function WidgetList_BodyUI_<T extends Spec>(p: { widget: Widget_list<T> }) {
    const widget = p.widget
    const subWidgets = widget.items
    const min = widget.config.min
    return (
        <div className='_WidgetListUI' tw='flex-grow w-full'>
            <SortableList onSortEnd={p.widget.moveItem} className='list' draggedItemClassName='dragged'>
                <div tw='flex flex-col gap-0.5'>
                    {subWidgets.map((subWidget, ix) => {
                        const { HeaderUI: WidgetHeaderUI, BodyUI: WidgetBodyUI } = subWidget // WidgetDI.WidgetUI(widget)
                        const collapsed = subWidget.serial.collapsed ?? false
                        return (
                            <SortableItem key={subWidget.id}>
                                <div tw={['flex flex-col', getBorderStatusForWidget(subWidget) && 'WIDGET-GROUP-BORDERED']}>
                                    <div tw='flex items-center '>
                                        {/* drag and fold knob */}
                                        <SortableKnob>
                                            <ListDragHandleUI widget={subWidget} ix={ix} />
                                        </SortableKnob>

                                        {/* debug id */}
                                        {p.widget.config.showID ? (
                                            <div className='divider flex-1 border-top'>
                                                <div id={subWidget.id} tw='opacity-20 italic'>
                                                    #{ix}:{subWidget.id}
                                                </div>
                                            </div>
                                        ) : null}

                                        {/* inline header part */}
                                        {WidgetHeaderUI && (
                                            <ErrorBoundary FallbackComponent={ErrorBoundaryFallback} onReset={(details) => {}}>
                                                <WidgetHeaderUI widget={subWidget} />
                                            </ErrorBoundary>
                                        )}
                                        {/* delete btn */}
                                        <div
                                            tw={[
                                                'btn btn-sm btn-narrower btn-ghost opacity-50',
                                                min && widget.items.length <= min ? 'btn-disabled' : null,
                                            ]}
                                            onClick={() => widget.removeItem(subWidget)}
                                        >
                                            <span className='material-symbols-outlined'>delete</span>
                                        </div>
                                        {/* collapse indicator */}
                                        <ListItemCollapseBtnUI req={subWidget} />
                                    </div>
                                    {WidgetBodyUI && !collapsed && subWidget && (
                                        <ErrorBoundary FallbackComponent={ErrorBoundaryFallback} onReset={(details) => {}}>
                                            <div tw='ml-2 pl-2'>
                                                <WidgetBodyUI widget={subWidget} />
                                            </div>
                                        </ErrorBoundary>
                                    )}
                                </div>
                            </SortableItem>
                        )
                    })}
                </div>
            </SortableList>
        </div>
    )
})

const ListDragHandleUI = forwardRef<HTMLDivElement, { ix: number; widget: IWidget }>((props, ref) => {
    const v = props.widget
    return (
        <div
            tw='btn btn-narrower btn-ghost btn-square btn-xs'
            ref={ref}
            onClick={() => (v.serial.collapsed = !Boolean(v.serial.collapsed))}
        >
            {/* <RevealUI cursor='cursor-move'> */}
            <span className='material-symbols-outlined'>menu</span>
            {/* <div tw='btn btn-sm btn-narrower btn-ghost opacity-50'>
                {v.state.collapsed ? ( //
                    <span className='material-symbols-outlined'>keyboard_arrow_right</span>
                ) : (
                    <span className='material-symbols-outlined'>keyboard_arrow_down</span>
                )}
            </div> */}
            {/* <div>{props.ix}</div> */}
            {/* </RevealUI> */}
        </div>
    )
})

export const ListItemCollapseBtnUI = observer(function ListItemCollapseBtnUI_(p: { req: IWidget }) {
    const widget = p.req
    const isCollapsible = widget.BodyUI
    if (!isCollapsible) return null
    return (
        <div
            tw='btn btn-ghost btn-square btn-sm'
            // style={{ width: `${indexWidth}rem` }}
            onClick={() => (widget.serial.collapsed = !Boolean(widget.serial.collapsed))}
        >
            {widget.serial.collapsed ? ( //
                <span className='material-symbols-outlined'>keyboard_arrow_right</span>
            ) : (
                <span className='material-symbols-outlined'>keyboard_arrow_down</span>
            )}
            {/* {ix} */}
        </div>
    )
})
