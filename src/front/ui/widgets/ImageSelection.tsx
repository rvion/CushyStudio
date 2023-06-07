import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { Button, Radio, RadioGroup } from 'rsuite'
import { LightBoxState, LightBoxUI } from '../LightBox'
import type { ImageT } from 'src/models/Image'
import { useImageDrop } from '../galleries/dnd'
import { ImageAnswer } from 'src/controls/askv2'
import { useStep } from '../FormCtx'

export const ImageSelection = observer(function ImageSelection_(p: {
    // infos: ImageInfos[]
    get: () => ImageAnswer | null
    set: (value: ImageAnswer) => void
}) {
    const { get, set } = p
    // const lbs = useMemo(() => new LightBoxState(() => infos), [infos])
    const checkedURL = get()
    const [dropStyle, dropRef] = useImageDrop((i) => {
        set({ type: 'imageID', imageID: i.id })
    })
    const step = useStep()
    const node = step.inputGraph.item.findNodeByType('VAEDecode')
    return (
        <>
            <Button onClick={() => set({ type: 'imageSignal', nodeID: node!.uid, fieldName: 'IMAGE' })}>last</Button>
            <div ref={dropRef} className='flex gap-2' style={{ width: '3rem', height: '3rem', ...dropStyle }}>
                {/* {infos.map((info) => {
                const url = info.comfyURL
                return (
                    <RadioGroup value={checkedURL?.comfyURL} name='radioList'>
                        <div key={url} onClick={() => set(info)} className='hover:bg-gray-500'>
                            <img
                                onClick={() => (lbs.opened = true)}
                                style={{
                                    cursor: 'pointer',
                                    objectFit: 'contain',
                                    width: '32px',
                                    height: '32px',
                                }}
                                src={url}
                                alt=''
                            />
                            <Radio value={url} onChange={() => set(info)} />
                        </div>
                    </RadioGroup>
                )
            })} */}
                {/* <LightBoxUI lbs={lbs} /> */}
            </div>
            <pre>{JSON.stringify(get(), null, 3)}</pre>
        </>
    )
})
