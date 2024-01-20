import type { CleanedEnumResult } from 'src/types/EnumUtils'
import type { ComfySchemaL, EnumName, EnumValue } from '../../../models/Schema'
import { EnumDefault, extractDefaultValue } from '../../EnumDefault'
import type { FormBuilder } from '../../FormBuilder'
import type { IWidget, WidgetConfigFields, WidgetSerialFields, WidgetTypeHelpers } from '../../IWidget'

import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import { SelectUI } from 'src/rsuite/SelectUI'
import { Popover, Whisper } from 'src/rsuite/shims'
import { useSt } from 'src/state/stateContext'
import { WidgetDI } from '../WidgetUI.DI'

// CONFIG
export type Widget_enum_config<T extends KnownEnumNames> = WidgetConfigFields<{
    default?: Requirable[T] | EnumDefault<T>
    enumName: T
}>

// SERIAL
export type Widget_enum_serial<T extends KnownEnumNames> = WidgetSerialFields<{ type: 'enum'; active: true; val: Requirable[T] }>

// OUT
export type Widget_enum_output<T extends KnownEnumNames> = Requirable[T]

// TYPES
export type Widget_enum_types<T extends KnownEnumNames> = {
    $Type: 'enum'
    $Input: Widget_enum_config<T>
    $Serial: Widget_enum_serial<T>
    $Output: Widget_enum_output<T>
}

// STATE
export interface Widget_enum<T extends KnownEnumNames> extends WidgetTypeHelpers<Widget_enum_types<T>> {}
export class Widget_enum<T extends KnownEnumNames> implements IWidget<Widget_enum_types<T>> {
    isVerticalByDefault = false
    isCollapsible = false
    id: string
    type: 'enum' = 'enum'
    get possibleValues() {
        return this.schema.knownEnumsByName.get(this.config.enumName)?.values ?? []
    }

    serial: Widget_enum_serial<T>

    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public config: Widget_enum_config<T>,
        serial?: Widget_enum_serial<T>,
    ) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            type: 'enum',
            id: this.id,
            active: true,
            val: extractDefaultValue(config) ?? (this.possibleValues[0] as any),
        }
        makeAutoObservable(this)
    }
    get status(): CleanedEnumResult<any> {
        return this.schema.st.fixEnumValue(this.serial.val as any, this.config.enumName, false)
    }
    get result(): Widget_enum_output<T> {
        return this.status.finalValue
    }
}

// DI
WidgetDI.Widget_enum = Widget_enum

// UI
export const WidgetEnumUI = observer(function WidgetEnumUI_<K extends KnownEnumNames>(p: { widget: Widget_enum<K> }) {
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
                {value.ENUM_HAS_NO_VALUES ? <div tw='text-red-500'>NO VALUE FOR {p.enumName}</div> : null}
            </div>
        </div>
    )
})
