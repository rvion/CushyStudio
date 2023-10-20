import { observer } from 'mobx-react-lite'
import { Loader } from 'rsuite'
import { useProject } from '../../ProjectCtx'
import { ResultWrapperUI } from '../utils/ResultWrapperUI'
import { JSONHighlightedCodeUI } from '../utils/TypescriptHighlightedCodeUI'
import { ComfyUIUI } from '../workspace/ComfyUIUI'
import { ActionTabListUI } from './ActionTabListUI'
import { DraftUI } from './ActionUI'

export const PafUI = observer(function PafUI_(p: {}) {
    const pj = useProject()
    return null
    // const paf = pj.activeFile
    // if (paf == null) return null
    // return (
    //     <>
    //         <ActionTabListUI />
    //         <div className='flex flex-grow h-full'>
    //             <div>{paf.loaded.done ? null : <Loader />}</div>
    //             {paf.focus === 'action' && (
    //                 <ResultWrapperUI res={paf.asAction} whenValid={(tac) => <ActionUI af={paf} tac={tac} />} />
    //             )}
    //             {paf.focus === 'autoaction' && (
    //                 <ResultWrapperUI res={paf.asAutoAction} whenValid={(tac) => <ActionUI af={paf} tac={tac} />} />
    //             )}
    //             {paf.focus === 'png' && (
    //                 <ResultWrapperUI res={paf.png} whenValid={(png) => <img src={`file://${png}`} alt='' />} />
    //             )}
    //             {paf.focus === 'workflow' && (
    //                 <ResultWrapperUI res={paf.liteGraphJSON} whenValid={(png) => <ComfyUIUI litegraphJson={png} />} />
    //             )}
    //             {paf.focus === 'prompt' && (
    //                 <ResultWrapperUI
    //                     res={paf.liteGraphJSON}
    //                     whenValid={(x) => <JSONHighlightedCodeUI code={JSON.stringify(x)} />}
    //                 />
    //             )}
    //         </div>
    //     </>
    // )
})
