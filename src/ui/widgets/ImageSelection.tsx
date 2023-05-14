import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { Radio, RadioGroup } from 'rsuite'
import { LightBoxState, LightBoxUI } from '../LightBox'
import type { ImageInfos } from '../../core/GeneratedImageSummary'

export const ImageSelection = observer(function ImageSelection_(p: {
    // infos: ImageInfos[]
    get: () => ImageInfos | null
    set: (value: ImageInfos) => void
}) {
    const { get, set } = p
    // const lbs = useMemo(() => new LightBoxState(() => infos), [infos])
    const checkedURL = get()
    return (
        <div className='flex gap-2'>
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
            image selection
        </div>
    )
})
