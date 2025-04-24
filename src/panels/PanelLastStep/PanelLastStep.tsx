import type { NO_PROPS } from '../../csuite/types/NO_PROPS'

import { Panel, type PanelHeader } from '../../router/Panel'

export const PanelLastStep = new Panel({
   name: 'LastStep',
   widget: (): React.FC<NO_PROPS> => PanelLastStepUI,
   header: (p: NO_PROPS): PanelHeader => ({ title: 'LastStep' }),
   def: (): NO_PROPS => ({}),
   icon: IKONS.mdiStepForward,
   category: 'outputs',
})

export const PanelLastStepUI = obs(function PanelLastStepUI_(p: NO_PROPS) {
   const lastStep = cushy.db.step.last()
   if (lastStep == null) return null
   return (
      <div className='flex flex-col'>
         {/* <StepHeaderUI step={lastStep} /> */}
         {/* <StepOutputsBodyV1UI step={lastStep} /> */}
      </div>
   )
})
