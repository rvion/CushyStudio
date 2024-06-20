import type { BaseSelectEntry, Widget_selectOne } from './WidgetSelectOne'

import { observer } from 'mobx-react-lite'

import { exhaust } from '../../utils/exhaust'
import { WidgetSelectOne_RollUI } from './WidgetSelectOne_RollUI'
import { WidgetSelectOne_SelectUI } from './WidgetSelectOne_SelectUI'
import { WidgetSelectOne_TabUI } from './WidgetSelectOne_TabUI'

export const WidgetSelectOneUI = observer(function WidgetSelectOneUI_<T extends BaseSelectEntry>(p: {
    widget: Widget_selectOne<T>
}) {
    const widget = p.widget
    const skin = widget.config.appearance ?? 'select'
    if (skin === 'tab') return <WidgetSelectOne_TabUI widget={widget} />
    if (skin === 'select') return <WidgetSelectOne_SelectUI widget={widget} />
    if (skin === 'roll') return <WidgetSelectOne_RollUI widget={widget} />
    exhaust(skin)
    return <>❌ error</>
})
