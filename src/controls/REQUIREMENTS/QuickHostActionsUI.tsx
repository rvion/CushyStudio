import { observer } from 'mobx-react-lite'

import { HostL } from 'src/models/Host'
import { useSt } from 'src/state/stateContext'

export const QuickHostActionsUI = observer(function QuickHostActionsUI_(p: { host?: HostL }) {
    const st = useSt()
    const host = p.host ?? st.mainHost
    return (
        <div tw='flex gap-1'>
            <div tw='btn btn-sm btn-primary flex-1' onClick={() => host.fetchAndUpdateSchema()}>
                Reload Schema
            </div>
            <div tw='btn btn-sm btn-warning flex-1' onClick={() => host.manager.rebootComfyUI()}>
                Restart ComfyUI
            </div>
        </div>
    )
})
