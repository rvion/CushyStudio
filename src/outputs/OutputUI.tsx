import type { StepL } from 'src/models/Step'

import { observer } from 'mobx-react-lite'
import { StepOutput } from 'src/types/MessageFromExtensionToWebview'
import { exhaust } from '../utils/misc/ComfyUtils'
import { OutputAskPreviewUI, OutputAskUI } from './OutputAskUI'
import { OutputExecutionErrorUI } from './OutputExecutionErrorUI'
import { OutputHtmlPreviewUI, OutputHtmlUI } from './OutputHtmlUI'
import { OutputImagePreviewUI, OutputImageUI } from './OutputImageUI'
import { OutputPromptPreviewUI, OutputPromptUI } from './OutputPromptUI'
import { OutputRuntimeErrorPreviewUI, OutputRuntimeErrorUI } from './OutputRuntimeErrorUI'
import { OutputTextPreviewUI, OutputTextUI } from './OutputTextUI'
import { OutputWorkflowPreviewUI, OutputWorkflowUI } from './OutputWorkflowUI'
import { OutputDisplacementPreviewUI, OutputDisplacementUI } from './OutputDisplacement'

// PREVIEW -----------------------------------------------------------------------------
// prettier-ignore
export const OutputPreviewUI = observer(function StepOutputUI_(p: { step: StepL; output: StepOutput }) {
    const output = p.output

    if (output.type === 'print')           return <OutputTextPreviewUI         step={p.step} output={output} />
    if (output.type === 'prompt')          return <OutputPromptPreviewUI       step={p.step} output={output} />
    if (output.type === 'executionError')  return <OutputExecutionErrorUI      step={p.step} output={output} />
    if (output.type === 'runtimeError')    return <OutputRuntimeErrorPreviewUI step={p.step} output={output} />
    if (output.type === 'show-html')       return <OutputHtmlPreviewUI         step={p.step} output={output} />
    if (output.type === 'ask')             return <OutputAskPreviewUI          step={p.step} output={output} />
    if (output.type === 'comfy-workflow')  return <OutputWorkflowPreviewUI     step={p.step} output={output} />
    if (output.type === 'image')           return <OutputImagePreviewUI        step={p.step} output={output} />
    if (output.type === 'displaced-image') return <OutputDisplacementPreviewUI step={p.step} output={output} />

    exhaust(output)
    return <div className='border'>❌ unhandled message of type `{(output as any).type}`</div>
})

// FULL -----------------------------------------------------------------------------
// prettier-ignore
export const OutputUI = observer(function StepOutputUI_(p: { step: StepL; output: StepOutput }) {
    const output = p.output

    if (output.type === 'print')           return <OutputTextUI                step={p.step} output={output} />
    if (output.type === 'prompt')          return <OutputPromptUI              step={p.step} output={output} />
    if (output.type === 'executionError')  return <OutputExecutionErrorUI      step={p.step} output={output} />
    if (output.type === 'runtimeError')    return <OutputRuntimeErrorUI        step={p.step} output={output} />
    if (output.type === 'show-html')       return <OutputHtmlUI                step={p.step} output={output} />
    if (output.type === 'ask')             return <OutputAskUI                 step={p.step} output={output} />
    if (output.type === 'comfy-workflow')  return <OutputWorkflowUI            step={p.step} output={output} />
    if (output.type === 'image')           return <OutputImageUI               step={p.step} output={output} />
    if (output.type === 'displaced-image') return <OutputDisplacementUI        step={p.step} output={output} />

    exhaust(output)
    return <div className='border'>❌ unhandled message of type `{(output as any).type}`</div>
})
