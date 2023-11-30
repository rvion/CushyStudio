import { observer } from 'mobx-react-lite'
import { StepL } from 'src/models/Step'
import { useSt } from 'src/state/stateContext'
import { StepOutput_Image } from 'src/types/StepOutput'
import { OutputPreviewWrapperUI } from './OutputPreviewWrapperUI'

import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import { assets } from 'src/utils/assets/assets'

export const OutputImagePreviewUI = observer(function OutputImagePreviewUI_(p: {
    step?: Maybe<StepL>
    output: StepOutput_Image
}) {
    // const size = useSt().outputPreviewSizeStr
    const image = p.output
    return (
        <OutputPreviewWrapperUI output={p.output}>
            <img
                src={image.url}
                loading='lazy'
                style={{
                    objectFit: 'contain',
                    width: '100%',
                    height: '100%',
                    padding: '0.2rem',
                    borderRadius: '.5rem',
                }}
            />
            <OutputImageUI step={p.step} output={p.output} />
        </OutputPreviewWrapperUI>
    )
})

export const OutputImageUI = observer(function OutputImageUI_(p: { step?: Maybe<StepL>; output: StepOutput_Image }) {
    const image = p.output
    const url = image.url
    return (
        <TransformWrapper centerZoomedOut centerOnInit>
            <TransformComponent
                wrapperStyle={{ height: '100%', width: '100%', display: 'flex' }}
                contentStyle={{ height: '100%', width: '100%' }}
            >
                {/* {latentUrl && (
                    <img //
                        tw='absolute bottom-0 right-0 shadow-xl'
                        style={{ width: st.latentSizeStr, height: st.latentSizeStr, objectFit: 'contain' }}
                        src={latentUrl}
                        alt='last generated image'
                    />
                )} */}
                {url ? (
                    <img //
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        src={url}
                        alt='last generated image'
                    />
                ) : (
                    <div tw='w-full h-full relative flex'>
                        <div
                            style={{ fontSize: '3rem', textShadow: '0 0 5px #ffffff' }}
                            tw='animate-pulse absolute self-center w-full text-center text-xl text-black font-bold'
                        >
                            no image yet
                        </div>
                        <img //
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            src={assets.public_illustrations_image_home_transp_webp}
                            alt='last generated image'
                        />
                    </div>
                )}
                {/* </div> */}
            </TransformComponent>
        </TransformWrapper>
    )
})
