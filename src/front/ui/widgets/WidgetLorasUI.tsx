import type { SchemaL } from 'src/models/Schema'
import type { SimplifiedLoraDef } from 'src/presets/SimplifiedLoraDef'

import * as I from '@rsuite/icons'
import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { IconButton, Input, MultiCascader } from 'rsuite'
import { ItemDataType } from 'rsuite/esm/@types/common'
import { useSt } from '../../FrontStateCtx'
// ----------------------------------------------------------------------

class WidgetLorasState {
    allLoras: string[]
    selectedLoras = new Map<string, SimplifiedLoraDef>()
    constructor(
        //
        public schema: SchemaL,
        initialValues: SimplifiedLoraDef[] = [],
    ) {
        this.allLoras = schema.getLoras()
        for (const lora of this.allLoras) {
            if (lora === 'None') continue
            this._insertLora(lora)
        }
        for (const v of initialValues) {
            this.selectedLoras.set(v.name, v)
        }
        makeAutoObservable(this)
    }

    FOLDER: ItemDataType<any>[] = []
    private _insertLora = (rawPath: string) => {
        const path = rawPath.replace(/\\/g, '/')
        const segments = path.split('/')
        let folder = this.FOLDER
        for (let i = 0; i < segments.length - 1; i++) {
            const segment = segments[i]
            const found = folder.find((x) => x.label === segment)
            if (found == null) {
                const node = {
                    label: segment,
                    value: segments.slice(0, i + 1).join('\\'),
                    children: [],
                }
                folder.push(node)
                folder = node.children
            } else {
                folder = found.children!
            }
        }
        folder.push({ label: segments[segments.length - 1], value: rawPath })
    }
}

export const WidgetLorasUI = observer(function LoraWidgetUI_(p: {
    //
    get: () => SimplifiedLoraDef[] | null
    set: (v: SimplifiedLoraDef[]) => void
}) {
    const st = useSt()
    const schema = st.schema
    if (schema == null) return <div>❌ no schema</div>

    const values = p.get() ?? []
    const uiSt = useMemo(() => new WidgetLorasState(schema), [])
    const names = values.map((x) => x.name)

    return (
        <div>
            {/* {JSON.stringify(names)} */}
            {/* {JSON.stringify(schema.getLoras())} */}
            <MultiCascader //
                size='sm'
                // appearance='subtle'
                style={{ maxWidth: '300px' }}
                value={names}
                menuWidth={300}
                data={uiSt.FOLDER}
                onChange={(rawPicks: (string | number)[]) => {
                    const picks = rawPicks.map((raw) => {
                        if (typeof raw === 'number') return raw.toString()
                        return raw.replace(/\\/g, '/')
                    })
                    console.log({ picks })
                    const nextNames: string[] = []
                    for (const rawPath of uiSt.allLoras) {
                        const path = rawPath.replace(/\\/g, '/')
                        for (const v of picks) {
                            if (typeof v == 'number') continue
                            if (path.startsWith(v)) {
                                nextNames.push(rawPath)
                            }
                        }
                    }
                    // remove old vals
                    for (const oldNv of uiSt.selectedLoras.keys()) {
                        if (!nextNames.includes(oldNv)) uiSt.selectedLoras.delete(oldNv)
                    }
                    // add new vals
                    for (const nv of nextNames) {
                        if (uiSt.selectedLoras.has(nv)) continue
                        uiSt.selectedLoras.set(nv, { strength_clip: 1, strength_model: 1, name: nv as any })
                    }
                    const nextValues: SimplifiedLoraDef[] = nextNames.map(
                        (x): SimplifiedLoraDef => ({
                            name: x as any,
                            strength_clip: 1,
                            strength_model: 1,
                        }),
                    )
                    p.set(nextValues)
                }}
                // block
            />
            <div>
                {[...uiSt.selectedLoras.entries()].map(([loraName, sld]) => (
                    <div key={loraName} className='flex items-start'>
                        <div className='shrink-0'>{loraName.replace('.safetensors', '')}</div>
                        <div className='flex-grow'></div>
                        <Input
                            size='xs'
                            type='number'
                            value={sld.strength_clip}
                            step={0.1}
                            onChange={(v) => (sld.strength_clip = typeof v === 'number' ? v : parseFloat(v))}
                            style={{ width: '3.5rem' }}
                        />
                        <Input
                            size='xs'
                            type='number'
                            value={sld.strength_model}
                            step={0.1}
                            onChange={(v) => (sld.strength_model = typeof v === 'number' ? v : parseFloat(v))}
                            style={{ width: '3.5rem' }}
                        />
                        <IconButton
                            size='xs'
                            icon={<I.Trash />}
                            onClick={() => {
                                const next = values.filter((x) => x.name !== loraName)
                                uiSt.selectedLoras.delete(loraName)
                                p.set(next)
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
})
