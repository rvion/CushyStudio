import { observer } from 'mobx-react-lite'
import { Widget } from 'src/controls/Widget'
import { ListControlsUI } from '../../shared/ListControlsUI'
import { WidgetListExt_RegionalUI } from './WidgetListExt_RegionalUI'
import { WigetSizeXUI } from '../size/WidgetSizeUI'
import { WidgetListExt_ValuesUI } from './WidgetListExt_ValuesUI'
import { WidgetListExt_TimelineUI } from './WidgetListExt_TimelineUI'
import { Widget_listExt } from './WidgetListExt'

export const WidgetListExtUI = observer(function WidgetListExtUI_<T extends Widget>(p: { widget: Widget_listExt<T> }) {
    const widget = p.widget
    return (
        <div className='_WidgetListExtUI' tw='flex-grow w-full'>
            {/* <ListControlsUI widget={widget} /> */}
            <WigetSizeXUI size={widget.serial} />
            {p.widget.config.mode === 'timeline' ? ( //
                <WidgetListExt_TimelineUI widget={widget} />
            ) : (
                <WidgetListExt_RegionalUI widget={widget} />
            )}
            <WidgetListExt_ValuesUI widget={widget} />
        </div>
    )
})
