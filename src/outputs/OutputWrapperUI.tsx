import { observer } from 'mobx-react-lite'
import { ReactNode } from 'react'
import { RevealUI } from 'src/rsuite/RevealUI'
import { useSt } from 'src/state/stateContext'
import { StepOutput } from 'src/types/MessageFromExtensionToWebview'

export const OutputWrapperUI = observer(function OutputWrapperUI_(p: { label: string; children: ReactNode }) {
    return (
        <div className='flex flex-rowcol-info virtualBorder'>
            {p.label ? (
                <div className='flex items-baseline'>
                    <div className='font-bold'>{p.label}</div>
                    <div>{p.children}</div>
                </div>
            ) : (
                p.children
            )}
        </div>
    )
})

export const OutputPreviewWrapperUI = observer(function OutputPreviewWrapperUI_(p: {
    /** 3/4 letters max if possible */
    output: StepOutput
    /** must be able to scale to 64*64  */
    children: [anchor: ReactNode, tooltip: ReactNode]
}) {
    const st = useSt()
    const GalleryImageWidth = st.gallerySizeStr
    const type = p.output.type
    return (
        // <div>
        //     <div tw='text-sm italic' style={{ width: GalleryImageWidth, height: '1.5rem' }}>
        //         {type}
        //     </div>
        <RevealUI>
            <div
                tw='animate-in zoom-in duration-300'
                style={{
                    width: GalleryImageWidth,
                    height: GalleryImageWidth,
                    border: `1px solid ${getPreviewBorderColor(type)}`,
                }}
                className='flex flex-rowcol-info virtualBorder'
            >
                {p.children[0]}
                {/* {p.label ? (
                        <div className='flex items-baseline'>
                            <div className='font-bold'>{p.label}</div>
                            <div>{p.children}</div>
                        </div>
                    ) : (
                        p.children
                    )} */}
            </div>
            {p.children[1]}
        </RevealUI>
        // </div>
    )
})

const getPreviewBorderColor = (type: StepOutput['type']) => {
    if (type === 'print') return 'yellow'
    if (type === 'prompt') return 'cyan'
    if (type === 'executionError') return 'red'
    if (type === 'runtimeError') return 'red'
    if (type === 'show-html') return 'pink'
    if (type === 'ask') return 'orange'
    if (type === 'comfy-workflow') return 'blue'
    if (type === 'image') return '#1183ad'
    return exhaust(type)
}
