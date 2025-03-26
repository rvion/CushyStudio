import { TabUI } from '../csuite/tabs/TabUI'
import { Panel, type PanelHeader } from '../router/Panel'
import { _formatAsRelativeDateTime } from '../updater/_getRelativeTimeString'
import { ErrorScreenUI } from '../widgets/misc/ErrorScreenUI'
import { TypescriptHighlightedCodeUI } from '../widgets/misc/TypescriptHighlightedCodeUI'

export const PanelScript = new Panel({
   name: 'Script',
   category: 'developper',
   widget: (): React.FC<PanelScriptProps> => PanelScriptUI,
   header: (p: PanelScriptProps): PanelHeader => ({ title: 'Script' }),
   def: (): PanelScriptProps => ({ scriptID: '' /* 🔴 */ }),
   icon: IKONS.mdiLanguageTypescript,
})

export type PanelScriptProps = {
   scriptID: CushyScriptID
}

export const PanelScriptUI = obs(function PanelScriptUI_(p: PanelScriptProps) {
   const script = cushy.db.cushy_script.get(p.scriptID)

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
            <pre tw='font-mono text-xs'>{script.data.code}</pre>
            <div>text (after import rewrite)</div>
            <pre tw='font-mono text-xs'>{script.data.code}</pre>
            <div>code</div>
            <TypescriptHighlightedCodeUI code={script.data.code}></TypescriptHighlightedCodeUI>
         </TabUI>
      </div>
   )
})
