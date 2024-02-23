import type { EnumName, EnumValue } from '../../../models/Schema'
import type { Widget_enum } from './WidgetEnum'
import type { CleanedEnumResult } from 'src/types/EnumUtils'

import { observer } from 'mobx-react-lite'

import { SelectUI } from 'src/rsuite/SelectUI'
import { Popover, Whisper } from 'src/rsuite/shims'
import { useSt } from 'src/state/stateContext'

// UI

export const WidgetEnumUI = observer(function WidgetEnumUI_(p: { widget: Widget_enum<any> }) {
    const widget = p.widget
    const enumName = widget.config.enumName
    const isOptional = false // TODO: hook into parent once parent is accessible from state
    return (
        <>
            {/* <InstallModelBtnUI widget={widget} modelFolderPrefix={} /> */}
            <EnumSelectorUI
                value={() => widget.status}
                disabled={!widget.serial.active}
                isOptional={isOptional}
                enumName={enumName}
                // substituteValue={req.status}
                onChange={(e) => {
                    if (e == null) {
                        // if (isOptional) widget.serial.active = false
                        return
                    }
                    widget.serial.val = e as any // 🔴
                }}
            />
            <div
                tw={[widget.isChanged ? undefined : 'btn-disabled opacity-50']}
                onClick={() => widget.reset()}
                className='btn btn-xs btn-narrower btn-ghost'
            >
                <span className='material-symbols-outlined'>undo</span>
            </div>
        </>
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
        <div
            tw={[
                'flex flex-1 rounded h-full overflow-clip text-shadow',
                'border border-base-100 hover:brightness-110',
                'hover:border-base-200',
                'bg-primary/20 border-1',
                'border-b-2 border-b-base-200 hover:border-b-base-300',
            ]}
        >
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
                {value.ENUM_HAS_NO_VALUES ? <div tw='text-red-500'>NO VALUE FOR {p.enumName}</div> : null}
            </div>
        </div>
    )
})
