import type { CushyAppL } from '../../models/CushyApp'

import { observer } from 'mobx-react-lite'

import { _formatAsRelativeDateTime } from '../../updater/_getRelativeTimeString'
import { MessageWarningUI } from '../MessageUI'

export const RecompileUI = observer(function RecompileUI_(p: {
    //
    app: CushyAppL
    always?: boolean
}) {
    const app = p.app
    const script = app.script
    const status = script.isOutOfDate
    if (!p.always && !status.needRecompile) return null
    return (
        <MessageWarningUI>
            need recompile: {status.reason}
            <div onClick={() => app.file.extractScriptFromFileAndUpdateApps({ force: true })} tw='btn-sm btn btn-warning'>
                Recompile
            </div>
        </MessageWarningUI>
    )
})
