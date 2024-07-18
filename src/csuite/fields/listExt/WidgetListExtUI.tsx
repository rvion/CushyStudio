import type { BaseSchema } from '../../model/BaseSchema'
import type { Field_listExt } from './WidgetListExt'

import { observer } from 'mobx-react-lite'

import { ListControlsUI } from '../list/ListControlsUI'
import { WidgetSizeX_LineUI, WigetSizeXUI } from '../size/WidgetSizeUI'
import { WidgetListExt_RegionalUI } from './WidgetListExt_RegionalUI'
import { WidgetListExt_TimelineUI } from './WidgetListExt_TimelineUI'
import { WidgetListExt_ValuesUI } from './WidgetListExt_ValuesUI'

export function WidgetListExtUI__Regional(p: { field: Field_listExt<any> }): JSX.Element {
    return <WidgetListExtUI field={p.field} mode='regional' />
}

export function WidgetListExtUI__Timeline(p: { field: Field_listExt<any> }): JSX.Element {
    return <WidgetListExtUI field={p.field} mode='timeline' />
}

export const WidgetListExtUI = observer(function WidgetListExtUI_<T extends BaseSchema>(p: {
    //
    field: Field_listExt<T>
    mode: 'timeline' | 'regional'
}) {
    const listExt = p.field
    const { area } = listExt.fields
    return (
        <div className='_WidgetListExtUI' tw='flex-grow w-full'>
            {/* <ListControlsUI widget={widget} /> */}
            <WidgetSizeX_LineUI size={area} bounds={listExt} />
            <WigetSizeXUI size={area} bounds={listExt} />
            {/* <WigetSizeXUI sizeHelper={widget.sizeHelper} bounds={widget.config} /> */}
            {p.mode === 'timeline' ? ( //
                <WidgetListExt_TimelineUI field={listExt} />
            ) : (
                <WidgetListExt_RegionalUI field={listExt} />
            )}
            {/* {p.widget.value.items.map((e) => (
                <div tw='whitespace-pre-wrap w-96'>{JSON.stringify(e)}</div>
            ))} */}
            <WidgetListExt_ValuesUI field={listExt} />
        </div>
    )
})

export const WidgetListExt_LineUI = observer(function WidgetList_LineUI_(p: {
    //
    field: Field_listExt<any>
}) {
    return (
        <div tw='flex flex-1 items-center'>
            <div tw='text-sm text-gray-500 italic'>{p.field.fields.items.length} items</div>
            <div tw='ml-auto'>
                <ListControlsUI field={p.field.fields.items} />
            </div>
        </div>
    )
})
