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
import { GithubUserUI } from 'src/cards/GithubAvatarUI'
import { CardIllustrationUI } from 'src/cards/fancycard/CardIllustrationUI'
import { ActionDraftListUI } from 'src/widgets/drafts/ActionDraftListUI'
import { showItemInFolder } from 'src/app/layout/openExternal'

/**
 * this is the root interraction widget
 * if a workflow need user-supplied infos, it will send an 'ask' request with a list
 * of things it needs to know.
 */

export const Panel_Draft = observer(function Panel_Draft_(p: { draftID: DraftID }) {
    // 1. get draft
    const st = useSt()
    const draft = typeof p.draftID === 'string' ? st.db.drafts.get(p.draftID) : p.draftID
    return <DraftUI draft={draft} />
})

export const DraftUI = observer(function Panel_Draft_(p: { draft: Maybe<DraftL> }) {
    const st = useSt()
    const draft = p.draft
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
                <pre tw='bg-red-900'>❌ Action not found</pre>
            </Message>
        )

    // 3. get action
    const compiledAction = card.getCompiledAction()
    if (compiledAction == null)
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
    const { containerClassName, containerStyle } = compiledAction ?? {}
    const defaultContainerStyle = {
        margin: '0 auto',
        // padding: '1rem',
    }
    return (
        <draftContext.Provider value={draft} key={draft.id}>
            <div
                //
                className={containerClassName}
                style={toJS(containerStyle ?? defaultContainerStyle)}
                tw='flex flex-col flex-grow h-full'
            >
                <div
                    //
                    // style={{ background }}
                    tw='col font justify-between mb-2 pb-2 w-full bg-contrasted-gradient'
                >
                    <ActionDraftListUI card={card} />
                    <div tw='gap-2 flex flex-grow'>
                        <CardIllustrationUI card={card} size='5rem' />
                        <div tw='flex-grow overflow-hidden'>
                            <div tw='flex gap-2 items-center'>
                                <b tw='overflow-hidden overflow-ellipsis whitespace-nowrap' style={{ fontSize: '1.3rem' }}>
                                    {card.displayName}
                                </b>
                                <Button
                                    tw='flex-shrink-0'
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
                            {card.successfullLoadStrategies}
                            {card.liteGraphJSON && (
                                <Button
                                    size='xs'
                                    startIcon={<span className='material-symbols-outlined'>open_in_new</span>}
                                    appearance='link'
                                    onClick={() => st.layout.addComfy(card.liteGraphJSON)}
                                >
                                    Open in Comfy
                                </Button>
                            )}
                            <Button
                                startIcon={<span className='material-symbols-outlined'>folder</span>}
                                size='xs'
                                appearance='link'
                                onClick={() => showItemInFolder(card.absPath)}
                            >
                                open folder
                            </Button>
                            {Boolean(card.authorDefinedManifest) ? (
                                <GithubUserUI //
                                    showName
                                    tw='text-gray-500'
                                    prefix='by'
                                    size='1rem'
                                    username={card.deck.githubUserName}
                                />
                            ) : null}
                        </div>
                    </div>
                    <div tw='flex gap-2 items-center'>
                        <div tw='text-xs text-gray-500'>Layout:</div>
                        <ButtonGroup size='xs'>
                            <Button
                                appearance={st.preferedFormLayout == 'dense' ? 'primary' : undefined}
                                onClick={() => (st.preferedFormLayout = 'dense')}
                                active={st.preferedFormLayout == 'dense'}
                            >
                                dense
                            </Button>
                            <Button
                                appearance={st.preferedFormLayout == 'auto' ? 'primary' : undefined}
                                onClick={() => (st.preferedFormLayout = 'auto')}
                                active={st.preferedFormLayout == 'auto'}
                            >
                                auto
                            </Button>
                            <Button
                                appearance={st.preferedFormLayout == 'mobile' ? 'primary' : undefined}
                                onClick={() => (st.preferedFormLayout = 'mobile')}
                                active={st.preferedFormLayout == 'mobile'}
                            >
                                mobile
                            </Button>
                        </ButtonGroup>
                        <div className='flex-grow'></div>
                        <RunOrAutorunUI draft={draft} />
                    </div>
                </div>
                {/* <ActionDraftListUI card={card} /> */}
                <ScrollablePaneUI className='flex-grow'>
                    <TabUI>
                        <div>Form</div>
                        <div></div>
                        <div>Form result</div>
                        <JSONHighlightedCodeUI code={JSON.stringify(draft.form.value?.result, null, 4)} />
                        <div>Form state</div>
                        <JSONHighlightedCodeUI code={JSON.stringify(draft.form.value?.serial, null, 4)?.slice(0, 10000)} />
                        <div>Action code</div>
                        <TypescriptHighlightedCodeUI code={card.codeJS ?? ''} />
                    </TabUI>
                    <form
                        tw='pb-80 pl-2'
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
