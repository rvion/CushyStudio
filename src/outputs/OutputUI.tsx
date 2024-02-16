import { StepL } from 'src/models/Step'

import { observer } from 'mobx-react-lite'
import { StepOutput } from 'src/types/StepOutput'
import { exhaust } from '../utils/misc/ComfyUtils'
import { OutputImagePreviewUI, OutputImageUI } from './OutputImageUI'
import { OutputPromptPreviewUI, OutputPromptUI } from './OutputPromptUI'
import { OutputRuntimeErrorPreviewUI, OutputRuntimeErrorUI } from './OutputRuntimeErrorUI'
import { OutputTextPreviewUI, OutputTextUI } from './OutputTextUI'
import { OutputWorkflowPreviewUI, OutputWorkflowUI } from './OutputWorkflowUI'
import { OutputDisplacementPreviewUI, OutputDisplacementUI } from './displacement/OutputDisplacement'
import { OutputVideoPreviewUI, OutputVideoUI } from './OutputVideo'
import { MediaTextL } from 'src/models/MediaText'
import { ComfyPromptL } from 'src/models/ComfyPrompt'
import { MediaImageL } from 'src/models/MediaImage'
import { MediaVideoL } from 'src/models/MediaVideo'
import { RuntimeErrorL } from 'src/models/RuntimeError'
import { Media3dDisplacementL } from 'src/models/Media3dDisplacement'
import { ComfyWorkflowL } from 'src/models/ComfyWorkflow'
import { MediaSplatL } from 'src/models/MediaSplat'
import { OutputSplatPreviewUI, OutputSplatUI } from './OutputSplat'

// PREVIEW -----------------------------------------------------------------------------
// prettier-ignore
export const OutputPreviewUI = observer(function StepOutputUI_(p: { step?: Maybe<StepL>; output: StepOutput }) {
    const output = p.output

    if (output instanceof MediaTextL)            return <OutputTextPreviewUI         step={p.step} output={output} />
    if (output instanceof MediaImageL)           return <OutputImagePreviewUI        step={p.step} output={output} />
    if (output instanceof MediaVideoL)           return <OutputVideoPreviewUI        step={p.step} output={output} />
    if (output instanceof MediaSplatL)           return <OutputSplatPreviewUI        step={p.step} output={output} />
    if (output instanceof Media3dDisplacementL)  return <OutputDisplacementPreviewUI step={p.step} output={output} />

    if (output instanceof ComfyPromptL)          return <OutputPromptPreviewUI       step={p.step} output={output} />
    if (output instanceof ComfyWorkflowL)        return <OutputWorkflowPreviewUI     step={p.step} output={output} />
    if (output instanceof StepL)                 return <>🔴</>

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

    if (output instanceof RuntimeErrorL)         return <OutputRuntimeErrorUI        step={p.step} output={output} />

    exhaust(output)
    console.log(`[🔴]`,output)
    return <div className='border'>❌ unhandled message of type `{(output as any).type}`</div>
})
