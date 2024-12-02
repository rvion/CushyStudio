import type { Requirements } from './Requirements'

import { observer } from 'mobx-react-lite'

import { Button } from '../../csuite/button/Button'
import { RevealUI } from '../../csuite/reveal/RevealUI'
import { Panel_InstallRequirementsUI } from './Panel_InstallRequirementsUI'

export const InstallRequirementsBtnUI = observer(function InstallRequirementsBtnUI_(p: {
   active: boolean
   label?: string
   requirements: Requirements[]
}) {
   if (p.requirements.length == 0) return null
   const rr = p.requirements
   const actionRequired = p.active && !cushy.mainHost.matchRequirements(rr)
   return (
      <RevealUI
         content={() => (
            <div tw='[max-width:500px]'>
               <Panel_InstallRequirementsUI requirements={rr} />
            </div>
         )}
      >
         <Button //
            icon='mdiPuzzleOutline'
            size='widget'
            square={!p.label}
            subtle={!actionRequired}
            look={actionRequired ? 'error' : undefined}
         >
            {p.label}
         </Button>
      </RevealUI>
   )
})
