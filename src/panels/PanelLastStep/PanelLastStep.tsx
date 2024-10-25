import type { NO_PROPS } from '../../csuite/types/NO_PROPS'

import { observer } from 'mobx-react-lite'

import { Panel, type PanelHeader } from '../../router/Panel'
import { useSt } from '../../state/stateContext'

export const PanelLastStep = new Panel({
   name: 'LastStep',
   widget: (): React.FC<NO_PROPS> => PanelLastStepUI,
   header: (p: NO_PROPS): PanelHeader => ({ title: 'LastStep' }),
   def: (): NO_PROPS => ({}),
   icon: 'mdiStepForward',
   category: 'outputs',
})

export const PanelLastStepUI = observer(function PanelLastStepUI_(p: NO_PROPS) {
   const st = useSt()
   const lastStep = st.db.step.last()
   if (lastStep == null) return null
   return (
      <div className='flex flex-col'>
         {/* <StepHeaderUI step={lastStep} /> */}
         {/* <StepOutputsBodyV1UI step={lastStep} /> */}
      </div>
   )
})
