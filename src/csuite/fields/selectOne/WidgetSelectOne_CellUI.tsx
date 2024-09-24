import type { Field_selectOne } from './FieldSelectOne'
import type { SelectKey } from './SelectOneKey'

import { observer } from 'mobx-react-lite'

import { BadgeUI } from '../../badge/BadgeUI'
import { hashPrimitiveToNumber } from '../../hashUtils/hash'
import { RevealUI } from '../../reveal/RevealUI'
import { makeLabelFromPrimitiveValue } from '../../utils/makeLabelFromFieldName'

export const WidgetSelectOne_CellUI = observer(function WidgetSelectOne_TabUI_<VALUE, KEY extends SelectKey>(p: {
    field: Field_selectOne<VALUE, KEY>
    opts?: { reveal?: boolean }
}) {
    const val = p.field.selectedOption_unchecked

    if (val == null) return p.field.config.placeholder ?? ''
    const hue = val.hue ?? hashPrimitiveToNumber(val.id)

    if (p.opts?.reveal)
        return (
            <RevealUI content={() => val.label ?? val.id} trigger={'hover'} placement='right' tw='gap-1'>
                <BadgeUI icon={val.icon} hue={hue}>
                    {makeLabelFromPrimitiveValue(val.id)}
                </BadgeUI>
            </RevealUI>
        )

    return (
        <BadgeUI icon={val.icon} hue={hue} tw='gap-1'>
            {val.label ?? val.id}
        </BadgeUI>
    )
})
