import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { cwd } from 'process'
import { ErrorBoundary } from 'react-error-boundary'
import { Button, Checkbox, Message } from 'rsuite'
import { useSt } from 'src/front/FrontStateCtx'
import { GithubUserUI } from 'src/front/GithubAvatarUI'
import { DraftID, DraftL } from 'src/models/Draft'
import { openInVSCode } from 'src/utils/openInVsCode'
import { stringifyUnknown } from 'src/utils/stringifyUnknown'
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
export const ActionFormUI = observer(function ActionFormUI_(p: { draft: DraftL | DraftID }) {
    // 1. get draft
    const st = useSt()
    const draft = typeof p.draft === 'string' ? st.db.drafts.get(p.draft) : p.draft
    if (draft == null)
        return (
            <Message type='error'>
                <pre tw='bg-red-900'>❌ Draft not found</pre>
            </Message>
        )

    // 2. get action file
    const af = draft.actionFile
    if (af == null)
        return (
            <Message type='error'>
                <pre tw='bg-red-900'>❌ action file not found</pre>
            </Message>
        )

    // 3. get action
    const action = af.getAction()
    if (action == null)
        return (
            <Message type='error'>
                <pre tw='bg-red-900'>❌ action not found</pre>
            </Message>
        )

    // 4. get form
    const formR = draft.form
    if (!formR.success)
        return (
            <Message type='error'>
                <div>❌ form failed</div>
                <div tw='bg-red-900'>{stringifyUnknown(formR.error)}</div>
            </Message>
        )

    // 5. render form
    const { containerClassName, containerStyle } = action ?? {}
    const defaultContainerStyle = { maxWidth: '40rem', margin: '0 auto', padding: '1rem' }
    return (
        <draftContext.Provider value={draft} key={draft.id}>
            <div
                //
                className={containerClassName}
                style={toJS(containerStyle ?? defaultContainerStyle)}
                tw='m-4 fade-in flex flex-col flex-grow h-full'
            >
                <div tw='row items-center font-bold font justify-between'>
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
                    <div>
                        <Checkbox checked={draft.shouldAutoStart} onChange={(_, next) => draft.setAutostart(next)}>
                            Autorun
                        </Checkbox>
                        {/* <Toggle size='sm' color='red' onChange={(t) => draft.setAutostart(t)} /> */}
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
                    <div tw='flex items-center'>
                        By <GithubUserUI showName username={action.author} />
                    </div>
                </ErrorBoundary>
                <ScrollablePaneUI className='flex-grow '>
                    <div>{action.description}</div>
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
                        <ResultWrapperUI
                            //
                            res={draft.form}
                            whenValid={(req) => <WidgetUI req={req} />}
                        />
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
                        <TypescriptHighlightedCodeUI code={af.codeJS ?? ''} />
                    </TabUI>
                </ScrollablePaneUI>
            </div>
        </draftContext.Provider>
    )
})
