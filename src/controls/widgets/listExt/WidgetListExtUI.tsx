import type { Spec } from 'src/controls/Prop'

import { observer } from 'mobx-react-lite'
import { WidgetSizeX_LineUI, WigetSizeXUI } from '../size/WidgetSizeUI'
import { Widget_listExt } from './WidgetListExt'
import { WidgetListExt_RegionalUI } from './WidgetListExt_RegionalUI'
import { WidgetListExt_TimelineUI } from './WidgetListExt_TimelineUI'
import { WidgetListExt_ValuesUI } from './WidgetListExt_ValuesUI'

export const WidgetListExtUI = observer(function WidgetListExtUI_<T extends Spec>(p: { widget: Widget_listExt<T> }) {
    const widget = p.widget
    return (
        <div className='_WidgetListExtUI' tw='flex-grow w-full'>
            {/* <ListControlsUI widget={widget} /> */}
            {/* 🟢 */}
            <WidgetSizeX_LineUI sizeHelper={widget.sizeHelper} bounds={widget.config} />
            <WigetSizeXUI sizeHelper={widget.sizeHelper} bounds={widget.config} />
            {/* <WigetSizeXUI sizeHelper={widget.sizeHelper} bounds={widget.config} /> */}
            {/* 🟢 */}
            {p.widget.config.mode === 'timeline' ? ( //
                <WidgetListExt_TimelineUI widget={widget} />
            ) : (
                <WidgetListExt_RegionalUI widget={widget} />
            )}
            <WidgetListExt_ValuesUI widget={widget} />
        </div>
    )
})
