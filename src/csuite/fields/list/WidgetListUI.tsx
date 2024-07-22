import type { BaseSchema } from '../../model/BaseSchema'
import type { Field } from '../../model/Field'
import type { Field_list } from './FieldList'

import { observer } from 'mobx-react-lite'
import { type FC, forwardRef } from 'react'

import { Button } from '../../button/Button'
import { WidgetWithLabelUI } from '../../form/WidgetWithLabelUI'
import { ListControlsUI } from './ListControlsUI'

const { default: SortableList, SortableItem, SortableKnob } = await import('react-easy-sort')

// TODO (bird_d): Make collapse button on left, probably just re-use a "Group" component in this widget.
export const WidgetList_LineUI: FC<{ field: Field_list<any> }> = observer(function WidgetList_LineUI_(p: {
    field: Field_list<any>
}) {
    return (
        <div tw='flex flex-1 items-center COLLAPSE-PASSTHROUGH'>
            {p.field.isAuto ? null : (
                <ListControlsUI field={p.field}>
                    <div tw='text-sm text-gray-500 italic whitespace-nowrap'>{p.field.length} items</div>
                </ListControlsUI>
            )}
        </div>
    )
})

export const WidgetList_BodyUI = observer(function WidgetList_BodyUI_<T extends BaseSchema>(p: { field: Field_list<T> }) {
    const listField = p.field
    const subFields = listField.items
    const min = listField.config.min
    return (
        <SortableList
            //
            onSortEnd={(s, e) => p.field.moveItem(s, e)}
            className='list'
            draggedItemClassName='dragged'
        >
            {subFields.map((subField, ix) => {
                return (
                    <SortableItem key={subField.id}>
                        <WidgetWithLabelUI
                            fieldName={ix.toString()}
                            field={subField}
                            // slotDragKnob={
                            //     <div tw='flex'>
                            //         <SortableKnob>
                            //             <ListDragHandleUI field={subField} ix={ix} />
                            //         </SortableKnob>
                            //     </div>
                            // }
                            slotDelete={
                                listField.isAuto ? null : (
                                    <Button
                                        disabled={min != null && listField.items.length <= min}
                                        square
                                        size='input'
                                        subtle
                                        icon='mdiDeleteOutline'
                                        onClick={() => listField.removeItem(subField)}
                                    />
                                )
                            }
                            slotUpDown={
                                <div tw='flex'>
                                    <ListItemMoveUpButtonUI listField={listField} ix={ix} />
                                    <ListItemMoveDownButtonUI listField={listField} ix={ix} />
                                </div>
                            }
                        />
                    </SortableItem>
                )
            })}
        </SortableList>
    )
})

const ListDragHandleUI = forwardRef<HTMLDivElement, { ix: number; field: Field }>((p, ref) => {
    return (
        //TODO (bird_d): FIX UI - Needs to be Button when ref is implemented.
        <div ref={ref} onClick={(ev) => p.field.toggleCollapsed()}>
            <Button size='input' subtle borderless square icon='mdiDragHorizontalVariant' />
        </div>
    )
})

export const ListItemMoveUpButtonUI = observer(function ListItemMoveUpButtonUI_({
    listField,
    ix,
}: {
    listField: Field_list<any>
    ix: number
}) {
    return (
        <Button
            disabled={ix === 0}
            onClick={() => listField.moveItem(ix, ix - 1)}
            square
            borderless
            subtle
            size='xs'
            icon='mdiArrowUp'
        />
    )
})

export const ListItemMoveDownButtonUI = observer(function ListItemMoveDownButtonUI_({
    listField,
    ix,
}: {
    listField: Field_list<any>
    ix: number
}) {
    return (
        <Button
            //
            disabled={ix === listField.length - 1}
            onClick={() => listField.moveItem(ix, ix + 1)}
            square
            borderless
            subtle
            size='xs'
            icon='mdiArrowDown'
        />
    )
})
