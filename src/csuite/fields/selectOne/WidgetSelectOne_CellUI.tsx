import type { BaseSelectEntry, Field_selectOne } from './FieldSelectOne'

import { observer } from 'mobx-react-lite'

import { BadgeUI } from '../../badge/BadgeUI'
import { RevealUI } from '../../reveal/RevealUI'

const stupidHueHash = (x: string): number => Array.from(x).reduce((a, b) => a + b.charCodeAt(0), 0) % 360

export const WidgetSelectOne_CellUI = observer(function WidgetSelectOne_TabUI_<T extends BaseSelectEntry>(p: {
    field: Field_selectOne<T>
    opts?: { reveal?: boolean }
}) {
    const val = p.field.value
    const hue = val.hue ?? stupidHueHash(val.id)

    if (p.opts?.reveal)
        return (
            <RevealUI content={() => val.label ?? val.id} trigger={'hover'} placement='right'>
                <BadgeUI hue={hue}>{val.id[0]}</BadgeUI>
            </RevealUI>
        )

    return <BadgeUI hue={hue}>{val.id}</BadgeUI>
})
