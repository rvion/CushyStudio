import type { BaseSelectEntry } from '../selectOne/FieldSelectOne'
import type { Field_selectMany } from './FieldSelectMany'

import { observer } from 'mobx-react-lite'

import { InputBoolFlipButtonUI } from '../../checkbox/InputBoolFlipButtonUI'
import { SelectUI } from '../../select/SelectUI'

export const WidgetSelectMany_SelectUI = observer(function WidgetSelectMany_SelectUI_<T extends BaseSelectEntry>(p: {
    field: Field_selectMany<T>
}) {
    const field = p.field
    return (
        <div tw='flex flex-1 gap-1'>
            <SelectUI<T>
                multiple
                wrap={field.wrap}
                tw={[field.ownProblems && 'rsx-field-error']}
                getLabelText={(t) => t.label ?? t.id}
                getLabelUI={field.config.getLabelUI}
                getSearchQuery={() => field.serial.query ?? ''}
                setSearchQuery={(query) => (field.serial.query = query)}
                disableLocalFiltering={field.config.disableLocalFiltering}
                options={() => field.choices}
                value={() => field.serial.values}
                equalityCheck={(a, b) => a.id === b.id}
                onChange={(selectOption) => field.toggleItem(selectOption)}
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
