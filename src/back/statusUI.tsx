import type { StepL } from '../models/Step'
import type { ReactNode } from 'react'

import { IkonOf } from '../csuite/icons/iconHelpers'
import { Loader } from '../csuite/inputs/Loader'
import { exhaust } from '../csuite/utils/exhaust'
import { Status } from './Status'

export const statusUI = (step: StepL): ReactNode => {
   const status = step.finalStatus
   if (status === Status.New) return <IkonOf name='mdiNewBox' />
   if (status === Status.Scheduled) return <IkonOf name='mdiClockOutline' />
   if (status === Status.Running)
      return (
         <UY.Misc.Button //
            borderless
            hover
            square
            dropShadow={undefined}
            roundness={0}
            loading
            look='warning'
            icon='mdiCloseBox'
            onClick={() => {
               step.abort()
               cushy.stopCurrentPrompt()
            }}
         />
      )

   if (status === Status.Success) return <IkonOf name='mdiCheckBold' />
   if (status === Status.Failure) return <IkonOf name='mdiAlert' />
   exhaust(status)
   return '🤷'
}
