import { observer } from 'mobx-react-lite'
import { useSt } from 'src/state/stateContext'
import { HostL } from 'src/models/Host'

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
