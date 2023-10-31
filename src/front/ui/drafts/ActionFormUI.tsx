import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { cwd } from 'process'
import { ErrorBoundary } from 'react-error-boundary'
import { Button, Checkbox, Input, InputGroup, Message } from 'rsuite'
import { useSt } from 'src/front/FrontStateCtx'
import { GithubUserUI } from 'src/library/GithubAvatarUI'
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
import { ActionDraftListUI, AddDraftUI } from './ActionDraftListUI'
import { GithubUserName } from 'src/library/GithubUser'

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
                <pre tw='text-red-600'>❌ action not found</pre>
                <pre tw='text-red-600'>❌ errors: {JSON.stringify(af.errors, null, 2)}</pre>
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
    const defaultContainerStyle = {
        // maxWidth: '40rem',
        // width: 'fit-content',
        margin: '0 auto',
        padding: '1rem',
    }
    return (
        <draftContext.Provider value={draft} key={draft.id}>
            <div
                //
                className={containerClassName}
                style={toJS(containerStyle ?? defaultContainerStyle)}
                tw='m-4 flex flex-col flex-grow h-full'
            >
                <div tw='row items-center font justify-between mb-2'>
                    <div tw='row items-center gap-2' style={{ fontSize: '1.3rem' }}>
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
                        <AddDraftUI af={af} />
                    </div>
                    <div tw='self-end flex gap-2 items-center' style={{ width: 'fit-content' }}>
                        <Checkbox checked={draft.shouldAutoStart} onChange={(ev, checked) => draft.setAutostart(checked)}>
                            Autorun
                        </Checkbox>
                        {/* <Toggle size='sm' color='red' onChange={(t) => draft.setAutostart(t)} /> */}
                        <Button
                            size='sm'
                            className='self-start'
                            color='green'
                            appearance='primary'
                            startIcon={<span className='material-symbols-outlined'>play_arrow</span>}
                            onClick={() => draft.start()}
                        >
                            Run
                        </Button>
                    </div>
                    {/* <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
                        <div tw='flex items-center gap-1'>
                            <span>By</span>
                            {action.author ? ( //
                                <GithubUserUI //
                                    showName
                                    username={action.author as GithubUserName}
                                />
                            ) : (
                                'anonymous'
                            )}
                        </div>
                    </ErrorBoundary> */}
                </div>
                <ActionDraftListUI af={af} />
                <ScrollablePaneUI
                    // style={{ border: '1px solid blue' }}
                    style={{ border: '3px solid #2c2e39' }}
                    className='flex-grow  rounded-xl bg-contrasted-gradient'
                >
                    <form
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
                        <div tw='[margin-left:6rem]'>{action.description}</div>
                        <ResultWrapperUI
                            //
                            res={draft.form}
                            whenValid={(req) => <WidgetUI req={req} />}
                        />
                    </form>
                </ScrollablePaneUI>
                <TabUI title='Debug:' tw='mt-auto'>
                    <div>no</div>
                    <div></div>
                    <div>result</div>
                    <JSONHighlightedCodeUI code={JSON.stringify(draft.form.value?.result, null, 4)} />
                    <div>state</div>
                    <JSONHighlightedCodeUI code={JSON.stringify(draft.form.value?.serial, null, 4)?.slice(0, 10_000)} />
                    <div>code</div>
                    <TypescriptHighlightedCodeUI code={af.codeJS ?? ''} />
                </TabUI>
            </div>
        </draftContext.Provider>
    )
})
