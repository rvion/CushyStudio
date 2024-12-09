import type { ComfyPromptL } from '../models/ComfyPrompt'
import type { ProgressReport } from '../models/ComfyWorkflow'
import type { StepL } from '../models/Step'

import { observer } from 'mobx-react-lite'

import { Button } from '../csuite/button/Button'
import { Frame } from '../csuite/frame/Frame'
import { parseFloatNoRoundingErr } from '../csuite/utils/parseFloatNoRoundingErr'
import { GraphSummaryUI } from '../widgets/workspace/GraphSummaryUI'

// TODO: Make the color of the "done" bar success or warn if failed!!

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
   const pgr2 = graph.progressCurrentNode

   const percent = parseFloatNoRoundingErr(pgr1.percent)
   return (
      <div tw='flex h-full w-full items-center justify-center p-0.5 text-center'>
         <div
            tw='absolute top-[5%] z-10'
            //
         >
            {parseFloatNoRoundingErr(pgr1.percent, 0)}%
         </div>
         <Frame
            tw='absolute z-0 h-full w-full'
            base={{ contrast: 0.1 }}
            style={{
               transform: `
                  translateX(${(percent - 100) / 2}%)
                 scaleX(${percent}%)`,
            }}
         ></Frame>
         {pgr2 && pgr2.percent != 0 && (
            <Frame
               tw='absolute bottom-0 z-[5] h-[5%] w-full'
               base={{ contrast: 0.3, chromaBlend: 100 }}
               style={{
                  transform: `
                  translateX(${(parseFloatNoRoundingErr(pgr2.percent) - 100) / 2}%)
                 scaleX(${parseFloatNoRoundingErr(pgr2.percent)}%)`,
               }}
            />
         )}
         (
         <Frame text={{ contrast: 0.5 }} tw='absolute bottom-[5%] z-10 !bg-transparent'>
            {pgr1.isDone
               ? 'Done'
               : `${Math.floor(graph.progressGlobal.countDone)}/${graph.progressGlobal.countTotal}`}
         </Frame>
         )
         {
            // TODO(bird_d/ui): Make fail case, so the bar is red on fail
            pgr1.isDone && (
               <Frame
                  base={{ contrast: 0.3, chromaBlend: 100, hue: 130 }}
                  tw='absolute bottom-0 z-[5] h-[5%] w-full'
               />
            )
         }
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
