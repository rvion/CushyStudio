import type { BaseSelectEntry } from '../selectOne/WidgetSelectOne'
import type { SelectManyAppearance, Widget_selectMany } from './WidgetSelectMany'

import { observer } from 'mobx-react-lite'

import { exhaust } from '../../utils/exhaust'
import { WidgetSelectMany_ListUI } from './WidgetSelectMany_ListUI'
import { WidgetSelectMany_SelectUI } from './WidgetSelectMany_SelectUI'
import { WidgetSelectMany_TabUI } from './WidgetSelectMany_TabUI'

export const WidgetSelectManyUI = observer(function WidgetSelectManyUI_<T extends BaseSelectEntry>(p: {
    widget: Widget_selectMany<T>
}) {
    const widget = p.widget
    const appearance: SelectManyAppearance = widget.config.appearance ?? 'tab'
    if (appearance === 'tab') return <WidgetSelectMany_TabUI widget={widget} />
    if (appearance === 'select') return <WidgetSelectMany_SelectUI widget={widget} />
    if (appearance === 'list') return <WidgetSelectMany_ListUI widget={widget} />
    exhaust(appearance)
})
