import type { EnumValue } from '../../../models/Schema'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { SelectPicker } from 'rsuite'
import { useProject } from '../../ProjectCtx'
import { Requestable_enum, Requestable_enumOpt } from 'src/controls/InfoRequest'

type T = {
    label: EnumValue
    value: EnumValue | null
}[]

export const WidgetEnumUI = observer(function WidgetEnumUI_<K extends KnownEnumNames>(p: {
    req: Requestable_enum<K> | Requestable_enumOpt<K>
}) {
    const req = p.req
    const project = useProject()
    const schema = project.schema
    const enumName = req.input.enumName
    const isOptional = req instanceof Requestable_enumOpt

    const options = useMemo(() => {
        if (schema == null) return []
        const x: T = schema!.getEnumOptionsForSelectPicker(enumName)
        if (isOptional) x.unshift({ label: 'none', value: null })
        return x
    }, [schema, isOptional])

    const value = req.state.val as any
    const valueIsValid = (value != null || isOptional) && options.some((x) => x.value === value)
    return (
        <>
            <SelectPicker //
                size='sm'
                cleanable={Boolean(isOptional)}
                // appearance='subtle'
                // defaultOpen={p.autofocus}
                data={options}
                value={value}
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
                    if (e == null) {
                        if (isOptional) req.state.active = false
                        return
                    }
                    req.state.val = e
                }}
            />
            {valueIsValid ? null : <span className='text-red-700'>🔴 {JSON.stringify(value)}</span>}
        </>
    )
})
