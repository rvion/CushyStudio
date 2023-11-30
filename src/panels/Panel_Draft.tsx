import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { cwd } from 'process'
import { useEffect } from 'react'
import { showItemInFolder } from 'src/app/layout/openExternal'
import { LibraryFile } from 'src/cards/CardFile'
import { AppIllustrationUI } from 'src/cards/fancycard/AppIllustrationUI'
import { DraftL } from 'src/models/Draft'
import { Dropdown, MenuItem } from 'src/rsuite/Dropdown'
import { PhoneWrapperUI } from 'src/rsuite/PhoneWrapperUI'
import { Button, Joined, Loader, Message } from 'src/rsuite/shims'
import { useSt } from 'src/state/stateContext'
import { openInVSCode } from 'src/utils/electron/openInVsCode'
import { stringifyUnknown } from 'src/utils/formatters/stringifyUnknown'
import { isError } from 'src/utils/misc/isError'
import { WidgetUI } from '../controls/widgets/WidgetUI'
import { ResultWrapperUI } from '../widgets/misc/ResultWrapperUI'
import { ScrollablePaneUI } from '../widgets/misc/scrollableArea'
import { draftContext } from '../widgets/misc/useDraft'

export const Panel_Draft = observer(function Panel_Draft_(p: { draftID: DraftID }) {
    // 1. get draft
    const st = useSt()
    const draft = typeof p.draftID === 'string' ? st.db.drafts.get(p.draftID) : p.draftID
    return <DraftUI draft={draft} />
})

export const DraftUI = observer(function Panel_Draft_(p: { draft: Maybe<DraftL> }) {
    const st = useSt()
    const draft = p.draft
    useEffect(() => draft?.AWAKE(), [draft?.id])
    // 1. draft
    if (draft == null) return <ErrorPanelUI>Draft not found</ErrorPanelUI>
    // 2. app
    const app = draft.app
    if (app == null) return <ErrorPanelUI>Action not found</ErrorPanelUI>
    // 3. compiled app
    const compiledApp = app.getCompiledApp()
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
                onKeyUp={(ev) => {
                    // submit on meta+enter
                    if (ev.key === 'Enter' && (ev.metaKey || ev.ctrlKey)) {
                        ev.preventDefault()
                        ev.stopPropagation()
                        draft.start()
                    }
                }}
            >
                <DraftHeaderUI app={app} draft={draft} />
                {!st.isConfigValueEq('draft.mockup-mobile', true) ? (
                    <ScrollablePaneUI className='flex-grow'>
                        <div tw='pb-80 pl-2'>
                            <ResultWrapperUI
                                //
                                res={draft.gui}
                                whenValid={(req) => <WidgetUI req={req} />}
                            />
                        </div>
                    </ScrollablePaneUI>
                ) : (
                    <PhoneWrapperUI>
                        <ResultWrapperUI
                            //
                            res={draft.gui}
                            whenValid={(req) => <WidgetUI req={req} />}
                        />
                    </PhoneWrapperUI>
                )}
                <Joined tw='opacity-50'>
                    <Button
                        onClick={() => st.layout.FOCUS_OR_CREATE('DraftJsonResult', { draftID: draft.id })}
                        size='sm'
                        tw='tab btn-ghost join-item'
                    >
                        Form result
                    </Button>
                    <Button
                        //
                        onClick={() => st.layout.FOCUS_OR_CREATE('DraftJsonSerial', { draftID: draft.id })}
                        size='sm'
                        tw='tab btn-ghost join-item'
                    >
                        Form state
                    </Button>
                    <Button size='sm' tw='tab btn-ghost join-item'>
                        Action code
                    </Button>
                    {/* <TypescriptHighlightedCodeUI code={app.codeJS ?? ''} /> */}
                </Joined>
            </div>
        </draftContext.Provider>
    )
})

