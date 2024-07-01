import type { BaseSelectEntry } from '../selectOne/WidgetSelectOne'
import type { Field_selectMany, SelectManyAppearance } from './WidgetSelectMany'

import { observer } from 'mobx-react-lite'

import { exhaust } from '../../utils/exhaust'
import { WidgetSelectMany_ListUI } from './WidgetSelectMany_ListUI'
import { WidgetSelectMany_SelectUI } from './WidgetSelectMany_SelectUI'
import { WidgetSelectMany_TabUI } from './WidgetSelectMany_TabUI'

export const WidgetSelectManyUI = observer(function WidgetSelectManyUI_<T extends BaseSelectEntry>(p: {
    field: Field_selectMany<T>
}) {
    const field = p.field
    const appearance: SelectManyAppearance = field.config.appearance ?? 'tab'
    if (appearance === 'tab') return <WidgetSelectMany_TabUI widget={field} />
    if (appearance === 'select') return <WidgetSelectMany_SelectUI widget={field} />
    if (appearance === 'list') return <WidgetSelectMany_ListUI field={field} />
    exhaust(appearance)
})
