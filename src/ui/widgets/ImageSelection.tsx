import { useMemo } from 'react'
import { Radio, RadioGroup } from 'rsuite'
import { LightBoxState, LightBoxUI } from '../LightBox'
import type { ImageInfos } from '../../core-shared/GeneratedImageSummary'

export const ImageSelection = (p: { infos: ImageInfos[]; get: () => string; set: (value: string) => void }) => {
    const { infos, get, set } = p
    const lbs = useMemo(() => new LightBoxState(infos), [infos])
    const checkedURL = get()
    return (
        <div className='flex gap-2'>
            {infos.map((info) => {
                const url = info.comfyURL
                const isChecked = checkedURL === url
                return (
                    <RadioGroup value={checkedURL} name='radioList'>
                        <div key={url} onClick={() => set(url)} className='hover:bg-gray-500'>
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
                            <Radio value={url} onChange={() => set(url)} />
                        </div>
                    </RadioGroup>
                )
            })}
            <LightBoxUI lbs={lbs} />
        </div>
    )
}