export const RunOrAutorunUI = observer(function RunOrAutorunUI_(p: { className?: string; draft: DraftL }) {
    const draft = p.draft
    return (
        <div tw='flex join virtualBorder' className={p.className}>
            <Button
                //
                tw='btn-sm self-start join-item btn-neutral'
                icon={draft.shouldAutoStart ? <Loader /> : <span className='material-symbols-outlined'>repeat</span>}
                // appearance='primary'
                active={draft.shouldAutoStart}
                color={draft.shouldAutoStart ? 'green' : undefined}
                onClick={() => draft.setAutostart(!draft.shouldAutoStart)}
                // size={size2}
            >
                Auto
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

export const CardActionsMenuUI = observer(function CardActionsMenuUI_(p: { card: LibraryFile; className?: string }) {
    const card = p.card
    const st = useSt()
    return (
        <Dropdown
            tw={[p.className, 'bg-base-100']}
            startIcon={<span className='material-symbols-outlined'>edit</span>}
            title=''
            appearance='subtle'
            size={size1}
        >
            <MenuItem
                icon={<span className='material-symbols-outlined'></span>}
                onClick={() => openInVSCode(cwd(), card.absPath)}
            >
                Edit App Definition
            </MenuItem>
            <MenuItem
                icon={<span className='material-symbols-outlined'></span>}
                onClick={() => openInVSCode(cwd(), card.deck.manifestPath)}
            >
                Edit App Manifest
            </MenuItem>
            <MenuItem icon={<span className='material-symbols-outlined'></span>} onClick={() => showItemInFolder(card.absPath)}>
                Show Item In Folder
            </MenuItem>
            {card.liteGraphJSON && (
                <MenuItem onClick={() => st.layout.FOCUS_OR_CREATE('ComfyUI', { litegraphJson: card.liteGraphJSON })}>
                    Open in ComfyUI
                </MenuItem>
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
            <MenuItem
                icon={<span className='material-symbols-outlined'>photo_size_select_large</span>}
                onClick={() => (st.preferedFormLayout = 'auto')}
                active={layout == 'auto'}
            >
                Auto Layout
                <div tw='badge badge-neutral'>recommanded</div>
            </MenuItem>
            <MenuItem
                icon={<span className='material-symbols-outlined'>photo_size_select_small</span>}
                onClick={() => (st.preferedFormLayout = 'dense')}
                active={layout == 'dense'}
            >
                Dense Layout
            </MenuItem>
            <MenuItem
                icon={<span className='material-symbols-outlined'>photo_size_select_actual</span>}
                onClick={() => (st.preferedFormLayout = 'mobile')}
                active={layout == 'mobile'}
            >
                Mobile Layout
            </MenuItem>
            <hr />
            <MenuItem
                icon={<span className='material-symbols-outlined'>mobile_screen_share</span>}
                onClick={() => st.setConfigValue('draft.mockup-mobile', !st.getConfigValue('draft.mockup-mobile'))}
                active={st.isConfigValueEq('draft.mockup-mobile', true)}
            >
                Mobile
            </MenuItem>
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

export const AppCompilationErrorUI = observer(function AppCompilationErrorUI_(p: { card: LibraryFile }) {
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

export const DraftHeaderUI = observer(function DraftHeaderUI_(p: { draft: DraftL; app: LibraryFile }) {
    const { app, draft } = p
    const st = useSt()
    return (
        <div tw='flex p-1 bg-base-300 border-b border-b-base-300'>
            <div tw='flex gap-0.5 flex-grow relative text-base-content py-1'>
                <AppIllustrationUI card={app} size='4rem' />
                <div tw='px-1 flex-grow'>
                    <div
                        //
                        tw='flex font-bold overflow-hidden overflow-ellipsis whitespace-nowrap'
                        style={{
                            height: '2rem',
                            fontSize: '1.4rem',
                        }}
                    >
                        <span>{app.displayName}</span>
                        <div
                            tw='btn btn-subtle btn-xs'
                            onClick={() => {
                                st.layout.FOCUS_OR_CREATE('Draft', { draftID: draft.id }, 'LEFT_PANE_TABSET')
                            }}
                        >
                            <span className='material-symbols-outlined'>open_in_new</span>
                        </div>
                    </div>
                    <div style={{ height: '2rem' }} className='flex items-center gap-2 justify-between text-sm'>
                        <Joined>
                            <CardActionsMenuUI tw='join-item' card={app} />
                            <FormLayoutPrefsUI tw='join-item' />
                        </Joined>
                        <RunOrAutorunUI draft={draft} />
                    </div>
                </div>
            </div>
        </div>
    )
})
