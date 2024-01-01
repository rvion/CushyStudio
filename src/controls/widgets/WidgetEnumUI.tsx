import { observer } from 'mobx-react-lite'
import { Widget_enum, Widget_enumOpt } from 'src/controls/Widget'
import { SelectUI } from 'src/rsuite/SelectUI'
import { Popover, Whisper } from 'src/rsuite/shims'
import { useSt } from 'src/state/stateContext'
import { CleanedEnumResult } from 'src/types/EnumUtils'
import type { EnumName, EnumValue } from '../../models/Schema'

type T = {
    label: EnumValue
    value: EnumValue | null
}[]

export const WidgetEnumUI = observer(function WidgetEnumUI_<K extends KnownEnumNames>(p: {
    widget: Widget_enum<K> | Widget_enumOpt<K>
}) {
    const req = p.widget
    const enumName = req.input.enumName
    const isOptional = req instanceof Widget_enumOpt
    return (
        <EnumSelectorUI
            value={() => req.status}
            disabled={!req.state.active}
            isOptional={isOptional}
            enumName={enumName}
            // substituteValue={req.status}
            onChange={(e) => {
                if (e == null) {
                    if (isOptional) req.state.active = false
                    return
                }
                req.state.val = e as any // 🔴
            }}
        />
    )
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
        <div tw='flex-1'>
            <SelectUI //
                tw={[{ ['rsx-field-error']: hasError }]}
                size='sm'
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
                    <Whisper
                        enterable
                        placement='bottom'
                        speaker={
                            <Popover>
                                <span>
                                    <span tw='bord'>{value.candidateValue}</span> is not in your ComfyUI install folder
                                </span>
                                <div>
                                    <span tw='bord'>{value.finalValue}</span> used instead
                                </div>
                            </Popover>
                        }
                    >
                        <div className='text-orange-500 flex items-center'>
                            <span className='material-symbols-outlined'>info</span>
                            <span>{value.finalValue}</span>
                        </div>
                    </Whisper>
                ) : null}
                {value.ENUM_HAS_NO_VALUES ? <div tw='text-red-500'>ENUM HAS NO VALUE</div> : null}
            </div>
        </div>
    )
})
