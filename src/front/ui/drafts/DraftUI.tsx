import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { cwd } from 'process'
import { useEffect } from 'react'
import { Button, ButtonGroup, Loader, Message } from 'rsuite'
import { useSt } from 'src/front/FrontStateCtx'
import { DraftID, DraftL } from 'src/models/Draft'
import { openInVSCode } from 'src/utils/openInVsCode'
import { stringifyUnknown } from 'src/utils/stringifyUnknown'
import { ComboUI } from '../layout/ComboUI'
import { MainNavEntryUI } from '../layout/MainNavEntryUI'
import { TabUI } from '../layout/TabUI'
import { ScrollablePaneUI } from '../scrollableArea'
import { draftContext } from '../useDraft'
import { ResultWrapperUI } from '../utils/ResultWrapperUI'
import { JSONHighlightedCodeUI, TypescriptHighlightedCodeUI } from '../utils/TypescriptHighlightedCodeUI'
import { WidgetUI } from '../widgets/WidgetUI'
import { ActionDraftListUI } from './ActionDraftListUI'

export const CurrentDraftUI = observer(function CurrentDraftUI_(p: {}) {
    const st = useSt()
    const draft = st.currentCardAndDraft

    // just in case no card is selected, open one
    useEffect(() => {
        if (draft?.cardPath == null) st.openCardPicker()
    }, [])

    if (draft == null) {
        return (
            <MainNavEntryUI
                tw='m-2'
                size='lg'
                color='green'
                appearance='primary'
                onClick={() => st.openCardPicker()}
                ix='1'
                icon={<span className='material-symbols-outlined'>play_circle</span>}
                label='Open Card Picker'
                tooltip={
                    <>
                        Open the card picker
                        <ComboUI combo='meta+1' />
                    </>
                }
            />
        )
    }
    const card = st.library.getCard(draft.cardPath)
    if (card == null)
        return (
            <Message type='error' showIcon>
                card not found
            </Message>
        )
    if (draft?.draftID == null) return <ActionDraftListUI card={card} />
    return <DraftUI draft={draft.draftID} />
})

/**
 * this is the root interraction widget
 * if a workflow need user-supplied infos, it will send an 'ask' request with a list
 * of things it needs to know.
 */
export const DraftUI = observer(function ActionFormUI_(p: { draft: DraftL | DraftID }) {
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
                tw='m-4 flex flex-col flex-grow h-full'
            >
                <div tw='col items-center font justify-between mb-2'>
                    <div tw='self-start items-center gap-2' style={{ fontSize: '1.3rem' }}>
                        <span>{card.displayName}</span>
                        <ButtonGroup size='xs'>
                            <Button
                                color='blue'
                                appearance='subtle'
                                startIcon={<span className='material-symbols-outlined'>edit</span>}
                                onClick={() => openInVSCode(cwd(), card.absPath)}
                            >
                                Edit
                            </Button>
                            {/* <AddDraftUI af={card} /> */}
                        </ButtonGroup>
                    </div>
                    <div tw='self-end flex gap-2 items-center' style={{ width: 'fit-content' }}>
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
                        <div tw='[margin-left:6rem]'>{card.manifest.description}</div>
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
                // onChange={(ev, checked) => draft.setAutostart(checked)}
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
