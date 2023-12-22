import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { cwd } from 'process'
import { useEffect } from 'react'
import { showItemInFolder } from 'src/app/layout/openExternal'
import { AppIllustrationUI } from 'src/cards/fancycard/AppIllustrationUI'
import { CushyAppL } from 'src/models/CushyApp'
import { DraftL } from 'src/models/Draft'
import { AppFavoriteBtnUI } from 'src/panels/libraryUI/CardPicker2UI'
import { Dropdown, MenuItem } from 'src/rsuite/Dropdown'
import { PhoneWrapperUI } from 'src/rsuite/PhoneWrapperUI'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'
import { Button, Joined, Loader, Message } from 'src/rsuite/shims'
import { useSt } from 'src/state/stateContext'
import { openInVSCode } from 'src/utils/electron/openInVsCode'
import { stringifyUnknown } from 'src/utils/formatters/stringifyUnknown'
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
    if (app == null) return <ErrorPanelUI>File not found</ErrorPanelUI>

    // 3. compiled app
    const compiledApp = app.executable
    if (compiledApp == null) return <AppCompilationErrorUI app={app} />

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
    const { containerClassName, containerStyle } = compiledApp.def ?? {}
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
                <DraftHeaderUI draft={draft} />
                {!st.isConfigValueEq('draft.mockup-mobile', true) ? (
                    <ScrollablePaneUI className='flex-grow'>
                        <div tw='pb-80 pl-2'>
                            <ResultWrapperUI
                                //
                                res={draft.gui}
                                whenValid={(req) => <WidgetUI widget={req} />}
                            />
                        </div>
                    </ScrollablePaneUI>
                ) : (
                    <PhoneWrapperUI>
                        <ResultWrapperUI
                            //
                            res={draft.gui}
                            whenValid={(req) => <WidgetUI widget={req} />}
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
                        onClick={() => st.layout.FOCUS_OR_CREATE('DraftJsonSerial', { draftID: draft.id })}
                        size='sm'
                        tw='tab btn-ghost join-item'
                    >
                        Form state
                    </Button>
                    <Button
                        onClick={() => st.layout.FOCUS_OR_CREATE('Script', { scriptID: draft.app.script.id })}
                        size='sm'
                        tw='tab btn-ghost join-item'
                    >
                        App code
                    </Button>
                    {/* <TypescriptHighlightedCodeUI code={app.codeJS ?? ''} /> */}
                </Joined>
            </div>
        </draftContext.Provider>
    )
})

export const RunOrAutorunUI = observer(function RunOrAutorunUI_(p: { className?: string; draft: DraftL }) {
    const draft = p.draft
    const icon = draft.shouldAutoStart ? 'pause' : 'play_arrow'
    return (
        <div tw='flex join virtualBorder' className={p.className}>
            <RevealUI disableHover>
                <div tw='btn btn-sm btn-square'>
                    <span className='material-symbols-outlined'>timer</span>
                </div>

                <div tw='p-2'>
                    <div>ms to wait after a change</div>
                    <input
                        //
                        value={draft.st.project.data.autostartDelay}
                        onChange={(ev) => {
                            const val = parseInt(ev.target.value)
                            if (Number.isNaN(val)) return
                            draft.st.project.update({ autostartDelay: val })
                        }}
                        tw='input input-bordered input-sm'
                        type='number'
                        placeholder='ms'
                    />
                    <div>max ms to wait before running anyway</div>
                    <input
                        //
                        value={draft.st.project.data.autostartMaxDelay}
                        onChange={(ev) => {
                            const val = parseInt(ev.target.value)
                            if (Number.isNaN(val)) return
                            draft.st.project.update({ autostartMaxDelay: val })
                        }}
                        tw='input input-bordered input-sm'
                        type='number'
                        placeholder='ms'
                    />
                </div>
            </RevealUI>
            <div
                tw={['btn btn-square btn-sm self-start join-item btn-neutral', draft.shouldAutoStart ? 'btn-active' : null]}
                // color={draft.shouldAutoStart ? 'green' : undefined}
                onClick={() => draft.setAutostart(!draft.shouldAutoStart)}
            >
                {draft.shouldAutoStart ? <Loader /> : <span className='material-symbols-outlined'>repeat</span>}
                {/* Auto */}
            </div>
            <Button
                tw='btn-sm join-item btn-primary'
                className='self-start'
                icon={<span className='material-symbols-outlined'>{icon}</span>}
                onClick={() => {
                    draft.setAutostart(false)
                    draft.start()
                }}
            >
                Run
            </Button>
        </div>
    )
})

