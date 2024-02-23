import type { StepL } from 'src/models/Step'

import { observer } from 'mobx-react-lite'

import { OutputPreviewWrapperUI } from './OutputPreviewWrapperUI'
import { TabUI } from 'src/app/layout/TabUI'
import { ComfyWorkflowL } from 'src/models/ComfyWorkflow'
import { Panel_ComfyUI } from 'src/panels/Panel_ComfyUI'
import { MenuItem } from 'src/rsuite/Dropdown'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'
import { useSt } from 'src/state/stateContext'
import { GraphPreviewUI } from 'src/widgets/misc/MsgShowHTMLUI'
import { ButtonDownloadFilesUI } from 'src/widgets/workspace/ButtonDownloadFilesUI'
import { ButtonOpenInComfyUI } from 'src/widgets/workspace/ButtonOpenInComfyUI'

export const OutputWorkflowPreviewUI = observer(function OutputWorkflowUI_(p: { step?: Maybe<StepL>; output: ComfyWorkflowL }) {
    const st = useSt()
    const size = st.historySizeStr
    const graph = p.output
    return (
        // <RevealUI showDelay={0} hideDelay={100}>

        <OutputPreviewWrapperUI output={p.output}>
            <RevealUI>
                <div style={{ width: size, height: size }} tw='flex item-center justify-center'>
                    <span
                        className='material-symbols-outlined text-primary block'
                        style={{
                            marginTop: `calc(0.2 * ${size})`,
                            fontSize: `calc(0.6 * ${size})`,
                        }}
                    >
                        account_tree
                    </span>
                </div>
                <ul tabIndex={0} tw='shadow menu dropdown-content z-[1] bg-base-100 rounded-box'>
                    {/* <ImageDropdownMenuUI img={image} /> */}
                    <MenuItem
                        icon={<span className='material-symbols-outlined'>open_in_new</span>}
                        onClick={graph.menuAction_openInTab}
                    >
                        open in ComfyUI Tab
                    </MenuItem>
                    <MenuItem
                        icon={<span className='material-symbols-outlined'>open_in_full</span>}
                        onClick={graph.menuAction_openInFullScreen}
                    >
                        open in ComfyUI FULL
                    </MenuItem>
                    <div className='divider my-0'></div>
                    <MenuItem
                        icon={<span className='material-symbols-outlined'>cloud_download</span>}
                        onClick={graph.menuAction_downloadWorkflow}
                    >
                        Download ComfyUI Workflow
                    </MenuItem>
                    <MenuItem
                        icon={<span className='material-symbols-outlined'>cloud_download</span>}
                        onClick={graph.menuAction_downloadPrompt}
                    >
                        Download ComfyUI PROMPT
                    </MenuItem>
                    <div className='divider my-0'>Quick Graph preview</div>
                    <GraphPreviewUI graph={graph} />
                    <ButtonOpenInComfyUI graph={p.output} />
                </ul>
            </RevealUI>
        </OutputPreviewWrapperUI>
    )
})

export const OutputWorkflowUI = observer(function OutputWorkflowUI_(p: { step?: Maybe<StepL>; output: ComfyWorkflowL }) {
    const graph = p.output
    return (
        <TabUI tw='w-full h-full'>
            <div>Simple View</div>
            <div tw='w-full h-full'>
                <div>
                    <ButtonDownloadFilesUI graph={graph} />
                    <ButtonOpenInComfyUI graph={graph} />
                </div>

                <div tw='text-sm italic opacity-50'>graphID: {graph.id}</div>
                <GraphPreviewUI graph={graph} />
            </div>
            <div>ComfyUI</div>
            <Panel_ComfyUI //
                tw='w-full h-full'
                litegraphJson={graph?.json_workflow()}
            />
        </TabUI>
    )
})

// onClick={async () => {
//     const graph = st.db.graphs.get(p.output.graphID)
//     if (graph == null) return // 🔴
//     const litegraphJson = await graph.json_workflow()
//     st.layout.FOCUS_OR_CREATE('ComfyUI', { litegraphJson })
// }}
// <OutputWorkflowUI step={p.step} output={p.output} />
