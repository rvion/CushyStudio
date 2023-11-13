import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { cwd } from 'process'
import { useEffect } from 'react'
import { Button, ButtonGroup, Dropdown, InputGroup, Loader, Message, SelectPicker } from 'rsuite'
import { showItemInFolder } from 'src/app/layout/openExternal'
import { GithubUserUI } from 'src/cards/GithubAvatarUI'
import { CardIllustrationUI } from 'src/cards/fancycard/CardIllustrationUI'
import { DraftID, DraftL } from 'src/models/Draft'
import { useSt } from 'src/state/stateContext'
import { openInVSCode } from 'src/utils/electron/openInVsCode'
import { stringifyUnknown } from 'src/utils/formatters/stringifyUnknown'
import { isError } from 'src/utils/misc/isError'
import { ActionDraftListUI } from 'src/widgets/drafts/ActionDraftListUI'
import { TabUI } from '../app/layout/TabUI'
import { WidgetUI } from '../controls/widgets/WidgetUI'
import { ResultWrapperUI } from '../widgets/misc/ResultWrapperUI'
import { JSONHighlightedCodeUI, TypescriptHighlightedCodeUI } from '../widgets/misc/TypescriptHighlightedCodeUI'
import { ScrollablePaneUI } from '../widgets/misc/scrollableArea'
import { draftContext } from '../widgets/misc/useDraft'

/**
 * this is the root interraction widget
 * if a workflow need user-supplied infos, it will send an 'ask' request with a list
 * of things it needs to know.
 */

export const ErrorPanelUI = observer(function ErrorPanelUI_(p: { children: React.ReactNode }) {
    return (
        <div tw='h-full' style={{ background: '#210202' }}>
            {p.children}
        </div>
    )
})

export const Panel_Draft = observer(function Panel_Draft_(p: { draftID: DraftID }) {
    // 1. get draft
    const st = useSt()
    const draft = typeof p.draftID === 'string' ? st.db.drafts.get(p.draftID) : p.draftID
    return <DraftUI draft={draft} />
})

