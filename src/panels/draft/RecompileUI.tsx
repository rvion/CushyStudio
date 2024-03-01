import type { CushyAppL } from 'src/models/CushyApp'

import { observer } from 'mobx-react-lite'

import { MessageWarningUI } from '../MessageUI'
import { _formatAsRelativeDateTime } from 'src/updater/_getRelativeTimeString'

export const RecompileUI = observer(function RecompileUI_(p: { app: CushyAppL }) {
    const app = p.app
    const script = app.script
    // const deps = script.data.metafile?.inputs
    const status = script.isOutOfDate
    if (!status.needRecompile) return null
    return (
        <MessageWarningUI>
            need recompile: {status.reason}
            <div onClick={() => app.file.extractScriptFromFileAndUpdateApps({ force: true })} tw='btn-sm btn btn-warning'>
                Recompile
            </div>
            {/* {status.needRecompile} */}
            {/* <div>script.updatedAt = {_formatAsRelativeDateTime(script.updatedAt)}</div> */}
            {/* {script.data.metafile?.inputs} */}
            {/* <JsonViewUI value={deps} /> */}
            {/* recompile? */}
        </MessageWarningUI>
    )
})
