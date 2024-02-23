import { observer } from 'mobx-react-lite'

import { OutputPreviewWrapperUI } from './OutputPreviewWrapperUI'
import { MediaSplatL } from 'src/models/MediaSplat'
import { StepL } from 'src/models/Step'
import { useSt } from 'src/state/stateContext'

export const OutputSplatPreviewUI = observer(function OutputImagePreviewUI_(p: { step?: Maybe<StepL>; output: MediaSplatL }) {
    const st = useSt()
    const size = st.historySize
    const sizeStr = st.historySizeStr
    return (
        <OutputPreviewWrapperUI output={p.output}>
            {/*  */}
            <div
                tw='bg-secondary text-secondary-content text-center w-full'
                style={{ lineHeight: sizeStr, fontSize: `${size / 4}px` }}
            >
                Splat
            </div>
        </OutputPreviewWrapperUI>
    )
})

export const OutputSplatUI = observer(function OutputSplatUI_(p: { step?: Maybe<StepL>; output: MediaSplatL }) {
    return (
        <iframe //
            tabIndex={-1}
            autoFocus
            className='w-full h-full'
            frameBorder='0'
            src='https://antimatter15.com/splat/'
        ></iframe>
    )
})
