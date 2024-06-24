import type { BaseField } from '../../model/BaseField'
import type { IBlueprint } from '../../model/IBlueprint'
import type { Widget_list } from './WidgetList'

import { observer } from 'mobx-react-lite'
import { forwardRef } from 'react'

import { Button } from '../../button/Button'
import { ErrorBoundaryUI } from '../../errors/ErrorBoundaryUI'
import { menu_widgetActions } from '../../form/WidgetMenu'
// import SortableList, { SortableItem, SortableKnob } from 'react-easy-sort'
import { Frame } from '../../frame/Frame'
import { RevealUI } from '../../reveal/RevealUI'
import { SpacerUI } from '../spacer/SpacerUI'
import { ListControlsUI } from './ListControlsUI'

const { default: SortableList, SortableItem, SortableKnob } = await import('react-easy-sort')

// TODO (bird_d): Make collapse button on left, probably just re-use a "Group" component in this widget.

export const WidgetList_LineUI = observer(function WidgetList_LineUI_(p: { widget: Widget_list<any> }) {
    return (
        <div tw='flex flex-1 items-center COLLAPSE-PASSTHROUGH'>
            <div tw='text-sm text-gray-500 italic'>{p.widget.length} items</div>
            {p.widget.isAuto ? null : (
                <div tw='ml-auto'>
                    <ListControlsUI widget={p.widget} />
                </div>
            )}
        </div>
    )
})

export const WidgetList_BodyUI = observer(function WidgetList_BodyUI_<T extends IBlueprint>(p: { widget: Widget_list<T> }) {
    const widget = p.widget
    const subWidgets = widget.items
    const min = widget.config.min
    return (
        <div className='_WidgetListUI' tw='flex-grow w-full'>
            <SortableList onSortEnd={(s, e) => p.widget.moveItem(s, e)} className='list' draggedItemClassName='dragged'>
                <div tw='flex flex-col gap-0.5'>
                    {subWidgets.map((subWidget, ix) => {
                        const widgetHeader = subWidget.header()
                        const widgetBody = subWidget.body()
                        // const { DefaultHeaderUI: WidgetHeaderUI, DefaultBodyUI: WidgetBodyUI } = subWidget // WidgetDI.WidgetUI(widget)
                        const collapsed = subWidget.serial.collapsed ?? false
                        const showBorder = subWidget.border != null
                        const isCollapsible: boolean = subWidget.isCollapsible
                        const boxBorder = showBorder ? 20 : 0
                        const boxBase =
                            subWidget.background != null && (isCollapsible || showBorder) ? { contrast: 0.03 } : undefined
                        return (
                            <SortableItem key={subWidget.id}>
                                <Frame border={boxBorder} tw={'flex flex-col'} base={boxBase}>
                                    <div tw='flex items-center'>
                                        <Button
                                            subtle
                                            square
                                            size='input'
                                            icon='mdiChevronRight'
                                            onClick={() => subWidget.toggleCollapsed()}
                                        />
                                        <SpacerUI />
                                        {subWidget.config.showID ? (
                                            <div className='divider flex-1 border-top'>
                                                <div id={subWidget.id} tw='opacity-20 italic'>
                                                    #{ix}:{subWidget.id}
                                                </div>
                                            </div>
                                        ) : null}

                                        {/* inline header part */}
                                        {widgetHeader && (
                                            <ErrorBoundaryUI>
                                                {/* <WidgetHeaderUI widget={subWidget} /> */}
                                                {widgetHeader}
                                            </ErrorBoundaryUI>
                                        )}

                                        {/* delete btn */}
                                        {p.widget.isAuto ? null : (
                                            <Button
                                                disabled={min != null && widget.items.length <= min}
                                                square
                                                size='input'
                                                subtle
                                                icon='mdiDeleteOutline'
                                                onClick={() => widget.removeItem(subWidget)}
                                            />
                                        )}
                                        {/* <div tw='w-2' /> */}
                                        <SortableKnob>
                                            <ListDragHandleUI widget={subWidget} ix={ix} />
                                        </SortableKnob>
                                        <RevealUI content={() => <menu_widgetActions.UI props={subWidget} />}>
                                            <Button icon='mdiDotsVertical' subtle square size='input' />
                                        </RevealUI>
                                    </div>
                                    {widgetBody && !collapsed && subWidget != null && (
                                        <ErrorBoundaryUI>
                                            <div tw='ml-2 pl-2'>{widgetBody}</div>
                                        </ErrorBoundaryUI>
                                    )}
                                </Frame>
                            </SortableItem>
                        )
                    })}
                </div>
            </SortableList>
        </div>
    )
})

const ListDragHandleUI = forwardRef<HTMLDivElement, { ix: number; widget: BaseField }>((p, ref) => {
    return (
        //TODO (bird_d): FIX UI - Needs to be Button when ref is implemented.
        <div ref={ref} onClick={() => p.widget.toggleCollapsed()}>
            <Button size='input' subtle square icon='mdiDragHorizontalVariant' />
        </div>
    )
})
