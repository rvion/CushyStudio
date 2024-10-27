import type { NO_PROPS } from '../../csuite/types/NO_PROPS'

import { observer } from 'mobx-react-lite'

import { FormAsDropdownConfigUI } from '../../csuite/form/FormAsDropdownConfigUI'
import { PanelHeaderUI } from '../../csuite/panel/PanelHeaderUI'
import { clamp } from '../../csuite/utils/clamp'
import { Panel, type PanelHeader } from '../../router/Panel'
import { PanelStepsConf } from './Panel_StepsConf'
import { StepCardUI } from './StepCardUI'

export const PanelSteps = new Panel({
   name: 'Steps',
   widget: (): React.FC<NO_PROPS> => PanelStepsUI,
   header: (p): PanelHeader => ({ title: 'Steps' }),
   def: (): NO_PROPS => ({}),
   category: 'outputs',
   about: 'this panels allow to list / search steps matching conditions',
   icon: 'mdiStepForward',
})

export const PanelStepsUI = observer(function PanelStepsUI_(p: NO_PROPS) {
   console.log(`[❓🔴] rendering > PanelStepsUI`)
   return (
      <div className='flex h-full flex-col'>
         <PanelHeaderUI tw='sticky top-0' icon='mdiStepForward'>
            <FormAsDropdownConfigUI form={PanelStepsConf} title='Step Options' />
         </PanelHeaderUI>
         <StepListUI />
      </div>
   )
})

const StepListUI = observer(function StepLists(p: {}) {
   const amount = clamp(Math.round(PanelStepsConf.value.maxItem), 1, 1000)
   const steps = cushy.db.step.getLastN(amount)
   return (
      <div className='flex grow select-none flex-col gap-0.5' style={{ overflow: 'auto' }}>
         {/* {PanelStepsConf.render()} */}
         {steps.map((step, ix: number) => (
            <StepCardUI //
               contrast={ix % 2 === 0 ? 8 : undefined}
               key={step.id}
               step={step}
            />
         ))}
      </div>
   )
})
