import type { ComfyPromptL } from '../models/ComfyPrompt'
import type { ProgressReport } from '../models/ComfyWorkflow'
import type { StepL } from '../models/Step'

import { observer } from 'mobx-react-lite'

import { Button } from '../csuite/button/Button'
import { Frame } from '../csuite/frame/Frame'
import { parseFloatNoRoundingErr } from '../csuite/utils/parseFloatNoRoundingErr'
import { useSt } from '../state/stateContext'
import { GraphSummaryUI } from '../widgets/workspace/GraphSummaryUI'

export const OutputPromptPreviewUI = observer(function OutputPromptPreviewUI_(p: {
   //
   step?: Maybe<StepL>
   output: ComfyPromptL
}) {
   const st = useSt()
   const prompt = p.output
   const graph = prompt.graph
   const size = st.historySizeStr
   if (graph == null) return <div>❌ ERROR</div>

   const pgr1: ProgressReport = prompt.progressGlobal

   const percent = parseFloatNoRoundingErr(pgr1.percent)
   return (
      <div tw='flex h-full w-full items-center justify-center p-0.5 text-center'>
         <Frame
            tw='absolute z-0 h-full w-full'
            base={{ contrast: 0.1 }}
            style={{
               // @ts-ignore
               transform: `
                  translateX(${(percent - 100) / 2}%)
                 scaleX(${percent}%)`,
            }}
         ></Frame>
         <div
            tw='z-10'
            //
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
   const st = useSt()
   const graph = prompt.graph
   if (graph == null) return <>no graph</>
   return (
      <div className='flex flex-col gap-1'>
         <Button onClick={() => st.stopCurrentPrompt()}>STOP GENERATING</Button>
         <GraphSummaryUI graph={graph} />
      </div>
   )
})
