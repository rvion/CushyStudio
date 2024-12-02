import type { ComfyPromptL } from '../models/ComfyPrompt'
import type { ProgressReport } from '../models/ComfyWorkflow'
import type { StepL } from '../models/Step'

import { observer } from 'mobx-react-lite'

import { Button } from '../csuite/button/Button'
import { parseFloatNoRoundingErr } from '../csuite/utils/parseFloatNoRoundingErr'
import { GraphSummaryUI } from '../widgets/workspace/GraphSummaryUI'

export const OutputPromptPreviewUI = observer(function OutputPromptPreviewUI_(p: {
   //
   step?: Maybe<StepL>
   output: ComfyPromptL
}) {
   const prompt = p.output
   const graph = prompt.graph
   const size = cushy.historySizeStr
   if (graph == null) return <div>❌ ERROR</div>

   const pgr1: ProgressReport = prompt.progressGlobal
   return (
      <div tw='text-shadow flex h-full w-full items-center justify-center p-0 text-sm'>
         <div
            className='radial-progress'
            style={{
               // @ts-ignore
               '--value': pgr1.percent,
               '--size': `${parseInt(size) * 0.9}px`,
            }}
            role='progressbar'
         >
            {parseFloatNoRoundingErr(pgr1.percent, 0)}%
         </div>
      </div>
   )
})

export const OutputPromptUI = observer(function OutputPromptUI_(p: {
   //
   step?: Maybe<StepL>
   output: ComfyPromptL
}) {
   const prompt = p.output
   const graph = prompt.graph
   if (graph == null) return <>no graph</>
   return (
      <div className='flex flex-col gap-1'>
         <Button onClick={() => cushy.stopCurrentPrompt()}>STOP GENERATING</Button>
         <GraphSummaryUI graph={graph} />
      </div>
   )
})
