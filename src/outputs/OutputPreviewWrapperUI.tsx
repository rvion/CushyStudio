import { observer } from 'mobx-react-lite'
import { ReactNode } from 'react'
import { RevealUI } from 'src/rsuite/RevealUI'
import { useSt } from 'src/state/stateContext'
import { StepOutput } from 'src/types/MessageFromExtensionToWebview'
import { exhaust } from 'src/utils/misc/ComfyUtils'

export const OutputPreviewWrapperUI = observer(function OutputPreviewWrapperUI_(p: {
    /** 3/4 letters max if possible */
    output: StepOutput
    /** must be able to scale to 64*64  */
    children: [anchor: ReactNode, tooltip: ReactNode]
}) {
    const st = useSt()
    const sizeStr = st.outputPreviewSizeStr
    const type = p.output.type
    return (
        <RevealUI showDelay={0}>
            <div
                // tw='animate-in zoom-in duration-300'
                tw='rounded'
                style={{
                    width: sizeStr,
                    height: sizeStr,
                    // border: `2px solid ${getPreviewBorderColor(type)}`,
                }}
                className='flex flex-rowcol-info virtualBorder'
            >
                {p.children[0]}
            </div>
            {p.children[1]}
        </RevealUI>
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
    if (type === 'displaced-image') return 'purple'
    if (type === 'video') return 'purple'
    return exhaust(type)
}
