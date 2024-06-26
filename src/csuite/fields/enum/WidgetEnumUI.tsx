import type { EnumName, EnumValue } from '../../../models/ComfySchema'
import type { CleanedEnumResult } from '../../../types/EnumUtils'
import type { Widget_enum } from './WidgetEnum'

import { observer } from 'mobx-react-lite'

import { useSt } from '../../../state/stateContext'
import { Ikon } from '../../icons/iconHelpers'
import { MessageErrorUI } from '../../messages/MessageErrorUI'
import { RevealUI } from '../../reveal/RevealUI'
import { SelectUI } from '../../select/SelectUI'

// UI

export const WidgetEnumUI = observer(function WidgetEnumUI_(p: { widget: Widget_enum<any> }) {
    const widget = p.widget
    const enumName = widget.config.enumName
    const isOptional = false // TODO: hook into parent once parent is accessible from state
    return (
        <EnumSelectorUI
            value={() => widget.status}
            disabled={!widget.serial.active}
            isOptional={isOptional}
            enumName={enumName}
            // substituteValue={req.status}
            onChange={(e) => {
                if (e == null) return // ❓
                widget.value = e
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
