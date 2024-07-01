import type { ISchema } from '../../model/ISchema'
import type { Field_listExt } from './WidgetListExt'

import { observer } from 'mobx-react-lite'

import { ListControlsUI } from '../list/ListControlsUI'
import { WidgetSizeX_LineUI, WigetSizeXUI } from '../size/WidgetSizeUI'
import { WidgetListExt_RegionalUI } from './WidgetListExt_RegionalUI'
import { WidgetListExt_TimelineUI } from './WidgetListExt_TimelineUI'
import { WidgetListExt_ValuesUI } from './WidgetListExt_ValuesUI'

export const WidgetListExtUI = observer(function WidgetListExtUI_<T extends ISchema>(p: { field: Field_listExt<T> }) {
    const fied = p.field
    return (
        <div className='_WidgetListExtUI' tw='flex-grow w-full'>
            {/* <ListControlsUI widget={widget} /> */}
            <WidgetSizeX_LineUI sizeHelper={fied.sizeHelper} bounds={fied.config} />
            <WigetSizeXUI sizeHelper={fied.sizeHelper} bounds={fied.config} />
            {/* <WigetSizeXUI sizeHelper={widget.sizeHelper} bounds={widget.config} /> */}
            {p.field.config.mode === 'timeline' ? ( //
                <WidgetListExt_TimelineUI field={fied} />
            ) : (
                <WidgetListExt_RegionalUI field={fied} />
            )}
            {/* {p.widget.value.items.map((e) => (
                <div tw='whitespace-pre-wrap w-96'>{JSON.stringify(e)}</div>
            ))} */}
            <WidgetListExt_ValuesUI field={fied} />
        </div>
    )
})

export const WidgetListExt_LineUI = observer(function WidgetList_LineUI_(p: { field: Field_listExt<any> }) {
    return (
        <div tw='flex flex-1 items-center'>
            <div tw='text-sm text-gray-500 italic'>{p.field.length} items</div>
            <div tw='ml-auto'>
                <ListControlsUI field={p.field} />
            </div>
        </div>
    )
})
