import { ReactNode } from 'react'

import { Loader } from '../csuite/inputs/shims'
import { exhaust } from '../csuite/utils/exhaust'
import { Status } from './Status'

export const statusUI = (status: Status): ReactNode => {
    if (status === Status.New) return '🆕'
    if (status === Status.Scheduled) return '🕒'
    if (status === Status.Running) return <Loader /> //'🏃'
    if (status === Status.Success) return '✅'
    if (status === Status.Failure) return '❌'
    exhaust(status)
    return '🤷'
}
