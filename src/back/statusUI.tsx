import type { ReactNode } from 'react'

import { IkonOf } from '../csuite/icons/iconHelpers'
import { Loader } from '../csuite/inputs/shims'
import { exhaust } from '../csuite/utils/exhaust'
import { Status } from './Status'

export const statusUI = (status: Status): ReactNode => {
   if (status === Status.New) return <IkonOf name='mdiNewBox' />
   if (status === Status.Scheduled) return <IkonOf name='mdiClockOutline' />
   if (status === Status.Running) return <Loader /> //'🏃'
   if (status === Status.Success) return <IkonOf name='_check' />
   if (status === Status.Failure) return <IkonOf name='_close' />
   exhaust(status)
   return '🤷'
}
