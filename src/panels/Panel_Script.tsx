import { observer } from 'mobx-react-lite'

import { TabUI } from '../app/layout/TabUI'
import { replaceImportsWithSyncImport } from '../compiler/transpiler'
import { useSt } from '../state/stateContext'
import { _formatAsRelativeDateTime } from '../updater/_getRelativeTimeString'
import { ErrorScreenUI } from '../widgets/misc/ErrorScreenUI'
import { TypescriptHighlightedCodeUI } from '../widgets/misc/TypescriptHighlightedCodeUI'

export const Panel_Script = observer(function Panel_Script_(p: { scriptID: CushyScriptID }) {
    const st = useSt()
    const script = st.db.cushy_script.get(p.scriptID)

    if (script == null) {
        return (
            <ErrorScreenUI
                err={{
                    title: 'Script not found',
                    help: 'maybe the database was reset?',
                }}
            ></ErrorScreenUI>
        )
    }
    return (
        <div>
            <div>id: {script.id}</div>
            <div>created at: {_formatAsRelativeDateTime(script.createdAt)}</div>
            <div>updated at: {_formatAsRelativeDateTime(script.updatedAt)}</div>
            <div>extracted from: {script.relPath}</div>
            <TabUI>
                <div>text (before import rewrite)</div>
                <pre tw='text-xs font-mono'>{script.data.code}</pre>
                <div>text (after import rewrite)</div>
                <pre tw='text-xs font-mono'>{replaceImportsWithSyncImport(script.data.code)}</pre>
                <div>code</div>
                <TypescriptHighlightedCodeUI code={script.data.code}></TypescriptHighlightedCodeUI>
            </TabUI>
        </div>
    )
})
