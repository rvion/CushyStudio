import { observer } from 'mobx-react-lite'
import { cwd } from 'process'
import { ErrorBoundary } from 'react-error-boundary'
import { Button } from 'rsuite'
import { PossibleActionFile } from 'src/back/PossibleActionFile'
import { GithubUserUI } from 'src/front/GithubAvatarUI'
import { DraftL } from 'src/models/Draft'
import { openInVSCode } from 'src/utils/openInVsCode'
import { TabUI } from '../layout/TabUI'
import { ScrollablePaneUI } from '../scrollableArea'
import { draftContext } from '../useDraft'
import { ErrorBoundaryFallback } from '../utils/ErrorBoundary'
import { ResultWrapperUI } from '../utils/ResultWrapperUI'
import { JSONHighlightedCodeUI, TypescriptHighlightedCodeUI } from '../utils/TypescriptHighlightedCodeUI'
import { WidgetUI } from '../widgets/WidgetUI'

/**
 * this is the root interraction widget
 * if a workflow need user-supplied infos, it will send an 'ask' request with a list
 * of things it needs to know.
 */
export const ActionFormUI = observer(function ActionFormUI_(p: {
    //
    paf: PossibleActionFile
    draft: DraftL
}) {
    const draft = p.draft
    const tool = draft.tool.item
    return (
        <draftContext.Provider value={draft} key={draft.id}>
            <div
                //
                className='m-4 fade-in flex flex-col flex-grow'
            >
                <div tw='row items-center font-bold font justify-between'>
                    <div tw='row items-center gap-2' style={{ fontSize: '1.7rem' }}>
                        <span>{tool.name}</span>
                        <Button
                            size='xs'
                            color='blue'
                            appearance='ghost'
                            startIcon={<span className='material-symbols-outlined'>edit</span>}
                            onClick={() => openInVSCode(cwd(), p.paf.absPath)}
                        >
                            Edit
                        </Button>
                    </div>
                    <Button
                        size='sm'
                        className='self-start'
                        color='green'
                        // disabled={!tool.st.ws.isOpen}
                        appearance='primary'
                        startIcon={<span className='material-symbols-outlined'>play_arrow</span>}
                        onClick={() => draft.start()}
                    >
                        Run
                    </Button>
                </div>
                <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
                    <GithubUserUI username={tool.data.owner} />
                </ErrorBoundary>
                <ScrollablePaneUI className='flex-grow '>
                    <div>{tool.data.description}</div>
                    <form
                        className='p-2 mt-4'
                        style={{
                            border: '1px dashed #565656',
                            background: '#1e1e1e',
                            borderRadius: '0.5rem',
                            boxShadow: '0 0 2rem #193558',
                        }}
                        onKeyUp={(ev) => {
                            // submit on meta+enter
                            if (ev.key === 'Enter' && (ev.metaKey || ev.ctrlKey)) {
                                console.log('SUBMIT')
                                ev.preventDefault()
                                ev.stopPropagation()
                                draft.start()
                            }
                        }}
                        onSubmit={(ev) => {
                            console.log('SUBMIT')
                            ev.preventDefault()
                            ev.stopPropagation()
                            draft.start()
                        }}
                    >
                        <ResultWrapperUI res={draft.xxx} whenValid={(req) => <WidgetUI req={req} />} />
                    </form>
                    <TabUI title='Debug:' tw='mt-auto'>
                        <div>no</div>
                        <div></div>
                        <div>result</div>
                        <JSONHighlightedCodeUI code={JSON.stringify(draft.finalJSON, null, 4)} />
                        <div>form</div>
                        <JSONHighlightedCodeUI code={JSON.stringify(draft.xxx.value?.result, null, 4)} />
                        <div>state</div>
                        <JSONHighlightedCodeUI code={JSON.stringify(draft.xxx.value?.state, null, 4)} />
                        <div>ts</div>
                        <TypescriptHighlightedCodeUI code={tool.data.codeTS ?? ''} />
                        <div>js</div>
                        <TypescriptHighlightedCodeUI code={tool.data.codeJS ?? ''} />
                    </TabUI>
                </ScrollablePaneUI>
            </div>
        </draftContext.Provider>
    )
})
