import type { BaseSchema } from '../../model/BaseSchema'
import type { Field } from '../../model/Field'
import type { Field_list } from './FieldList'

import { observer } from 'mobx-react-lite'
import { type FC, forwardRef } from 'react'

import { Button } from '../../button/Button'
import { SpacerUI } from '../../components/SpacerUI'
import { ErrorBoundaryUI } from '../../errors/ErrorBoundaryUI'
import { menu_widgetActions } from '../../form/WidgetMenu'
// import SortableList, { SortableItem, SortableKnob } from 'react-easy-sort'
import { Frame } from '../../frame/Frame'
import { RevealUI } from '../../reveal/RevealUI'
import { ListControlsUI } from './ListControlsUI'

const { default: SortableList, SortableItem, SortableKnob } = await import('react-easy-sort')

// TODO (bird_d): Make collapse button on left, probably just re-use a "Group" component in this widget.

export const WidgetList_LineUI: FC<{ field: Field_list<any> }> = observer(function WidgetList_LineUI_(p: {
    field: Field_list<any>
}) {
    return (
        <div tw='flex flex-1 items-center COLLAPSE-PASSTHROUGH'>
            <div tw='text-sm text-gray-500 italic'>{p.field.length} items</div>
            {p.field.isAuto ? null : (
                <div tw='ml-auto'>
                    <ListControlsUI field={p.field} />
                </div>
            )}
        </div>
    )
})

export const WidgetList_BodyUI = observer(function WidgetList_BodyUI_<T extends BaseSchema>(p: { field: Field_list<T> }) {
    const field = p.field
    const subWidgets = field.items
    const min = field.config.min
    return (
        <div className='_WidgetListUI' tw='flex-grow w-full'>
            <SortableList onSortEnd={(s, e) => p.field.moveItem(s, e)} className='list' draggedItemClassName='dragged'>
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
                                        {p.field.isAuto ? null : (
                                            <Button
                                                disabled={min != null && field.items.length <= min}
                                                square
                                                size='input'
                                                subtle
                                                icon='mdiDeleteOutline'
                                                onClick={() => field.removeItem(subWidget)}
                                            />
                                        )}
                                        {/* <div tw='w-2' /> */}
                                        <SortableKnob>
                                            <ListDragHandleUI field={subWidget} ix={ix} />
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

const ListDragHandleUI = forwardRef<HTMLDivElement, { ix: number; field: Field }>((p, ref) => {
    return (
        //TODO (bird_d): FIX UI - Needs to be Button when ref is implemented.
        <div ref={ref} onClick={() => p.field.toggleCollapsed()}>
            <Button size='input' subtle square icon='mdiDragHorizontalVariant' />
        </div>
    )
})
