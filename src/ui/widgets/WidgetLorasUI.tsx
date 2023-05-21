import type { SchemaL } from 'src/core/Schema'
import type { SimplifiedLoraDef } from 'src/presets/SimplifiedLoraDef'

import * as I from '@rsuite/icons'
import { makeAutoObservable } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { IconButton, MultiCascader, Slider } from 'rsuite'
import { ItemDataType } from 'rsuite/esm/@types/common'
import { useSt } from '../../front/FrontStateCtx'
import { useMemo } from 'react'
// ----------------------------------------------------------------------

class WidgetLorasState {
    loras: string[]
    constructor(public schema: SchemaL) {
        this.loras = schema.getLoras()
        for (const lora of this.loras) this.insertLora(lora)
        makeAutoObservable(this)
    }

    FOLDER: ItemDataType<any>[] = []

    insertLora = (rawPath: string) => {
        const path = rawPath.replace(/\\/g, '/')
        const segments = path.split('/')
        console.log('a. segments=', segments)
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

    const uiSt = useMemo(() => new WidgetLorasState(schema), [])
    const values = p.get() ?? []
    const names = values.map((x) => x.name)

    return (
        <div>
            {/* {JSON.stringify(schema.getLoras())} */}
            <MultiCascader //
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
                    for (const rawPath of uiSt.loras) {
                        const path = rawPath.replace(/\\/g, '/')

                        for (const v of picks) {
                            if (typeof v == 'number') continue
                            if (path.startsWith(v)) {
                                nextNames.push(rawPath)
                            }
                        }
                    }
                    console.log({ nextNames })
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
                {names?.map((loraName) => (
                    <div className='flex items-center'>
                        <IconButton
                            icon={<I.Trash />}
                            onClick={() => {
                                const next = values.filter((x) => x.name !== loraName)
                                p.set(next)
                            }}
                        />
                        <div className='col'>
                            <div>{loraName}</div>
                            <div className='flex flex-col justify-evenly' style={{ width: '10rem', height: '4rem' }}>
                                <Slider value={1} step={0.1} style={{}} min={0} max={2} />
                                <Slider value={1} step={0.1} style={{}} min={0} max={2} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
})