export const DraftUI = observer(function Panel_Draft_(p: { draft: Maybe<DraftL> }) {
    const st = useSt()
    const draft = p.draft
    useEffect(() => {
        return draft?.AWAKE()
    }, [draft?.id])

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
            <ErrorPanelUI>
                <Message type='error'>
                    <pre tw='bg-red-900'>❌ Action not found</pre>
                </Message>
            </ErrorPanelUI>
        )

    // 3. get action
    const compiledAction = card.getCompiledAction()
    if (compiledAction == null) {
        return (
            <ErrorPanelUI>
                <h3 tw='text-red-600'>invalid action</h3>
                <Message showIcon type='info'>
                    <div>loading strategies attempted:</div>
                    <ul>
                        {card.strategies.map((u) => (
                            <li key={u}>{u}</li>
                        ))}
                    </ul>
                </Message>
                {card.errors.map((e) => {
                    return (
                        <Message showIcon type='error' header={e.title}>
                            {typeof e.details === 'string' ? (
                                <pre tw='text-red-400'>{e.details}</pre>
                            ) : isError(e.details) ? (
                                <div>
                                    <pre tw='text-red-400'>
                                        <b>name</b> {e.details.name}
                                    </pre>
                                    <pre tw='text-red-400'>
                                        <b>message</b> {e.details.message}
                                    </pre>
                                    <pre tw='text-red-400'>
                                        <b>stack</b> {e.details.stack}
                                    </pre>
                                </div>
                            ) : (
                                <pre tw='text-red-400'>{JSON.stringify(e.details, null, 3)}</pre>
                            )}
                        </Message>
                    )
                })}
                {/* <pre tw='text-red-600'>❌ errors: {JSON.stringify(card.errors, null, 2)}</pre> */}
            </ErrorPanelUI>
        )
    }
    // 4. get form
    const formR = draft.form
    if (!formR.success)
        return (
            <ErrorPanelUI>
                <Message type='error' header={<b>App failed to load</b>}>
                    <div>❌ {formR.message}</div>
                    <div tw='bg-red-900'>{stringifyUnknown(formR.error)}</div>
                </Message>
            </ErrorPanelUI>
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
                tw='flex flex-col flex-grow h-full p-3'
            >
                {/* <ActionDraftListUI card={card} /> */}

                {/* NAME */}
                <div tw='flex items-baseline justify-between'>
                    <b tw='font-bold p-1 overflow-hidden overflow-ellipsis whitespace-nowrap' style={{ fontSize: '1.6rem' }}>
                        {card.displayName}
                    </b>
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
                {/* Action bar */}
                <div tw='flex gap-2'>
                    <FormLayoutPrefsUI />
                    <Dropdown title='Menu' appearance='subtle'>
                        <Dropdown.Item onClick={() => openInVSCode(cwd(), card.absPath)}>Edit</Dropdown.Item>
                        <Dropdown.Item onClick={() => showItemInFolder(card.absPath)}>Show Item In Folder</Dropdown.Item>
                        {card.liteGraphJSON && (
                            <Dropdown.Item onClick={() => st.layout.addComfy(card.liteGraphJSON)}>Open in ComfyUI</Dropdown.Item>
                        )}
                    </Dropdown>
                    <div tw='flex-grow'></div>
                    <Button
                        //
                        tw='self-start'
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
                </div>

                {/* <hr /> */}

                {/* <ActionDraftListUI card={card} /> */}
                <ScrollablePaneUI className='flex-grow'>
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
                <TabUI tw='opacity-50 hover:opacity-100'>
                    <div>Form</div>
                    <div></div>
                    <div>Form result</div>
                    <JSONHighlightedCodeUI code={JSON.stringify(draft.form.value?.result, null, 4)} />
                    <div>Form state</div>
                    <JSONHighlightedCodeUI code={JSON.stringify(draft.form.value?.serial, null, 4)?.slice(0, 10000)} />
                    <div>Action code</div>
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

export const FormLayoutPrefsUI = observer(function FormLayoutPrefsUI_(p: {}) {
    const st = useSt()
    // return <SelectPicker placeholder='Form layout' data={[]} />
    return (
        <ButtonGroup>
            <Button
                // appearance={st.preferedFormLayout == 'dense' ? undefind : undefined}
                onClick={() => (st.preferedFormLayout = 'dense')}
                active={st.preferedFormLayout == 'dense'}
            >
                dense
            </Button>
            <Button
                // appearance={st.preferedFormLayout == 'auto' ? undefind : undefined}
                onClick={() => (st.preferedFormLayout = 'auto')}
                active={st.preferedFormLayout == 'auto'}
            >
                auto
            </Button>
            <Button
                // appearance={st.preferedFormLayout == 'mobile' ? undefind : undefined}
                onClick={() => (st.preferedFormLayout = 'mobile')}
                active={st.preferedFormLayout == 'mobile'}
            >
                mobile
            </Button>
        </ButtonGroup>
    )
})

// {/* <div tw='text-xs text-gray-500'>Layout:</div> */}
// {/* <div tw='flex gap-2 items-center'>
//     <div className='flex-grow'></div>

//     <RunOrAutorunUI draft={draft} />
// </div> */}

// {/* <CardIllustrationUI card={card} size='3rem' /> */}
// {/* <div tw='flex gap-2 items-center'>
//         <b tw='overflow-hidden overflow-ellipsis whitespace-nowrap' style={{ fontSize: '1.3rem' }}>
//             {card.displayName}
//         </b>
//         <Button
//             tw='flex-shrink-0'
//             color='blue'
//             size='xs'
//             appearance='subtle'
//             startIcon={<span className='material-symbols-outlined'>edit</span>}
//             onClick={() => openInVSCode(cwd(), card.absPath)}
//         >
//             Edit
//         </Button>
//     </div> */}
// {/* <div tw='italic'>{card.manifest.description}</div> */}
// {/* {card.successfullLoadStrategies} */}

// <Button
//     size='xs'
//     startIcon={<span className='material-symbols-outlined'>open_in_new</span>}
//     appearance='subtle'
//     onClick={() => st.layout.addComfy(card.liteGraphJSON)}
// >
//     Open in Comfy
// </Button>

// {/* {Boolean(card.authorDefinedManifest) ? (
//     <GithubUserUI //
//         showName
//         tw='text-gray-500'
//         prefix='by'
//         size='1rem'
//         username={card.deck.githubUserName}
//     />
// ) : null} */}
