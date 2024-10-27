import type { StepOutput } from '../types/StepOutput'

import { observer } from 'mobx-react-lite'

import { exhaust } from '../csuite/utils/exhaust'
import { ComfyPromptL } from '../models/ComfyPrompt'
import { ComfyWorkflowL } from '../models/ComfyWorkflow'
import { Media3dDisplacementL } from '../models/Media3dDisplacement'
import { MediaCustomL } from '../models/MediaCustom'
import { MediaImageL } from '../models/MediaImage'
import { MediaSplatL } from '../models/MediaSplat'
import { MediaTextL } from '../models/MediaText'
import { MediaVideoL } from '../models/MediaVideo'
import { RuntimeErrorL } from '../models/RuntimeError'
import { StepL } from '../models/Step'
import { OutputDisplacementPreviewUI, OutputDisplacementUI } from './3d-displacement/OutputDisplacement'
import { Output3dScenePreviewUI, Output3dSceneUI2 } from './3d-scene/Output3dScene'
import { OutputPreviewWrapperUI } from './_OutputPreviewWrapperUI'
import { OutputImagePreviewUI, OutputImageUI } from './OutputImageUI'
import { OutputPromptPreviewUI, OutputPromptUI } from './OutputPromptUI'
import { OutputRuntimeErrorPreviewUI, OutputRuntimeErrorUI } from './OutputRuntimeErrorUI'
import { OutputSplatPreviewUI, OutputSplatUI } from './OutputSplat'
import { OutputTextPreviewUI, OutputTextUI } from './OutputTextUI'
import { OutputVideoPreviewUI, OutputVideoUI } from './OutputVideo'
import { OutputWorkflowPreviewUI, OutputWorkflowUI } from './OutputWorkflowUI'

// PREVIEW -----------------------------------------------------------------------------
export const OutputPreviewUI = observer(function StepOutputUI_(p: {
   //
   step?: Maybe<StepL>
   output: StepOutput
   size?: string
}) {
   return (
      <OutputPreviewWrapperUI output={p.output} size={p.size}>
         <OutputPreview_ContentUI step={p.step} output={p.output} />
      </OutputPreviewWrapperUI>
   )
})

// prettier-ignore
export const OutputPreview_ContentUI = observer(function OutputPreview_ContentUI_(p: {
     step?: Maybe<StepL>
     output: StepOutput
}) {
    // const size =
    const output = p.output

    if (output instanceof MediaTextL)            return <OutputTextPreviewUI         step={p.step} output={output} />
    if (output instanceof MediaImageL)           return <OutputImagePreviewUI        step={p.step} output={output} />
    if (output instanceof MediaVideoL)           return <OutputVideoPreviewUI        step={p.step} output={output} />
    if (output instanceof MediaSplatL)           return <OutputSplatPreviewUI        step={p.step} output={output} />
    if (output instanceof Media3dDisplacementL)  return <OutputDisplacementPreviewUI step={p.step} output={output} />
    if (output instanceof ComfyPromptL)          return <OutputPromptPreviewUI       step={p.step} output={output} />
    if (output instanceof ComfyWorkflowL)        return <OutputWorkflowPreviewUI     step={p.step} output={output} />
    if (output instanceof StepL)                 return <>🔴 StepL not yet supported</>
    if (output instanceof MediaCustomL)          return <Output3dScenePreviewUI      step={p.step} output={output} />
    if (output instanceof RuntimeErrorL)         return <OutputRuntimeErrorPreviewUI step={p.step} output={output} />

    exhaust(output)
    console.log(`[🔴]`,output)
    return <div className='border'>❌ unhandled message of type `{(output as any).constructor.name}`</div>
})

// FULL -----------------------------------------------------------------------------
// prettier-ignore
export const OutputUI = observer(function StepOutputUI_(p: { step?: Maybe<StepL>; output: StepOutput }) {
    const output = p.output

    if (output instanceof MediaTextL)            return <OutputTextUI                step={p.step} output={output} />
    if (output instanceof MediaImageL)           return <OutputImageUI               step={p.step} output={output} />
    if (output instanceof MediaVideoL)           return <OutputVideoUI               step={p.step} output={output} />
    if (output instanceof MediaSplatL)           return <OutputSplatUI               step={p.step} output={output} />
    if (output instanceof Media3dDisplacementL)  return <OutputDisplacementUI        step={p.step} output={output} />

    if (output instanceof ComfyPromptL)          return <OutputPromptUI              step={p.step} output={output} />
    if (output instanceof ComfyWorkflowL)        return <OutputWorkflowUI            step={p.step} output={output} />
    if (output instanceof StepL)                 return <>🔴</>
    if (output instanceof MediaCustomL)          return <Output3dSceneUI2            step={p.step} output={output} />

    if (output instanceof RuntimeErrorL)         return <OutputRuntimeErrorUI        step={p.step} output={output} />

    exhaust(output)
    console.log(`[🔴]`,output)
    return <div className='border'>❌ unhandled message of type `{(output as any).type}`</div>
})
