import type { BaseSelectEntry, Field_selectOne } from './FieldSelectOne'

import { observer } from 'mobx-react-lite'

import { SelectUI } from '../../select/SelectUI'
import { makeLabelFromFieldName } from '../../utils/makeLabelFromFieldName'

export const WidgetSelectOne_SelectUI = observer(function WidgetSelectOne_SelectUI_<T extends BaseSelectEntry>(p: {
    field: Field_selectOne<T>
}) {
    const field = p.field
    return (
        <div tw='flex-1'>
            <SelectUI<T>
                // placement='auto' 🔶 do we want that ?
                key={field.id}
                tw={[field.ownProblems && 'rsx-field-error']}
                getLabelText={(t) => t.label ?? makeLabelFromFieldName(t.id)}
                getLabelUI={field.config.getLabelUI}
                getSearchQuery={() => field.serial.query ?? ''}
                setSearchQuery={(query) => (field.serial.query = query)}
                disableLocalFiltering={field.config.disableLocalFiltering}
                options={() => field.choices}
                equalityCheck={(a, b) => a.id === b.id}
                value={() => field.serial.val}
                onOptionToggled={(selectOption) => {
                    if (selectOption == null) {
                        // TODO?: hook into it's parent if parent is an option block ?
                        // ⏸️ if (!widget.isOptional) return
                        // ⏸️ widget.state.active = false
                        return
                    }
                    const next = field.choices.find((c) => c.id === selectOption.id)
                    if (next == null) {
                        console.log(`❌ WidgetSelectOneUI: could not find choice for ${JSON.stringify(selectOption)}`)
                        return
                    }
                    field.value = next
                }}
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
