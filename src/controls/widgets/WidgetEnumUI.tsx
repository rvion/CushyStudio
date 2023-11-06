import { observer } from 'mobx-react-lite'
import { SelectPicker, Toggle } from 'rsuite'
import { Widget_enum, Widget_enumOpt } from 'src/controls/Widget'
import { useSt } from 'src/state/stateContext'
import type { EnumName, EnumValue } from '../../models/Schema'

type T = {
    label: EnumValue
    value: EnumValue | null
}[]

export const WidgetEnumUI = observer(function WidgetEnumUI_<K extends KnownEnumNames>(p: {
    req: Widget_enum<K> | Widget_enumOpt<K>
}) {
    const req = p.req
    const enumName = req.input.enumName
    const isOptional = req instanceof Widget_enumOpt
    // const options = schema.getEnumOptionsForSelectPicker(enumName)

    const value = req.state.val as any
    const showToogle =
        req instanceof Widget_enumOpt //
            ? true
            : req.state.active !== true
    return (
        <div className='flex gap-1'>
            {showToogle && (
                <Toggle
                    // size='sm'
                    checked={req.state.active}
                    onChange={(t) => (req.state.active = t)}
                />
            )}
            <EnumSelectorUI
                value={value}
                disabled={!req.state.active}
                isOptional={isOptional}
                enumName={enumName}
                onChange={(e) => {
                    if (e == null) {
                        if (isOptional) req.state.active = false
                        return
                    }
                    req.state.val = e as any // 🔴
                }}
            />
        </div>
    )
})

export const EnumSelectorUI = observer(function EnumSelectorUI_(p: {
    isOptional: boolean
    value: EnumValue | null
    onChange: (v: EnumValue | null) => void
    disabled?: boolean
    enumName: EnumName
}) {
    const project = useSt().getProject()
    const schema = project.schema
    const options = schema.getEnumOptionsForSelectPicker(p.enumName)
    const valueIsValid = (p.value != null || p.isOptional) && options.some((x) => x.value === p.value)
    return (
        <>
            <SelectPicker //
                size='sm'
                disabled={p.disabled}
                data={options}
                value={p.value}
                renderValue={(v) => {
                    if (v === true) return '🟢 true'
                    if (v === false) return '❌ false'
                    return v
                }}
                renderMenuItem={(v) => {
                    if (v === true) return '🟢 true'
                    if (v === false) return '❌ false'
                    return v
                }}
                onChange={(e) => {
                    p.onChange(e)
                }}
            />
            {valueIsValid ? null : <span className='text-red-700'>🔴 {JSON.stringify(p.value)}</span>}
        </>
    )
})
