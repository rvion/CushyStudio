import type { Activity } from '../../../csuite/activity/Activity'
import type { UnifiedCanvas } from '../states/UnifiedCanvas'
import type { UIEvent } from 'react'

export class UCAGenerate implements Activity {
    uid = 'generate'
    title = 'Generate'

    constructor(public ctx: UnifiedCanvas) {}

    UI = () => {
        return <div>Not implemented</div>
    }
    onStart = () => {
        console.log('generate activity started')
    }
    onStop = () => {
        console.log('generate activity stopped')
    }

    onEvent = (event: UIEvent) => {
        console.log('generate event', event.type)
        return null
    }
}
