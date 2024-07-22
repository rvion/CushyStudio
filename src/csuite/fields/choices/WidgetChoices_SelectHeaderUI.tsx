import type { SchemaDict } from '../../model/SchemaDict'
import type { Field_choices } from './FieldChoices'

import { observer } from 'mobx-react-lite'

import { SelectUI } from '../../select/SelectUI'

export const WidgetChoices_SelectHeaderUI = observer(function WidgetChoices_SelectLineUI_<T extends SchemaDict>(p: {
    field: Field_choices<T>
}) {
    const field = p.field
    type Entry = { key: string; label: string }
    const choices: Entry[] = field.choicesWithLabels
    return (
        <div
            tw='relative flex-1'
            onMouseDown={(ev) => {
                ev.preventDefault()
                ev.stopPropagation()
            }}
        >
            <SelectUI<Entry>
                tw='flex-grow'
                placeholder={p.field.config.placeholder}
                value={() =>
                    Object.entries(field.serial.branches)
                        .filter(([_, value]) => value)
                        .map(([key, _]) => ({ key, label: choices.find((v) => v.key === key)?.label ?? key }))
                }
                options={() => choices}
                getLabelText={(v) => v.label}
                getLabelUI={(v) => (
                    <div tw='flex flex-1 justify-between'>
                        <div tw='flex-1'>{v.label}</div>
                        {/* 👇 TODO: clean this */}
                        {/* {v.key in widget.serial.values_ && (
                            <div
                                tw='btn btn-square btn-sm'
                                onClick={(ev) => {
                                    ev.preventDefault()
                                    ev.stopPropagation()
                                }}
                            >
                                <span className='material-symbols-outlined'>delete</span>
                            </div>
                        )} */}
                    </div>
                )}
                equalityCheck={(a, b) => a.key === b.key}
                multiple={field.config.multi ?? false}
                // closeOnPick={false}
                resetQueryOnPick={false}
                onChange={(v) => field.toggleBranch(v.key)}
            />
        </div>
    )
})
