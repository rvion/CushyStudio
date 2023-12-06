import { observer } from 'mobx-react-lite'
import { Widget, Widget_listExt } from 'src/controls/Widget'
import { ListControlsUI } from '../shared/ListControlsUI'
import { WidgetListExt_RegionalUI } from './WidgetListExt_RegionalUI'
import { WigetSizeXUI } from './WidgetSizeUI'
import { WidgetListExt_ValuesUI } from './WidgetListExt_ValuesUI'
import { WidgetListExt_TimelineUI } from './WidgetListExt_TimelineUI'

export const WidgetListExtUI = observer(function WidgetListExtUI_<T extends Widget>(p: { widget: Widget_listExt<T> }) {
    const req = p.widget
    return (
        <div className='_WidgetListExtUI' tw='flex-grow w-full'>
            <ListControlsUI req={req} />
            <WigetSizeXUI size={req.state} />
            {p.widget.input.mode === 'timeline' ? ( //
                <WidgetListExt_TimelineUI req={req} />
            ) : (
                <WidgetListExt_RegionalUI req={req} />
            )}
            <WidgetListExt_ValuesUI req={req} />
        </div>
    )
})
