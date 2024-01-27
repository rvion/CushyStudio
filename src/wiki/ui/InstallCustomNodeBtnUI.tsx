import { observer } from 'mobx-react-lite'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'
import { useSt } from 'src/state/stateContext'
import { usePromise } from 'src/utils/misc/usePromise'
import { CustomNodeRecommandation } from '../../controls/IWidget'
import { InstallPluginCardUI, PluginInstallStatus } from './InstallPluginCardUI'
import { QuickHostActionsUI } from './QuickHostActionsUI'
import { PluginSuggestion, convertToPluginInfoList } from './convertToPluginInfoList'

export const InstallCustomNodeBtnUI = observer(function InstallCustomNodeBtnUI_(p: { recomandation: CustomNodeRecommandation }) {
    const suggestions: PluginSuggestion[] = convertToPluginInfoList(p)
    if (suggestions.length === 0) return <pre>🔴{JSON.stringify(p)}</pre>
    return (
        <RevealUI>
            <div tw='btn btn-square btn-sm btn-ghost opacity-50'>
                <span className='material-symbols-outlined'>scatter_plot</span>
            </div>
            <InstallableCustomNodeListUI suggestions={suggestions} />
        </RevealUI>
    )
})

export const InstallableCustomNodeListUI = observer(function InstallableCustomNodeListUI_(p: {
    suggestions: PluginSuggestion[]
}) {
    const suggestions: PluginSuggestion[] = p.suggestions
    if (suggestions.length === 0) return <pre>🔴 invariant failed{JSON.stringify(p)}</pre>

    const st = useSt()
    const foo = usePromise(() => st.mainHost.getComfyUIManager()?.getNodeList(), [])
    return (
        <div tw='flex flex-col flex-wrap gap-1 p-2'>
            <QuickHostActionsUI />
            {suggestions.map(({ plugin, reason }, ix) => {
                const entry = foo?.value?.custom_nodes.find((x) => x.title === plugin.title)
                const status = ((): PluginInstallStatus => {
                    if (!entry) return 'unknown'
                    if (entry?.installed === 'False') return 'not-installed'
                    if (entry?.installed === 'True') return 'installed'
                    if (entry?.installed === 'Update') return 'update-available'
                    return 'error'
                })()
                return (
                    <InstallPluginCardUI
                        //
                        status={status}
                        key={ix}
                        plugin={plugin}
                        reason={reason}
                    />
                )
            })}
        </div>
    )
})
