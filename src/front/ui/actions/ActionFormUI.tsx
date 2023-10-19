import { observer } from 'mobx-react-lite'
import { cwd } from 'process'
import { ErrorBoundary } from 'react-error-boundary'
import { Button, Toggle } from 'rsuite'
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
import { toJS } from 'mobx'

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
    const { containerClassName, containerStyle } = draft.action.value ?? {}
    const defaultContainerStyle = { maxWidth: '40rem', margin: '0 auto', padding: '1rem' }
    return (
        <draftContext.Provider value={draft} key={draft.id}>
            <div
                //
                className={containerClassName}
                style={toJS(containerStyle ?? defaultContainerStyle)}
                tw='m-4 fade-in flex flex-col flex-grow'
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
                    <div>
                        autorun:
                        <Toggle size='sm' color='red' onChange={(t) => draft.setAutostart(t)}>
                            Run
                        </Toggle>
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
                        className='p-2 m-4'
                        style={{
                            border: '1px dashed #565656',
                            background: '#1e1e1e',
                            borderRadius: '0.5rem',
                            // boxShadow: '0 0 2rem #193558',
                            boxShadow: 'rgb(39 118 217) 0px 0px 2rem',
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
                        <ResultWrapperUI res={draft.form} whenValid={(req) => <WidgetUI req={req} />} />
                    </form>
                    <TabUI title='Debug:' tw='mt-auto'>
                        <div>no</div>
                        <div></div>
                        <div>form</div>
                        <div tw='flex flex-grow'>
                            <JSONHighlightedCodeUI code={JSON.stringify(draft.form.value?.result, null, 4)} />
                            <JSONHighlightedCodeUI code={JSON.stringify(draft.form.value?.serial, null, 4)?.slice(0, 10_000)} />
                        </div>
                        <div>code</div>
                        <TypescriptHighlightedCodeUI code={tool.data.codeJS ?? ''} />
                    </TabUI>
                </ScrollablePaneUI>
            </div>
        </draftContext.Provider>
    )
})
