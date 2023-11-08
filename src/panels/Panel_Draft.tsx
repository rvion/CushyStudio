import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { cwd } from 'process'
import { Button, ButtonGroup, Loader, Message, Toggle } from 'rsuite'
import { useSt } from 'src/state/stateContext'
import { DraftID, DraftL } from 'src/models/Draft'
import { openInVSCode } from 'src/utils/electron/openInVsCode'
import { stringifyUnknown } from 'src/utils/formatters/stringifyUnknown'
import { TabUI } from '../app/layout/TabUI'
import { ScrollablePaneUI } from '../widgets/misc/scrollableArea'
import { draftContext } from '../widgets/misc/useDraft'
import { ResultWrapperUI } from '../widgets/misc/ResultWrapperUI'
import { JSONHighlightedCodeUI, TypescriptHighlightedCodeUI } from '../widgets/misc/TypescriptHighlightedCodeUI'
import { WidgetUI } from '../controls/widgets/WidgetUI'

/**
 * this is the root interraction widget
 * if a workflow need user-supplied infos, it will send an 'ask' request with a list
 * of things it needs to know.
 */

export const Panel_Draft = observer(function Panel_Draft_(p: { draft: DraftL | DraftID }) {
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
    const card = draft.card
    if (card == null)
        return (
            <Message type='error'>
                <pre tw='bg-red-900'>❌ card file not found</pre>
            </Message>
        )

    // 3. get action
    const action = card.getAction()
    if (action == null)
        return (
            <Message type='error'>
                <pre tw='text-red-600'>❌ action not found</pre>
                <pre tw='text-red-600'>❌ errors: {JSON.stringify(card.errors, null, 2)}</pre>
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
                tw='flex flex-col flex-grow h-full'
            >
                <div tw='col font justify-between mb-2 w-full'>
                    <div tw='gap-2 flex flex-grow'>
                        <img
                            tw='rounded m-2'
                            style={{ width: '6rem', height: '6rem' }}
                            src={card.illustrationPathWithFileProtocol}
                            alt='card illustration'
                            onClick={() => {
                                console.log('clicked')
                                st.currentDraft = card.getLastDraft()
                            }}
                        />
                        <div tw='w-full'>
                            <div tw='flex gap-2 items-center'>
                                <b tw='flex-grow' style={{ fontSize: '1.3rem' }}>
                                    {card.displayName}
                                </b>
                                <Button
                                    color='blue'
                                    size='xs'
                                    appearance='subtle'
                                    startIcon={<span className='material-symbols-outlined'>edit</span>}
                                    onClick={() => openInVSCode(cwd(), card.absPath)}
                                >
                                    Edit
                                </Button>
                            </div>
                            <div tw='italic'>{card.manifest.description}</div>
                        </div>
                    </div>
                    <div tw='flex gap-2 items-center'>
                        {/* <Input>foo</Input> */}
                        <div tw='whitespace-nowrap flex items-center'>
                            <Toggle
                                //
                                onChange={(t) => (st.preferDenseForms = t)}
                                checked={st.preferDenseForms}
                            ></Toggle>
                            <div tw='text-red-500'>PREFER DENSER FORM</div>
                        </div>
                        <div className='flex-grow'></div>
                        <RunOrAutorunUI draft={draft} />
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
                {/* <ActionDraftListUI card={card} /> */}
                <ScrollablePaneUI
                    // style={{ border: '1px solid blue' }}
                    // style={{ border: '7px solid #152865' }}
                    className='flex-grow rounded-xl bg-contrasted-gradient'
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
                    <JSONHighlightedCodeUI code={JSON.stringify(draft.form.value?.serial, null, 4)?.slice(0, 10000)} />
                    <div>code</div>
                    <TypescriptHighlightedCodeUI code={card.codeJS ?? ''} />
                </TabUI>
            </div>
        </draftContext.Provider>
    )
})

export const RunOrAutorunUI = observer(function RunOrAutorunUI_(p: { draft: DraftL }) {
    const draft = p.draft
    return (
        <ButtonGroup size='sm'>
            <Button
                //
                startIcon={draft.shouldAutoStart ? <Loader /> : undefined}
                active={draft.shouldAutoStart}
                color={draft.shouldAutoStart ? 'green' : undefined}
                onClick={() => draft.setAutostart(!draft.shouldAutoStart)}
            >
                Autorun
            </Button>
            {/* <Toggle size='sm' color='red' onChange={(t) => draft.setAutostart(t)} /> */}
            <Button
                className='self-start'
                color='green'
                appearance='primary'
                startIcon={<span className='material-symbols-outlined'>play_arrow</span>}
                onClick={() => draft.start()}
            >
                Run
            </Button>
        </ButtonGroup>
    )
})
