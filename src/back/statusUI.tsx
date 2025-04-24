import type { StepL } from '../models/Step'
import type { ReactNode } from 'react'

import { Ikon } from '../csuite/icons/iconHelpers'
import { exhaust } from '../csuite/utils/exhaust'
import { Status } from './Status'

export const StatusUI = obs(({ step }: { step: StepL }): ReactNode => {
   const status = step.finalStatus
   if (status === Status.New) return <Ikon.mdiNewBox />
   if (status === Status.Scheduled) return <Ikon.mdiClockOutline />
   if (status === Status.Running)
      return (
         <uy.misc.Button //
            borderless
            hover
            square
            dropShadow={undefined}
            roundness={0}
            loading
            look='warning'
            icon={IKONS.mdiCloseBox}
            onClick={() => {
               step.abort()
               return cushy.stopCurrentPrompt()
            }}
         />
      )

   if (status === Status.Success) return <Ikon.mdiCheckBold />
   if (status === Status.Failure) return <Ikon.mdiAlert />
   exhaust(status)
   return '🤷'
})
