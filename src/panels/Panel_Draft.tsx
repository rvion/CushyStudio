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

export const Panel_Draft = observer(function Panel_Draft_(p: { draftID: DraftID }) {
    // 1. get draft
    const st = useSt()
    const draft = typeof p.draftID === 'string' ? st.db.drafts.get(p.draftID) : p.draftID
    return <DraftUI draft={draft} />
})

export const DraftUI = observer(function Panel_Draft_(p: { draft: Maybe<DraftL> }) {
    const draft = p.draft
    useEffect(() => draft?.AWAKE(), [draft?.id])
    // 1. draft
    if (draft == null) return <ErrorPanelUI>Draft not found</ErrorPanelUI>
    // 2. app
    const app = draft.app
    if (app == null) return <ErrorPanelUI>Action not found</ErrorPanelUI>
    // 3. compiled app
    const compiledApp = app.getCompiledAction()
    if (compiledApp == null) return <AppCompilationErrorUI card={app} />

    // 4. get form
    const guiR = draft.gui
    if (!guiR.success)
        return (
            <ErrorPanelUI>
                <b>App failed to load</b>
                <div>❌ {guiR.message}</div>
                <div>{stringifyUnknown(guiR.error)}</div>
            </ErrorPanelUI>
        )

    // 5. render form
    const { containerClassName, containerStyle } = compiledApp ?? {}
    const defaultContainerStyle = { margin: '0 auto' }

    // {/* <ActionDraftListUI card={card} /> */}
    return (
        <draftContext.Provider value={draft} key={draft.id}>
            <div
                style={toJS(containerStyle ?? defaultContainerStyle)}
                tw={['flex flex-col flex-grow h-full', containerClassName]}
            >
                <DraftHeaderUI app={app} draft={draft} />

                <ScrollablePaneUI className='flex-grow'>
                    <div
                        tw='pb-80 pl-2'
                        onKeyUp={(ev) => {
                            // submit on meta+enter
                            if (ev.key === 'Enter' && (ev.metaKey || ev.ctrlKey)) {
                                ev.preventDefault()
                                ev.stopPropagation()
                                draft.start()
                            }
                        }}
                    >
                        <ResultWrapperUI
                            //
                            res={draft.gui}
                            whenValid={(req) => <WidgetUI req={req} />}
                        />
                    </div>
                </ScrollablePaneUI>
                <TabUI>
                    <div>Form</div>
                    <div></div>
                    <div>Form result</div>
                    <JsonViewUI value={draft.gui.value?.result} />
                    <div>Form state</div>
                    <JsonViewUI value={draft.gui.value?.serial} />
                    <div>Action code</div>
                    <TypescriptHighlightedCodeUI code={app.codeJS ?? ''} />
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
            <DropdownItem
                icon={<span className='material-symbols-outlined'></span>}
                onClick={() => openInVSCode(cwd(), card.absPath)}
            >
                Edit App Definition
            </DropdownItem>
            <DropdownItem
                icon={<span className='material-symbols-outlined'></span>}
                onClick={() => openInVSCode(cwd(), card.deck.manifestPath)}
            >
                Edit App Manifest
            </DropdownItem>
            <DropdownItem
                icon={<span className='material-symbols-outlined'></span>}
                onClick={() => showItemInFolder(card.absPath)}
            >
                Show Item In Folder
            </DropdownItem>
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
            <hr />
            <DropdownItem
                icon={<span className='material-symbols-outlined'>mobile_screen_share</span>}
                onClick={() => st.setConfigValue('draft.mockup-mobile', !st.getConfigValue('draft.mockup-mobile'))}
                active={st.isConfigValueTrue('draft.mockup-mobile', true)}
            >
                Mobile
            </DropdownItem>
        </Dropdown>
    )
})

const size1 = 'sm' as const
const size2 = 'sm' as const

/**
 * this is the root interraction widget
 * if a workflow need user-supplied infos, it will send an 'ask' request with a list
 * of things it needs to know.
 */

const ErrorPanelUI = observer(function ErrorPanelUI_(p: { children: React.ReactNode }) {
    return (
        <div tw='h-full' style={{ background: '#210202' }}>
            <Message type='error'>{p.children}</Message>
        </div>
    )
})

export const AppCompilationErrorUI = observer(function AppCompilationErrorUI_(p: { card: CardFile }) {
    const card = p.card
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
})

export const DraftHeaderUI = observer(function DraftHeaderUI_(p: { draft: DraftL; app: CardFile }) {
    const { app, draft } = p
    return (
        <div tw='flex p-1 bg-base-200 border-b border-b-base-300'>
            <div tw='flex gap-0.5 flex-grow relative text-base-content'>
                <CardIllustrationUI card={app} size='4rem' tw='p-1' />
                <div tw='px-1 flex-grow'>
                    <b
                        //
                        tw='font-bold overflow-hidden overflow-ellipsis whitespace-nowrap'
                        style={{ fontSize: '1.6rem' }}
                    >
                        {app.displayName}
                    </b>
                    <div className='flex items-center gap-0 5'>
                        {Boolean(app.authorDefinedManifest) ? (
                            <GithubUserUI //
                                showName
                                tw='text-gray-500'
                                prefix='by'
                                size='1.5rem'
                                username={app.deck.githubUserName}
                            />
                        ) : null}
                        <div tw='join'>
                            <FormLayoutPrefsUI tw='join-item' />
                            <CardActionsMenuUI tw='join-item' card={app} />
                        </div>
                    </div>
                </div>
                <RunOrAutorunUI tw='right-0 absolute' draft={draft} />
            </div>
        </div>
    )
})
