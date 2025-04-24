import type { StepL } from '../../models/Step'
import type { CSSProperties } from 'react'

import { Status } from '../../back/Status'
import { StatusUI } from '../../back/statusUI'
import { AppIllustrationUI } from '../../cards/fancycard/AppIllustrationUI'
import { DraftIllustrationUI } from '../../cards/fancycard/DraftIllustration'
import { Button } from '../../csuite/button/Button'
import { SpacerUI } from '../../csuite/components/SpacerUI'
import { _formatPreviewDate } from '../../csuite/formatters/_formatPreviewDate'
import { Frame } from '../../csuite/frame/Frame'
import { OutputPreviewUI } from '../../outputs/OutputUI'
import { PanelStepsConf } from './PanelStepsConf'

export const StepCardUI = obs(function StepOutputsV1HeaderUI_(p: {
   // Data ---------------------
   step: StepL

   // Style --------------------
   className?: string
   style?: CSSProperties

   // Slots --------------------
   showTitle?: boolean /**         default: true */
   showApp?: boolean /**           default: true */
   showDraft?: boolean /**         default: true */
   showStatus?: boolean /**        default: true */
   showOutputs?: boolean /**       default: true */
   showExecutionTime?: boolean /** default: true */
   showDate?: boolean /**          default: true */

   // Sizes --------------------
   appSize?: number
   outputSize?: number

   contrast?: number
}) {
   const conf = PanelStepsConf
   const step = p.step
   const isSelected = cushy.focusedStepL === step
   const appSize = conf.zValue.appSize ? `${conf.zValue.appSize}rem` : '2rem'
   // const outputSize = conf.value.outputSize ? `${conf.value.outputSize}rem` : '2rem'

   const showTitle = p.showTitle ?? conf.zValue.show.title
   const showApp = p.showApp ?? conf.zValue.show.app
   const showDraft = p.showDraft ?? conf.zValue.show.draft
   const showStatus = p.showStatus ?? conf.zValue.show.status
   const showOutputs = p.showOutputs ?? conf.zValue.show.outputs
   const showExecutionTime = p.showExecutionTime ?? conf.zValue.show.executionTime
   const showDate = p.showDate ?? conf.zValue.show.date
   const showInfoBar = showTitle || showDate || showStatus

   const STYLE = { height: appSize, width: appSize }
   const STYLE2 = { height: appSize }
   return (
      <Frame
         base={p.contrast}
         tw={['relative flex cursor-pointer flex-col flex-wrap py-0.5', p.className]}
         // onClick={() => cushy.layout.open('Output', { stepID: step.id })}
         style={p.style}
      >
         {showInfoBar && (
            <uy.layout.Row base={{ contrast: -0.1 }} tw='h-input items-center'>
               {showTitle && (
                  <uy.misc.Frame tw='!line-clamp-1 flex items-center justify-center px-1' tooltip={step.name}>
                     {step.name}
                  </uy.misc.Frame>
               )}
               <SpacerUI />
               {showDate && (
                  <div tw='flex flex-shrink-0 items-center justify-center px-1 opacity-80'>
                     {_formatPreviewDate(new Date(step.createdAt))}
                  </div>
               )}
               {showStatus && (
                  <uy.misc.Frame square size='input' tw='flex items-center justify-center'>
                     <StatusUI step={p.step} />
                  </uy.misc.Frame>
               )}
            </uy.layout.Row>
         )}
         {showApp && (
            <div
               tw={['cursor-pointer', isSelected ? 'border-primary border-2' : '']}
               style={{ width: appSize, height: appSize, flexShrink: 0 }}
            >
               {step.app != null ? (
                  <AppIllustrationUI tw='hover:opacity-100' size={appSize} app={step.app} />
               ) : (
                  <div>❓</div>
               )}
            </div>
         )}
         {/* 4. DRAFT --------------------------------------------------------------- */}
         {showDraft &&
            (step.draft ? <DraftIllustrationUI draft={step.draft} size={appSize} /> : <div>❓</div>)}
         {/* 6. OUTPUTS --------------------------------------------------------------- */}
         {Boolean(showOutputs) && (
            <div tw='flex px-2'>
               {step?.outputs?.map((output, ix) => (
                  <OutputPreviewUI //
                     key={ix}
                     step={step}
                     size={appSize}
                     output={output}
                  />
               ))}
            </div>
         )}
         <SpacerUI />
         {step?.finalStatus === Status.Running && (
            <Button //
               icon={IKONS.mdiStop}
               look='error'
               onClick={() => {
                  step.abort()
                  return cushy.stopCurrentPrompt()
               }}
            />
         )}
         {showDate && (
            <div style={STYLE2} tw='flex items-center justify-center opacity-80'>
               {_formatPreviewDate(new Date(step.createdAt))}
            </div>
         )}
         {showStatus && (
            <div style={STYLE} tw='flex items-center justify-center'>
               <StatusUI step={p.step} />
            </div>
         )}
      </Frame>
   )
})
