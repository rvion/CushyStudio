import type { SelectProps } from '../../select/SelectProps'
import type { SelectOption } from '../selectOne/FieldSelectOne'
import type { Field_selectMany } from './FieldSelectMany'

import { observer } from 'mobx-react-lite'

import { InputBoolFlipButtonUI } from '../../checkbox/InputBoolFlipButtonUI'
import { SelectUI } from '../../select/SelectUI'

export const WidgetSelectMany_SelectUI = observer(function WidgetSelectMany_SelectUI_<VALUE extends any>(p: {
    field: Field_selectMany<VALUE>
    selectProps?: Partial<SelectProps<SelectOption<VALUE>>>
}) {
    const field = p.field
    return (
        <div tw='flex flex-1 gap-1 w-full'>
            <SelectUI<SelectOption<VALUE>>
                multiple
                wrap={field.wrap}
                tw={[field.ownProblems && 'rsx-field-error']}
                getLabelText={(t) => t.label ?? t.id}
                OptionLabelUI={field.config.OptionLabelUI}
                getSearchQuery={() => field.serial.query ?? ''}
                setSearchQuery={(query) => (field.serial.query = query)}
                disableLocalFiltering={field.config.disableLocalFiltering}
                options={() => field.options}
                value={() => field.selectedOptions}
                equalityCheck={(a, b) => a.id === b.id}
                onOptionToggled={(selectOption) => field.toggleId(selectOption.id)}
                placeholder={field.config.placeholder}
                {...p.selectProps}
            />
            {field.config.wrapButton && (
                <InputBoolFlipButtonUI
                    tooltip='Wrap items'
                    tw='self-start'
                    icon={p.field.wrap ? 'mdiWrapDisabled' : 'mdiWrap'}
                    value={p.field.wrap}
                    onValueChange={(next) => (p.field.wrap = next)}
                />
            )}
        </div>
    )
})
