import { observer } from 'mobx-react-lite'
import { Checkbox, Nav, Toggle } from 'rsuite'
import { useProject } from '../../ProjectCtx'
import { ActionDraftListUI } from './ActionDraftListUI'
import { assets } from '../assets'

export const ActionTabListUI = observer(function ActionTabListUI_(p: {}) {
    const pj = useProject()
    const paf = pj.activeFile
    if (paf == null) return null
    const autoTool = paf.asAutoAction?.value?.tools.value?.[0]
    const tool = paf.asAction?.value?.tools.value?.[0]

    const clx = 'px-4 hover:bg-blue-700 cursor-pointer'
    return (
        <div tw='flex flex-shrink-0'>
            {/* {paf.absPath.endsWith('.ts') && (
                <div>
                    source: <img tw='mr-1' style={{ width: '1rem' }} src={assets.tsLogo} alt='' />
                </div>
            )} */}
            {paf.png != null && (
                <div tw={[clx, paf.focus === 'png' ? 'bg-gray-600' : null]} onClick={() => (paf.focus = 'png')}>
                    Png
                </div>
            )}
            {paf.liteGraphJSON != null && (
                <div tw={[clx, paf.focus === 'workflow' ? 'bg-gray-600' : null]} onClick={() => (paf.focus = 'workflow')}>
                    Workflow
                </div>
            )}
            {paf.promptJSON != null && (
                <div tw={[clx, paf.focus === 'prompt' ? 'bg-gray-600' : null]} onClick={() => (paf.focus = 'prompt')}>
                    Prompt
                </div>
            )}
            {paf.asAction != null && (
                <div
                    tw={['px-4 hover:bg-blue-700 row', paf.focus === 'action' ? 'bg-gray-600' : null]}
                    onClick={() => (paf.focus = 'action')}
                >
                    <span className='material-symbols-outlined'>dynamic_form</span>
                    Action
                </div>
            )}

            {tool && <ActionDraftListUI tool={tool} />}
            {paf.asAutoAction != null && (
                <div tw={[clx, paf.focus === 'autoaction' ? 'bg-gray-600' : null]} onClick={() => (paf.focus = 'autoaction')}>
                    AutoAction
                </div>
            )}

            {autoTool && <ActionDraftListUI tool={autoTool} />}
            <div tw='flex items-center'>
                <Toggle size='sm' checked={paf.autoReload} onChange={(n) => paf.setAutoReload(n)} />
                <div>hot-reload</div>
            </div>
        </div>
    )
})
