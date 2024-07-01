import type { BaseSelectEntry, Field_selectOne } from './WidgetSelectOne'

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
    if (skin === 'tab') return <WidgetSelectOne_TabUI widget={field} />
    if (skin === 'select') return <WidgetSelectOne_SelectUI widget={field} />
    if (skin === 'roll') return <WidgetSelectOne_RollUI widget={field} />
    exhaust(skin)
    return <>❌ error</>
})
