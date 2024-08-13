import type { BaseSelectEntry, Field_selectOne } from './FieldSelectOne'

import { observer } from 'mobx-react-lite'

import { exhaust } from '../../utils/exhaust'
import { WidgetSelectOne_RollUI } from './WidgetSelectOne_RollUI'
import { WidgetSelectOne_SelectUI } from './WidgetSelectOne_SelectUI'
import { WidgetSelectOne_TabUI } from './WidgetSelectOne_TabUI'

export const WidgetSelectOneUI = observer(function WidgetSelectOneUI_<T extends BaseSelectEntry>(p: {
    field: Field_selectOne<T>
}) {
    const field = p.field
    const skin = field.config.appearance ?? 'select'
    if (skin === 'tab') return <WidgetSelectOne_TabUI field={field} />
    if (skin === 'select') return <WidgetSelectOne_SelectUI field={field} />
    if (skin === 'roll') return <WidgetSelectOne_RollUI field={field} />
    exhaust(skin)
    return <>❌ error</>
})
