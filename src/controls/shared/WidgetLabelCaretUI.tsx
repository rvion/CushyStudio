import { observer } from 'mobx-react-lite'

export const WidgetLabelCaretUI = observer(function WidgetLabelCaretUI_({ isCollapsed }: { isCollapsed: boolean }) {
    return (
        <span className='WIDGET-COLLAPSE-BTN COLLAPSE-PASSTHROUGH material-symbols-outlined opacity-70 hover:opacity-100 cursor-pointer'>
            {isCollapsed ? 'chevron_right' : 'expand_more'}
        </span>
    )
})
