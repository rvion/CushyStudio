import { observer } from 'mobx-react-lite'
import { useSt } from 'src/state/stateContext'
import { usePromise } from 'src/utils/misc/usePromise'
import { Button_InstallCustomNodeUI } from './Button_InstallCustomNodeUI'
import { PluginInstallStatus } from './PluginInstallStatus'
import { QuickHostActionsUI } from './QuickHostActionsUI'
import { PluginSuggestion } from './convertToPluginInfoList'

export const InstallableCustomNodeListUI = observer(function InstallableCustomNodeListUI_(p: {
    suggestions: PluginSuggestion[]
}) {
    const suggestions: PluginSuggestion[] = p.suggestions
    if (suggestions.length === 0) return <pre>🔴 invariant failed{JSON.stringify(p)}</pre>

    const st = useSt()
    const foo = st.mainHost.manager.knownNodeList //  usePromise(() => st.mainHost.manager.getNodeList(), [])
    return (
        <div tw='flex flex-col flex-wrap gap-1 p-2'>
            <QuickHostActionsUI />
            {suggestions.map(({ plugin, reason }, ix) => {
                const entry = foo?.custom_nodes.find((x) => x.title === plugin.title)
                const status = ((): PluginInstallStatus => {
                    if (!entry) return 'unknown'
                    if (entry?.installed === 'False') return 'not-installed'
                    if (entry?.installed === 'True') return 'installed'
                    if (entry?.installed === 'Update') return 'update-available'
                    return 'error'
                })()
                return (
                    <Button_InstallCustomNodeUI
                        //
                        // status={status}
                        key={ix}
                        plugin={plugin}
                        reason={reason}
                    />
                )
            })}
        </div>
    )
})

// ⏸️ import { CustomNodeRecommandation } from '../IWidget'
// ⏸️ export const InstallCustomNodeBtnUI = observer(function InstallCustomNodeBtnUI_(p: { recomandation: CustomNodeRecommandation }) {
// ⏸️     if (
// ⏸️         p.recomandation.customNodesByTitle == null &&
// ⏸️         p.recomandation.customNodesByURI == null &&
// ⏸️         p.recomandation.customNodesByNameInCushy == null
// ⏸️     )
// ⏸️         return null
// ⏸️
// ⏸️     const suggestions: PluginSuggestion[] = convertToPluginInfoList(p)
// ⏸️     if (suggestions.length === 0) return <pre>🔴{JSON.stringify(p)}</pre>
// ⏸️     return (
// ⏸️         <RevealUI>
// ⏸️             <div tw='btn btn-square btn-xs btn-ghost opacity-50'>
// ⏸️                 <span className='material-symbols-outlined'>scatter_plot</span>
// ⏸️             </div>
// ⏸️             <InstallableCustomNodeListUI suggestions={suggestions} />
// ⏸️         </RevealUI>
// ⏸️     )
// ⏸️ })
