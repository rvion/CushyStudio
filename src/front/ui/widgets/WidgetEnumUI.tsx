import { observer } from 'mobx-react-lite'
import { SelectPicker, Toggle } from 'rsuite'
import { Requestable_enum, Requestable_enumOpt } from 'src/controls/InfoRequest'
import type { EnumName, EnumValue } from '../../../models/Schema'
import { useProject } from '../../ProjectCtx'

type T = {
    label: EnumValue
    value: EnumValue | null
}[]

export const WidgetEnumUI = observer(function WidgetEnumUI_<K extends KnownEnumNames>(p: {
    req: Requestable_enum<K> | Requestable_enumOpt<K>
}) {
    const req = p.req
    const enumName = req.input.enumName
    const isOptional = req instanceof Requestable_enumOpt
    // const options = schema.getEnumOptionsForSelectPicker(enumName)

    const value = req.state.val as any

    return (
        <div className='flex gap-1'>
            <Toggle
                // size='sm'
                checked={req.state.active}
                onChange={(t) => (req.state.active = t)}
            />
            <EnumSelectorUI
                value={value}
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
    enumName: EnumName
}) {
    const project = useProject()
    const schema = project.schema
    const options = schema.getEnumOptionsForSelectPicker(p.enumName)
    const valueIsValid = (p.value != null || p.isOptional) && options.some((x) => x.value === p.value)
    return (
        <>
            <SelectPicker //
                size='sm'
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
