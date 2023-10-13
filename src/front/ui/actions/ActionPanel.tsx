import { observer } from 'mobx-react-lite'
import { Loader, Message } from 'rsuite'
import { useProject } from '../../ProjectCtx'
import { JSONHighlightedCodeUI } from '../utils/TypescriptHighlightedCodeUI'
import { ComfyUIUI } from '../workspace/ComfyUIUI'
import { ActionTabListUI } from './ActionTabListUI'
import { ActionUI } from './ActionUI'
import { ResultWrapperUI } from '../utils/ResultWrapperUI'

export const PafUI = observer(function PafUI_(p: {}) {
    const pj = useProject()
    const paf = pj.activeFile
    // const uiSt = useLocalObservable(() => ({ activeTab: '2' }))
    if (paf == null) return null
    const tool = paf.tool
    return (
        <div className='flex flex-grow'>
            <div>{paf.loaded.done ? null : <Loader />}</div>
            <ActionTabListUI />
            {paf.focus === 'action' && <ResultWrapperUI res={paf.asAction} whenValid={(tac) => <ActionUI tac={tac} />} />}
            {paf.focus === 'autoaction' && <ResultWrapperUI res={paf.asAutoAction} whenValid={(tac) => <ActionUI tac={tac} />} />}
            {paf.focus === 'png' && <ResultWrapperUI res={paf.png} whenValid={(png) => <img src={`file://${png}`} alt='' />} />}
            {paf.focus === 'workflow' && (
                <ResultWrapperUI
                    res={paf.liteGraphJSON}
                    whenValid={(png) => <ComfyUIUI action={{ type: 'comfy', json: png }} />}
                />
            )}
            {paf.focus === 'prompt' && (
                <ResultWrapperUI res={paf.liteGraphJSON} whenValid={(x) => <JSONHighlightedCodeUI code={JSON.stringify(x)} />} />
            )}
        </div>
    )
})
