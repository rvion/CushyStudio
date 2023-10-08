import type { EnumValue } from '../../../models/Schema'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { SelectPicker } from 'rsuite'
import { useProject } from '../../ProjectCtx'

export const WidgetEnumUI = observer(function WidgetEnumUI_(p: {
    enumName: string
    autofocus?: boolean
    get: () => EnumValue | null
    def: () => Maybe<EnumValue>
    set: (v: EnumValue | null) => void
    optional?: boolean
}) {
    type T = {
        label: EnumValue
        value: EnumValue | null
    }[]
    const project = useProject()
    const schema = project.schema
    const options = useMemo(() => {
        if (schema == null) return []
        const x: T = schema!.getEnumOptionsForSelectPicker(p.enumName)
        if (p.optional) x.unshift({ label: 'none', value: null })
        return x
    }, [schema, p.optional])

    const value = p.get() ?? p.def() ?? null
    const valueIsValid = (value != null || p.optional) && options.some((x) => x.value === value)
    return (
        <>
            <SelectPicker //
                size='sm'
                cleanable={Boolean(p.optional)}
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
                        if (p.optional) p.set(null)
                        return
                    }
                    p.set(e)
                }}
            />
            {valueIsValid ? null : <span className='text-red-700'>🔴 {JSON.stringify(value)}</span>}
        </>
    )
})
