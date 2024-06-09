import { observer } from 'mobx-react-lite'

import { SpacerUI } from '../../controls/widgets/spacer/SpacerUI'
import { _formatPreviewDate } from '../../csuite/formatters/_formatPreviewDate'
import { OutputUI } from '../../outputs/OutputUI'
import { useSt } from '../../state/stateContext'
import { PanelHeaderUI } from '../PanelHeader'
import { LatentIfLastUI } from './LatentIfLastUI'
import { PanelOutputConf } from './PanelOutput_conf'
import { PanelOutput_OutputListHeaderUI } from './PanelOutput_OutputListHeaderUI'

export const Panel_Output = observer(function Panel_Output_(p: {}) {
    const st = useSt()
    const selectedStep = st.focusedStepL
    if (selectedStep == null) return null
    const out1 = st.hovered ?? st.focusedStepOutput ?? selectedStep.lastMediaOutput ?? st.db.media_image.last()
    const out2 = selectedStep.comfy_workflows.findLast((i) => i.createdAt)

    return (
        <div
            tw={[
                //
                'flex flex-col',
                'flex-grow h-full w-full',
                'overflow-clip', // Make sure scrollbar doesn't encompass entire panel, only where it makes sense.
            ]}
        >
            <PanelHeaderUI title='Step: latest' icon={'mdiExitRun'}>
                <SpacerUI />
                <div tw='flex text-sm text-shadow flex-grow px-1'>
                    <div tw='line-clamp-1'>{selectedStep.name}</div>
                    <div tw='flex-grow' /> <div tw='opacity-50'>{_formatPreviewDate(new Date(selectedStep.createdAt))}</div>
                </div>

                {PanelOutputConf.renderAsConfigBtn({ title: 'Output' })}
            </PanelHeaderUI>
            {/* {explain} */}
            <PanelOutput_OutputListHeaderUI />
            {/* <MainOutputHistoryUI /> */}
            {/* <div tw='flex-grow flex flex-row relative'> */}
            <div tw={[/* 'animate-in zoom-in-75', */ 'flex flex-grow overflow-auto']}>
                {/*  */}
                {out1 && <OutputUI output={out1} />}
            </div>
            <div tw={['absolute bottom-0 z-30']}>{out2 && <OutputUI output={out2} />}</div>
            {/* {out3 && (
                    <div tw={['flex flex-grow overflow-auto top-20 absolute z-20  bg-opacity-80']}>
                        <OutputUI output={out3} />
                    </div>
                )} */}
            <LatentIfLastUI />
            {/* </div> */}
        </div>
    )
})
