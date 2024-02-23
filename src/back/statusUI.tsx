import { ReactNode } from 'react'

import { exhaust } from '../utils/misc/ComfyUtils'
import { Status } from './Status'
import { Loader } from 'src/rsuite/shims'

export const statusUI = (status: Status): ReactNode => {
    if (status === Status.New) return '🆕'
    if (status === Status.Scheduled) return '🕒'
    if (status === Status.Running) return <Loader /> //'🏃'
    if (status === Status.Success) return '✅'
    if (status === Status.Failure) return '❌'
    exhaust(status)
    return '🤷'
}
