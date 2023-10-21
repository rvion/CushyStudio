import type { ActionPath } from 'src/back/ActionPath'
import { observer } from 'mobx-react-lite'
import { useProject } from '../../ProjectCtx'
import { useSt } from 'src/front/FrontStateCtx'
import { Button, Message } from 'rsuite'
import { openInVSCode } from 'src/utils/openInVsCode'
import { cwd } from 'process'

export const ActionFileUI = observer(function ActionFileUI_(p: { actionPath: ActionPath }) {
    const pj = useProject()
    const st = useSt()
    const toolbox = st.toolbox
    const af = toolbox.get(p.actionPath)
    if (af == null)
        return (
            <Message type='error'>
                <pre tw='bg-red-900'>❌ action file {JSON.stringify(p.actionPath)} not found</pre>
            </Message>
        )
    return (
        <div>
            {/*  */}
            <div tw='row items-center gap-2' style={{ fontSize: '1.7rem' }}>
                <span>{action.name}</span>
                <Button
                    size='xs'
                    color='blue'
                    appearance='ghost'
                    startIcon={<span className='material-symbols-outlined'>edit</span>}
                    onClick={() => openInVSCode(cwd(), af.absPath)}
                >
                    Edit
                </Button>
            </div>
        </div>
    )
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
