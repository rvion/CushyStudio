import { ReactNode } from 'react'
import { exhaust } from '../utils/misc/ComfyUtils'
import { Loader } from 'rsuite'

export enum Status {
    New = 'New',
    Scheduled = 'Scheduled',
    Running = 'Running',
    Success = 'Success',
    Failure = 'Failure',
}

export const renderStatus = (status: Status): ReactNode => {
    if (status === Status.New) return '🆕'
    if (status === Status.Scheduled) return '🕒'
    if (status === Status.Running) return <Loader /> //'🏃'
    if (status === Status.Success) return '✅'
    if (status === Status.Failure) return '❌'
    exhaust(status)
    return '🤷'
}
