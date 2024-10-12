import type { SchemaDict } from '../../model/SchemaDict'
import type { Field_choices } from './FieldChoices'

import { observer } from 'mobx-react-lite'

import { csuiteConfig } from '../../config/configureCsuite'
import { SelectUI } from '../../select/SelectUI'

export const WidgetChoices_SelectHeaderUI = observer(function WidgetChoices_SelectLineUI_<T extends SchemaDict>(p: {
    field: Field_choices<T>
}) {
    const field = p.field
    type Entry = { key: string; label: string }
    const choices: Entry[] = field.choicesWithLabels
    const isActive = !p.field.canBeToggledWithinParent || !p.field.isInsideDisabledBranch

    return (
        <div
            tw='relative flex-1 flex flex-row gap-2'
            onMouseDown={(ev) => {
                ev.preventDefault()
                ev.stopPropagation()
            }}
        >
            <SelectUI<Entry>
                tw='flex-grow'
                key={`${isActive}`}
                placeholder={p.field.config.placeholder ?? csuiteConfig.i18n.misc.words.empty}
                value={() =>
                    field.activeBranchNames.map((key) => ({ key, label: choices.find((v) => v.key === key)?.label ?? key }))
                }
                options={() => choices}
                getLabelText={(v) => v.label}
                OptionLabelUI={(v) => (
                    <div tw='flex flex-1 justify-between'>
                        <div tw='flex-1'>{v.label}</div>
                    </div>
                )}
                equalityCheck={(a, b) => a.key === b.key}
                multiple={field.config.multi ?? false}
                // closeOnPick={false}
                resetQueryOnPick={false}
                onOptionToggled={(v) => field.toggleBranch(v.key)}
            />
        </div>
    )
})
