import type { NO_PROPS } from '../../csuite/types/NO_PROPS'

import { observer } from 'mobx-react-lite'

import { SpacerUI } from '../../csuite/components/SpacerUI'
import { FormAsDropdownConfigUI } from '../../csuite/form/FormAsDropdownConfigUI'
import { PanelUI } from '../../csuite/panel/PanelUI'
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
   return (
      <PanelUI>
         <PanelUI.Header>
            <SpacerUI />
            <FormAsDropdownConfigUI form={PanelStepsConf} title='Panel Options' />
         </PanelUI.Header>
         <PanelUI.Content>
            <StepListUI />
         </PanelUI.Content>
      </PanelUI>
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
