import type { ISpec } from '../../ISpec'
import type { IWidget } from '../../IWidget'
import type { Widget_list } from './WidgetList'

import { forwardRef } from 'react'

import { observer } from 'mobx-react-lite'
// import SortableList, { SortableItem, SortableKnob } from 'react-easy-sort'
import { ErrorBoundary } from 'react-error-boundary'

import { RevealUI } from '../../../rsuite/reveal/RevealUI'
import { ErrorBoundaryFallback } from '../../../widgets/misc/ErrorBoundary'
import { getBorderStatusForWidget } from '../../shared/getBorderStatusForWidget'
import { menu_widgetActions } from '../../shared/WidgetMenu'

import { ListControlsUI } from './ListControlsUI'

const {default: SortableList, SortableItem, SortableKnob } = await import('react-easy-sort')


export const WidgetList_LineUI = observer(function WidgetList_LineUI_(p: { widget: Widget_list<any> }) {
    return (
        <div tw='flex flex-1 items-center'>
            <div tw='text-sm text-gray-500 italic'>{p.widget.length} items</div>
            {p.widget.isAuto ? null : (
                <div tw='ml-auto'>
                    <ListControlsUI widget={p.widget} />
                </div>
            )}
        </div>
    )
})

export const WidgetList_BodyUI = observer(function WidgetList_BodyUI_<T extends ISpec>(p: { widget: Widget_list<T> }) {
    const widget = p.widget
    const subWidgets = widget.items
    const min = widget.config.min
    return (
        <div className='_WidgetListUI' tw='flex-grow w-full'>
            <SortableList onSortEnd={p.widget.moveItem} className='list' draggedItemClassName='dragged'>
                <div tw='flex flex-col gap-0.5'>
                    {subWidgets.map((subWidget, ix) => {
                        const widgetHeader = subWidget.header()
                        const widgetBody = subWidget.body()
                        // const { DefaultHeaderUI: WidgetHeaderUI, DefaultBodyUI: WidgetBodyUI } = subWidget // WidgetDI.WidgetUI(widget)
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
                                        {widgetHeader && (
                                            <ErrorBoundary FallbackComponent={ErrorBoundaryFallback} onReset={(details) => {}}>
                                                {/* <WidgetHeaderUI widget={subWidget} /> */}
                                                {widgetHeader}
                                            </ErrorBoundary>
                                        )}
                                        {subWidget.config.presets && (
                                            <RevealUI //
                                                content={() => <menu_widgetActions.UI props={subWidget} />}
                                            >
                                                <span className='material-symbols-outlined'>more_vert</span>
                                            </RevealUI>
                                        )}
                                        {/* delete btn */}
                                        {p.widget.isAuto ? null : (
                                            <div
                                                tw={[
                                                    'btn btn-sm btn-narrower btn-ghost opacity-50',
                                                    min != null && widget.items.length <= min ? 'btn-disabled' : null,
                                                ]}
                                                onClick={() => widget.removeItem(subWidget)}
                                            >
                                                <span className='material-symbols-outlined'>delete</span>
                                            </div>
                                        )}
                                        {/* collapse indicator */}
                                        {subWidget.collapsible && <ListItemCollapseBtnUI widget={subWidget} />}
                                    </div>
                                    {widgetBody && !collapsed && subWidget != null && (
                                        <ErrorBoundary FallbackComponent={ErrorBoundaryFallback} onReset={(details) => {}}>
                                            <div tw='ml-2 pl-2'>
                                                {/* <WidgetBodyUI widget={subWidget} /> */}
                                                {widgetBody}
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

const ListDragHandleUI = forwardRef<HTMLDivElement, { ix: number; widget: IWidget }>((p, ref) => {
    const widget = p.widget
    return (
        <div tw='btn btn-narrower btn-ghost btn-square btn-xs' ref={ref} onClick={() => widget.toggleCollapsed()}>
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

export const ListItemCollapseBtnUI = observer(function ListItemCollapseBtnUI_(p: { widget: IWidget }) {
    const widget = p.widget
    const isCollapsible = widget.DefaultBodyUI
    if (!isCollapsible) return null
    return (
        <div
            tw='btn btn-ghost btn-square btn-sm'
            // style={{ width: `${indexWidth}rem` }}
            onClick={() => widget.toggleCollapsed()}
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
