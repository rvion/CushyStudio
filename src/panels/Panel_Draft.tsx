import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { cwd } from 'process'
import { useEffect } from 'react'
import { showItemInFolder } from 'src/app/layout/openExternal'
import { CardFile } from 'src/cards/CardFile'
import { GithubUserUI } from 'src/cards/GithubAvatarUI'
import { CardIllustrationUI } from 'src/cards/fancycard/CardIllustrationUI'
import { DraftID, DraftL } from 'src/models/Draft'
import { Button, Dropdown, DropdownItem, Loader, Message } from 'src/rsuite/shims'
import { useSt } from 'src/state/stateContext'
import { openInVSCode } from 'src/utils/electron/openInVsCode'
import { stringifyUnknown } from 'src/utils/formatters/stringifyUnknown'
import { isError } from 'src/utils/misc/isError'
import { TabUI } from '../app/layout/TabUI'
import { WidgetUI } from '../controls/widgets/WidgetUI'
import { ResultWrapperUI } from '../widgets/misc/ResultWrapperUI'
import { JSONHighlightedCodeUI, TypescriptHighlightedCodeUI } from '../widgets/misc/TypescriptHighlightedCodeUI'
import { ScrollablePaneUI } from '../widgets/misc/scrollableArea'
import { draftContext } from '../widgets/misc/useDraft'
import { JsonViewUI } from 'src/widgets/workspace/JsonViewUI'

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
                tw='flex flex-col flex-grow h-full'
            >
                {/* <ActionDraftListUI card={card} /> */}

                {/* NAME */}
                <div
                    //
                    style={{ borderBottomWidth: '.2rem' }}
                    tw='flex p-1 bg-base-200 border-b border-b-base-300'
                >
                    <div tw='flex gap-0.5 flex-grow relative text-base-content'>
                        <CardIllustrationUI card={card} size='4rem' tw='p-1' />
                        <div tw='px-1 flex-grow'>
                            <b
                                //
                                tw='font-bold overflow-hidden overflow-ellipsis whitespace-nowrap'
                                style={{ fontSize: '1.6rem' }}
                            >
                                {card.displayName}
                            </b>
                            <div className='flex items-center gap-0 5'>
                                {Boolean(card.authorDefinedManifest) ? (
                                    <GithubUserUI //
                                        showName
                                        tw='text-gray-500'
                                        prefix='by'
                                        size='1.5rem'
                                        username={card.deck.githubUserName}
                                    />
                                ) : null}
                                <div tw='join'>
                                    <FormLayoutPrefsUI tw='join-item' />
                                    <CardActionsMenuUI tw='join-item' card={card} />
                                </div>
                            </div>
                        </div>
                        <RunOrAutorunUI tw='right-0 absolute' draft={draft} />
                    </div>
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
                <TabUI>
                    <div>Form</div>
                    <div></div>
                    <div>Form result</div>
                    <JsonViewUI value={draft.form.value?.result} />
                    <div>Form state</div>
                    <JsonViewUI value={draft.form.value?.serial} />
                    <div>Action code</div>
                    <TypescriptHighlightedCodeUI code={card.codeJS ?? ''} />
                </TabUI>
            </div>
        </draftContext.Provider>
    )
})

export const RunOrAutorunUI = observer(function RunOrAutorunUI_(p: { className?: string; draft: DraftL }) {
    const draft = p.draft
    return (
        <div tw='flex join' className={p.className}>
            <Button
                //
                tw='btn-sm self-start join-item btn-neutral'
                icon={draft.shouldAutoStart ? <Loader /> : <span className='material-symbols-outlined'>autorenew</span>}
                // appearance='primary'
                active={draft.shouldAutoStart}
                color={draft.shouldAutoStart ? 'green' : undefined}
                onClick={() => draft.setAutostart(!draft.shouldAutoStart)}
                // size={size2}
            >
                {/* Auto */}
            </Button>
            <Button
                tw='btn-sm join-item btn-primary'
                className='self-start'
                icon={
                    draft.shouldAutoStart ? ( //
                        <span className='material-symbols-outlined'>pause</span>
                    ) : (
                        <span className='material-symbols-outlined'>play_arrow</span>
                    )
                }
                onClick={() => draft.start()}
                // size={'sm'}
            >
                Run
            </Button>
        </div>
    )
})

export const CardActionsMenuUI = observer(function CardActionsMenuUI_(p: { card: CardFile; className?: string }) {
    const card = p.card
    const st = useSt()
    return (
        <Dropdown
            tw={[p.className]}
            startIcon={<span className='material-symbols-outlined'>edit</span>}
            title='Menu'
            appearance='subtle'
            size={size1}
        >
            <DropdownItem onClick={() => openInVSCode(cwd(), card.absPath)}>Edit</DropdownItem>
            <DropdownItem onClick={() => showItemInFolder(card.absPath)}>Show Item In Folder</DropdownItem>
            {card.liteGraphJSON && (
                <DropdownItem onClick={() => st.layout.addComfy(card.liteGraphJSON)}>Open in ComfyUI</DropdownItem>
            )}
        </Dropdown>
    )
})

export const FormLayoutPrefsUI = observer(function FormLayoutPrefsUI_(p: { className?: string }) {
    const st = useSt()
    const layout = st.preferedFormLayout
    return (
        <Dropdown
            //
            tw={[p.className]}
            size={size1}
            appearance='subtle'
            startIcon={<span className='material-symbols-outlined'>dynamic_form</span>}
            title={`${layout}`}
            // startIcon={<span className='material-symbols-outlined'>format_size</span>}
        >
            <DropdownItem
                icon={<span className='material-symbols-outlined'>photo_size_select_small</span>}
                onClick={() => (st.preferedFormLayout = 'dense')}
                active={layout == 'dense'}
            >
                Dense
            </DropdownItem>

            <DropdownItem
                icon={<span className='material-symbols-outlined'>photo_size_select_large</span>}
                onClick={() => (st.preferedFormLayout = 'auto')}
                active={layout == 'auto'}
            >
                Auto
            </DropdownItem>

            <DropdownItem
                icon={<span className='material-symbols-outlined'>photo_size_select_actual</span>}
                onClick={() => (st.preferedFormLayout = 'mobile')}
                active={layout == 'mobile'}
            >
                Mobile
            </DropdownItem>
        </Dropdown>
    )
})

const size1 = 'sm' as const
const size2 = 'sm' as const
