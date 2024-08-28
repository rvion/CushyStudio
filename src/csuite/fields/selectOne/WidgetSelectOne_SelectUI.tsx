import type { SelectProps } from '../../select/SelectProps'
import type { Field_selectOne } from './FieldSelectOne'
import type { SelectOption } from './SelectOption'

import { observer } from 'mobx-react-lite'

import { SelectUI } from '../../select/SelectUI'
import { makeLabelFromFieldName } from '../../utils/makeLabelFromFieldName'

export const WidgetSelectOne_SelectUI = observer(function WidgetSelectOne_SelectUI_<VALUE, KEY extends string>(p: {
    field: Field_selectOne<VALUE, KEY>
    selectProps?: Partial<SelectProps<SelectOption<VALUE, KEY>>>
}) {
    const field = p.field
    return (
        <div tw='flex-1 w-full'>
            <SelectUI<SelectOption<VALUE, KEY>>
                key={field.id}
                tw={[field.ownProblems && 'rsx-field-error']}
                getLabelText={(t) => t.label ?? makeLabelFromFieldName(t.id)}
                OptionLabelUI={field.config.OptionLabelUI}
                getSearchQuery={() => field.serial.query ?? ''}
                setSearchQuery={(query) => (field.serial.query = query)}
                disableLocalFiltering={field.config.disableLocalFiltering}
                options={() => field.options}
                equalityCheck={(a, b) => a.id === b.id}
                value={() => field.selectedOption}
                placeholder={field.config.placeholder}
                readonly={field.config.readonly}
                slotAnchorContentUI={field.config.SlotAnchorContentUI}
                onOptionToggled={(option) => {
                    // 🔴 TODO: handle null/optional case properly
                    // if (option == null) {
                    //     // TODO?: hook into it's parent if parent is an option block ?
                    //     // ⏸️ if (!widget.isOptional) return
                    //     // ⏸️ widget.state.active = false
                    //     return
                    // }

                    field.selectedId = option.id
                }}
                {...p.selectProps}
            />
            {/* {widget.baseErrors && (
                <div tw='text-red-500 flex items-center gap-1'>
                    <span className='material-symbols-outlined'>error</span>
                    {widget.baseErrors}
                </div>
            )} */}
        </div>
    )
})
