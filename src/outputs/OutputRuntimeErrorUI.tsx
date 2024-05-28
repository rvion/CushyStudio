import { observer } from 'mobx-react-lite'

import { RuntimeErrorL } from '../models/RuntimeError'
import { StepL } from '../models/Step'
import { Surface } from '../rsuite/shims'
import { JsonViewUI } from '../widgets/workspace/JsonViewUI'
import { OutputPreviewWrapperUI } from './OutputPreviewWrapperUI'

export const OutputRuntimeErrorPreviewUI = observer(function OutputRuntimeErrorPreviewUI_(p: {
    step?: Maybe<StepL>
    output: RuntimeErrorL
}) {
    const msg = p.output
    return (
        <OutputPreviewWrapperUI output={p.output}>
            <div tw='text-error-content bg-error font-bold'>Runtime Error</div>
        </OutputPreviewWrapperUI>
    )
})

export const OutputRuntimeErrorUI = observer(function OutputRuntimeErrorUI_(p: { step?: Maybe<StepL>; output: RuntimeErrorL }) {
    const output = p.output
    const msg = output.data
    return (
        <Surface tw='w-full h-full'>
            <div className='bg-error text-error-content'>
                <div tw='text-xl font-bold'>Runtime Error</div>
                <div tw='italic'>{msg.message}</div>
            </div>
            <div>
                <div tw='font-bold'>error infos:</div>
                <JsonViewUI value={JSON.parse(JSON.stringify(msg.infos))} />
            </div>
        </Surface>
    )
})
