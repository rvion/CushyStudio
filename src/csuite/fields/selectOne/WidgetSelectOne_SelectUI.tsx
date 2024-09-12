import type { SelectProps } from '../../select/SelectProps'
import type { Field_selectOne } from './FieldSelectOne'
import type { SelectOption } from './SelectOption'

import { observer } from 'mobx-react-lite'

import { SelectUI } from '../../select/SelectUI'
import { makeLabelFromFieldName } from '../../utils/makeLabelFromFieldName'

export const WidgetSelectOne_SelectUI = observer(function WidgetSelectOne_SelectUI_<VALUE, KEY extends string>(p: {
    field: Field_selectOne<VALUE, KEY>
    selectProps?: Partial<SelectProps<SelectOption<VALUE, KEY> | undefined>>
}) {
    const field = p.field
    return (
        <div tw='flex-1 w-full'>
            <SelectUI<SelectOption<VALUE, KEY> | undefined>
                key={field.id}
                tw={[field.ownTypeSpecificProblems && 'rsx-field-error']}
                getLabelText={(t): string => {
                    if (t == null) return '<null>'
                    return t.label ?? makeLabelFromFieldName(t.id)
                }}
                OptionLabelUI={(t, wh, sst) => {
                    if (t?.value == null) return '<null>'
                    return sst.DefaultDisplayOption(t, { where: wh })
                }}
                getSearchQuery={() => field.serial.query ?? ''}
                setSearchQuery={(query) => (field.serial.query = query)}
                disableLocalFiltering={field.config.disableLocalFiltering}
                options={() => field.options}
                equalityCheck={(a, b) => a?.id === b?.id}
                value={() => field.selectedOption}
                placeholder={field.config.placeholder}
                readonly={field.config.readonly}
                slotAnchorContentUI={field.config.SlotAnchorContentUI}
                clearable={field.canBeSetOnOrOff ? () => field.setOff() : undefined}
                onOptionToggled={(option) => {
                    console.log(`[🤠] option`, option, field.selectedId, option?.id === field.selectedId)
                    if (option == null || field.selectedId === option.id) return field.unset()
                    field.selectedId = option.id
                }}
                {...p.selectProps}
            />
        </div>
    )
})
