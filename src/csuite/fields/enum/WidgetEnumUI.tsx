import type { EnumName, EnumValue } from '../../../models/ComfySchema'
import type { CleanedEnumResult } from '../../../types/EnumUtils'
import type { Field_enum } from './FieldEnum'

import { observer } from 'mobx-react-lite'

import { useSt } from '../../../state/stateContext'
import { InputBoolUI } from '../../checkbox/InputBoolUI'
import { Ikon } from '../../icons/iconHelpers'
import { MessageErrorUI } from '../../messages/MessageErrorUI'
import { RevealUI } from '../../reveal/RevealUI'
import { SelectUI } from '../../select/SelectUI'
import { exhaust } from '../../utils/exhaust'

// UI

export const WidgetEnumUI = observer(function WidgetEnumUI_(p: { field: Field_enum<any> }) {
    const field = p.field
    const skin = field.config.appearance ?? 'select'
    if (skin === 'select') return <WidgetEnum_SelectUI field={field} />
    if (skin === 'tab') return <WidgetEnum_TabUI field={field} />
    exhaust(skin)
    return <>❌ error</>
})

export const WidgetEnum_TabUI = observer(function WidgetEnum_TabUI_(p: { field: Field_enum<any> }) {
    const field = p.field
    const selected = field.serial.val
    return (
        <div
            tw={[
                //
                'flex flex-1',
                (field.config.wrap ?? true) && 'flex-wrap',
                'rounded',
                'select-none',
                'gap-x-0.5 gap-y-0',
            ]}
        >
            {field.possibleValues.map((c: any) => {
                const isSelected = selected === c
                return (
                    <InputBoolUI
                        key={c}
                        value={isSelected}
                        display='button'
                        text={c.toString()}
                        onValueChange={(value) => {
                            if (value === isSelected) return
                            field.value = c
                        }}
                    />
                )
            })}
        </div>
    )
})

export const WidgetEnum_SelectUI = observer(function WidgetEnum_SelectUI_(p: {
    //
    field: Field_enum<any>
}) {
    const field = p.field
    const enumName = field.config.enumName
    const isOptional = false // TODO: hook into parent once parent is accessible from state
    return (
        <EnumSelectorUI
            value={() => field.status}
            isOptional={isOptional}
            enumName={enumName}
            // substituteValue={req.status}
            onChange={(e) => {
                if (e == null) return // ❓
                field.value = e
            }}
        />
    )
    // <>
    //     {/* <InstallModelBtnUI widget={widget} modelFolderPrefix={} /> */}
    //     <Button icon='mdiUndoVariant' disabled={!widget.hasChanges} onClick={() => widget.reset()}></Button>
    // </>
})

export const EnumSelectorUI = observer(function EnumSelectorUI_(p: {
    isOptional: boolean
    value: () => CleanedEnumResult<any>
    displayValue?: boolean
    // substituteValue?: EnumValue | null
    onChange: (v: EnumValue | null) => void
    disabled?: boolean
    enumName: EnumName
}) {
    const project = useSt().project
    const schema = project.schema
    const options: EnumValue[] = schema.knownEnumsByName.get(p.enumName)?.values ?? [] // schema.getEnumOptionsForSelectPicker(p.enumName)

    // const valueIsValid = (p.value != null || p.isOptional) && options.some((x) => x.value === p.value)
    const value = p.value()
    const hasError = Boolean(value.isSubstitute || value.ENUM_HAS_NO_VALUES)
    return (
        <div tw={['w-full h-full']}>
            <SelectUI //
                tw={[{ ['rsx-field-error']: hasError }]}
                disabled={p.disabled}
                cleanable={p.isOptional}
                options={() => options}
                getLabelText={(v) => v.toString()}
                value={() => p.value().candidateValue}
                hideValue={p.displayValue}
                onChange={(option) => {
                    if (option == null) return
                    p.onChange(option)
                }}
            />
            <div tw='flex flex-wrap gap-2'>
                {value.isSubstitute ? ( //
                    <RevealUI
                        placement='bottom'
                        content={() => (
                            <MessageErrorUI>
                                <div>
                                    <div>
                                        <div tw='bord'>{value.candidateValue}</div> is not in your ComfyUI install folder
                                    </div>
                                    <div>
                                        <div tw='bord'>{value.finalValue}</div> used instead
                                    </div>
                                </div>
                            </MessageErrorUI>
                        )}
                    >
                        <div className='text-orange-500 flex items-center'>
                            <Ikon.mdiInformation />
                            <span>{value.finalValue}</span>
                        </div>
                    </RevealUI>
                ) : null}
                {value.ENUM_HAS_NO_VALUES ? <div tw='text-red-500'>NO VALUE FOR {p.enumName}</div> : null}
            </div>
        </div>
    )
})
