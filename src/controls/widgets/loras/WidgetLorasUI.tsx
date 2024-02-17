import { observer } from 'mobx-react-lite'
import { Widget_loras } from 'src/controls/Widget'
import { InputNumberUI } from 'src/rsuite/InputNumberUI'
import { Button, MultiCascader } from 'src/rsuite/shims'
import { parseFloatNoRoundingErr } from 'src/utils/misc/parseFloatNoRoundingErr'
import { useSt } from '../../../state/stateContext'

export const WidgetLorasUI = observer(function LoraWidgetUI_(p: { widget: Widget_loras }) {
    const widget = p.widget
    const st = useSt()
    const schema = st.schema
    if (schema == null) return <div>❌ no schema</div>
    const values = widget.serial.loras
    const names = values.map((x) => x.name)

    return (
        <div>
            <MultiCascader //
                size='sm'
                style={{ maxWidth: '300px' }}
                value={names}
                menuWidth={300}
                data={widget.FOLDER}
                onChange={(rawPicks: (string | number)[]) => {
                    const picks = rawPicks.map((raw) => {
                        if (typeof raw === 'number') return raw.toString()
                        return raw.replace(/\\/g, '/')
                    })
                    console.log({ picks })
                    const nextNames: string[] = []
                    for (const rawPath of widget.allLoras) {
                        const path = rawPath.replace(/\\/g, '/')
                        for (const v of picks) {
                            if (typeof v == 'number') continue
                            if (path.startsWith(v)) {
                                nextNames.push(rawPath)
                            }
                        }
                    }
                    // remove old vals
                    for (const oldNv of widget.selectedLoras.keys()) {
                        if (!nextNames.includes(oldNv)) widget.selectedLoras.delete(oldNv)
                    }
                    // add new vals
                    for (const nv of nextNames) {
                        if (widget.selectedLoras.has(nv)) continue
                        widget.selectedLoras.set(nv, { strength_clip: 1, strength_model: 1, name: nv as any })
                    }
                    // const nextValues: SimplifiedLoraDef[] = nextNames.map(
                    //     (x): SimplifiedLoraDef => ({
                    //         name: x as any,
                    //         strength_clip: 1,
                    //         strength_model: 1,
                    //     }),
                    // )
                    const nextValues = [...widget.selectedLoras.values()]
                    widget.serial.loras = nextValues
                }}
                // block
            />
            <div>
                {[...widget.selectedLoras.entries()].map(([loraName, sld]) => (
                    <div key={loraName} className='flex items-start'>
                        <div className='shrink-0'>{loraName.replace('.safetensors', '')}</div>
                        <div className='flex-grow'></div>
                        <InputNumberUI
                            value={sld.strength_clip}
                            step={0.1}
                            onValueChange={(v) => (sld.strength_clip = parseFloatNoRoundingErr(v, 2))}
                            mode='float'
                            // style={{ width: '3.5rem' }}
                            // type='number'
                            // size='xs'
                        />
                        <InputNumberUI
                            value={sld.strength_model}
                            step={0.1}
                            onValueChange={(v) => (sld.strength_model = parseFloatNoRoundingErr(v, 2))}
                            mode='float'
                            // style={{ width: '3.5rem' }}
                            // type='number'
                            // size='xs'
                        />
                        <Button
                            size='xs'
                            icon={<span className='material-symbols-outlined'>delete</span>}
                            onClick={() => {
                                const next = values.filter((x) => x.name !== loraName)
                                widget.selectedLoras.delete(loraName)
                                widget.serial.loras = next
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
})
