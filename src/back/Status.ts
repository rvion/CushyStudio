import { exhaust } from '../utils/ComfyUtils'

export enum Status {
    New = 'New',
    Scheduled = 'Scheduled',
    Running = 'Running',
    Success = 'Success',
    Failure = 'Failure',
}

export const renderStatus = (status: Status) => {
    if (status === Status.New) return '🆕'
    if (status === Status.Scheduled) return '🕒'
    if (status === Status.Running) return '🏃'
    if (status === Status.Success) return '✅'
    if (status === Status.Failure) return '❌'
    exhaust(status)
    return '🤷'
}
