import type { MediaVideoL } from '../models/MediaVideo'

import { observer } from 'mobx-react-lite'

import { StepL } from '../models/Step'
import { useSt } from '../state/stateContext'

export const OutputVideoPreviewUI = observer(function OutputImagePreviewUI_(p: {
    //
    step?: Maybe<StepL>
    output: MediaVideoL
    size?: string
}) {
    const st = useSt()
    const size = st.historySize
    const sizeStr = st.historySizeStr
    return (
        <div
            tw={[
                //
                'bg-red-400 text-black',
                'text-center w-full font-bold',
            ]}
            style={{ fontSize: `${size / 2}px` }}
        >
            <span style={{ lineHeight: sizeStr }} className='material-symbols-outlined p-0 m-0'>
                play_circle
            </span>
        </div>
    )
})

export const OutputVideoUI = observer(function OutputVideoUI_(p: { step?: Maybe<StepL>; output: MediaVideoL }) {
    return (
        <video
            style={{
                objectFit: 'contain',
                // ...extraProps,
            }}
            src={p.output.url}
            controls
            autoPlay
            loop
        />
    )
})
