import type { BaseSelectEntry } from '../selectOne/FieldSelectOne'
import type { Field_selectMany, SelectManyAppearance } from './FieldSelectMany'

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
    if (appearance === 'tab') return <WidgetSelectMany_TabUI field={field} />
    if (appearance === 'select') return (
        <div tw='flex flex-col flex-1'>
            <WidgetSelectMany_SelectUI field={field} />
            {!field.isCollapsed  && <WidgetSelectMany_ListUI field={field} />}
        </div>
    )
    if (appearance === 'list') return <WidgetSelectMany_ListUI field={field} />
    exhaust(appearance)
})