export const DraftActionMenuUI = observer(function DraftActionMenuUI_(p: { draft: DraftL; className?: string }) {
    const file = p.draft.file
    const st = useSt()
    return (
        <Dropdown
            tw={[p.className, 'btn-square btn-sm']}
            startIcon={<span className='material-symbols-outlined'>edit</span>}
            title=''
            appearance='subtle'
            size={size1}
        >
            <MenuItem
                icon={<span className='material-symbols-outlined'></span>}
                onClick={() => openInVSCode(cwd(), file?.absPath ?? '')}
            >
                Edit App Definition
            </MenuItem>
            {/* <MenuItem
                icon={<span className='material-symbols-outlined'></span>}
                onClick={() => openInVSCode(cwd(), file.pkg.manifestPath)}
            >
                Edit App Manifest
            </MenuItem> */}
            <MenuItem
                //
                onClick={() => showItemInFolder(file.absPath)}
                icon={<span className='material-symbols-outlined'></span>}
            >
                Show Item In Folder
            </MenuItem>

            {file?.liteGraphJSON && (
                <MenuItem onClick={() => st.layout.FOCUS_OR_CREATE('ComfyUI', { litegraphJson: file.liteGraphJSON })}>
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
            title={''} //`${layout}`}
            // startIcon={<span className='material-symbols-outlined'>format_size</span>}
        >
            <MenuItem
                icon={<span className='material-symbols-outlined'>photo_size_select_large</span>}
                onClick={() => (st.preferedFormLayout = 'auto')}
                active={layout == 'auto'}
            >
                Auto Layout
                <div tw='badge badge-neutral'>recommended</div>
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
        <div tw='h-full'>
            <Message type='error'>{p.children}</Message>
        </div>
    )
})

export const AppCompilationErrorUI = observer(function AppCompilationErrorUI_(p: { app: CushyAppL }) {
    const card = p.app
    return (
        <ErrorPanelUI>
            <h3 tw='text-red-600'>invalid action</h3>
            {/* <Message showIcon type='info'>
                <div>loading strategies attempted:</div>
                <ul>
                    {card.strategies.map((u) => (
                        <li key={u}>{u}</li>
                    ))}
                </ul>
            </Message> */}
            {/* {card.errors.map((e, ix) => {
                return (
                    <Message key={ix} showIcon type='error' header={e.title}>
                        {typeof e.details === 'string' ? (
                            <pre>{e.details}</pre>
                        ) : isError(e.details) ? (
                            <div>
                                <pre>
                                    <b>name</b> {e.details.name}
                                </pre>
                                <pre>
                                    <b>message</b> {e.details.message}
                                </pre>
                                <pre>
                                    <b>stack</b> {e.details.stack}
                                </pre>
                            </div>
                        ) : (
                            <pre>{JSON.stringify(e.details, null, 3)}</pre>
                        )}
                    </Message>
                )
            })} */}
            {/* <pre tw='text-red-600'>❌ errors: {JSON.stringify(card.errors, null, 2)}</pre> */}
        </ErrorPanelUI>
    )
})

export const DraftHeaderUI = observer(function DraftHeaderUI_(p: {
    //
    draft: DraftL
    // file: LibraryFile
}) {
    const { draft } = p
    const app = draft.appRef.item
    const st = useSt()
    return (
        <div tw='flex bg-base-300 border-b border-b-base-300'>
            <div tw='flex gap-0.5 flex-grow relative text-base-content py-1'>
                <AppIllustrationUI app={app} size='4rem' />
                <div tw='ml-1 flex-grow'>
                    <div
                        //
                        tw={[
                            //
                            'flex items-center',
                            'overflow-hidden overflow-ellipsis whitespace-nowrap',
                        ]}
                        style={{ height: '2rem', fontSize: '1.2rem' }}
                    >
                        <AppFavoriteBtnUI app={app} />
                        <span>{app.name}</span>

                        <div tw={['absolute right-0']}>
                            <button
                                disabled={app.isPublishing}
                                tw='btn btn-ghost btn-square btn-sm'
                                onClick={async () => {
                                    await app.publish()
                                }}
                            >
                                {app.isPublishing ? <Loader /> : <span className='material-symbols-outlined'>publish</span>}
                            </button>
                            {/* Open draft in new tab btn */}
                            <DraftActionMenuUI draft={draft} />
                            <FormLayoutPrefsUI />
                            <div
                                tw='btn btn-ghost btn-square btn-sm'
                                onClick={() => {
                                    st.layout.FOCUS_OR_CREATE('Draft', { draftID: draft.id }, 'LEFT_PANE_TABSET')
                                }}
                            >
                                <span className='material-symbols-outlined'>open_in_new</span>
                            </div>
                            {/* duplicate draft btn */}
                            <div
                                tw='btn btn-ghost btn-square btn-sm'
                                onClick={() => {
                                    const newDraft = draft.clone()
                                    st.layout.FOCUS_OR_CREATE('Draft', { draftID: newDraft.id }, 'LEFT_PANE_TABSET')
                                }}
                            >
                                <span className='material-symbols-outlined'>content_copy</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ height: '2rem' }} className='flex items-center gap-2 justify-between text-sm'>
                        <input
                            tw='input input-bordered input-sm flex-grow'
                            onChange={(ev) => draft.update({ title: ev.target.value })}
                            // tw='w-full'
                            value={draft.data.title ?? 'no title'}
                        ></input>
                        <RunOrAutorunUI tw='flex-shrink-0' draft={draft} />
                    </div>
                </div>
            </div>
        </div>
    )
})
