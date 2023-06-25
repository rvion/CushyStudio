import type { EnumValue } from '../../../models/Schema'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { SelectPicker } from 'rsuite'
import { useProject } from '../../ProjectCtx'

export const WidgetEnumUI = observer(function WidgetEnumUI_(p: {
    enumName: string
    autofocus?: boolean
    get: () => EnumValue | null
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
    return (
        <SelectPicker //
            size='sm'
            cleanable={Boolean(p.optional)}
            // appearance='subtle'
            // defaultOpen={p.autofocus}
            data={options}
            value={p.get() ?? null}
            onChange={(e) => {
                if (e == null) {
                    if (p.optional) p.set(null)
                    return
                }
                p.set(e)
            }}
        />
    )
})
