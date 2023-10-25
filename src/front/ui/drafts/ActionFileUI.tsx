import type { ActionPath } from 'src/back/ActionPath'

import { observer } from 'mobx-react-lite'
import { cwd } from 'process'
import { useEffect } from 'react'
import { Button, Message } from 'rsuite'
import { useSt } from 'src/front/FrontStateCtx'
import { openInVSCode } from 'src/utils/openInVsCode'
import { ActionDraftListUI } from './ActionDraftListUI'
import { ActionFormUI } from './ActionFormUI'

export const ActionFileUI = observer(function ActionFileUI_(p: { actionPath: ActionPath }) {
    const st = useSt()
    const toolbox = st.toolbox
    const af = toolbox.get(p.actionPath)
    // console.log('🟢', st.liveTime)

    useEffect(() => {
        void af?.load()
    }, [af])

    if (af == null)
        return (
            <Message type='error'>
                <pre tw='bg-red-900'>A. ❌ action file {JSON.stringify(p.actionPath)} not found</pre>
            </Message>
        )

    const defaultDraft = af?.drafts[0]
    const errors =
        af.errors.length > 0 ? ( //
            <Message type='warning'>{JSON.stringify(af.errors, null, 4)}</Message>
        ) : null

    if (defaultDraft == null)
        return (
            <>
                <div tw='row items-center gap-2' style={{ fontSize: '1.7rem' }}>
                    {/* TITLE */}
                    <span>{af.name}</span>
                    {/* EDIT */}
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
                {/* {st.liveTime} */}
                {af.action == null ? (
                    <Message type='error' showIcon>
                        <pre tw='bg-red-900'>B. ❌ action not found</pre>
                        <pre>loadRequested: {af.loadRequested ? '🟢' : '❌'}</pre>
                        <pre tw='bg-red-900'>{JSON.stringify(af.errors)}</pre>
                    </Message>
                ) : null}
                {errors}
                {/* DRAFT LIST */}
                <ActionDraftListUI af={af} />
            </>
        )

    // return <div>nok</div>
    return <ActionFormUI draft={defaultDraft} />

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
