import type { CushyAppL } from '../../models/CushyApp'
import type { DraftL } from '../../models/Draft'

import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect } from 'react'

import { FormUI } from '../../csuite/form/FormUI'
import { stringifyUnknown } from '../../csuite/formatters/stringifyUnknown'
import { Frame } from '../../csuite/frame/Frame'
import { MarkdownUI } from '../../csuite/markdown/MarkdownUI'
import { MessageErrorUI } from '../../csuite/messages/MessageErrorUI'
import { MessageInfoUI } from '../../csuite/messages/MessageInfoUI'
import { RevealUI } from '../../csuite/reveal/RevealUI'
import { SelectUI } from '../../csuite/select/SelectUI'
import { FramePhoneUI } from '../../csuite/wrappers/FramePhoneUI'
import { InstallRequirementsBtnUI } from '../../manager/REQUIREMENTS/Panel_InstallRequirementsUI'
import { useSt } from '../../state/stateContext'
import { draftContext } from '../../widgets/misc/useDraft'
import { DraftHeaderUI } from './DraftHeaderUI'
import { run_justify, ui_justify } from './prefab_justify'
import { RecompileUI } from './RecompileUI'

export const Panel_Draft = observer(function Panel_Draft_(p: { draftID: DraftID }) {
    // 1. get draft
    const st = useSt()
    const draft = typeof p.draftID === 'string' ? st.db.draft.get(p.draftID) : p.draftID
    return <PanelDraftV2UI draft={draft} />
})

export const PanelDraftV2UI = observer(function PanelDraftV2UI_(p: { draft: Maybe<DraftL> }) {
    return <DraftUI draft={p.draft} />
    // return (
    //     <>
    //         <PanelHeaderUI>Draft</PanelHeaderUI>
    //         <DraftUI draft={p.draft} />
    //     </>
    // )
})
export const DraftUI = observer(function Panel_Draft_(p: { draft: Maybe<DraftL> }) {
    const st = useSt()
    const draft = p.draft
    const justify = cushy.forms.use(ui_justify)

    // useEffect(() => draft?.AWAKE(), [draft?.id])

    // ensure
    useLayoutEffect(() => {
        if (draft?.name != null) st.layout.syncTabTitle('Draft', { draftID: draft.id }, draft.name)
    }, [draft?.name])

    // 1. draft
    if (draft == null) return <ErrorPanelUI>Draft not found</ErrorPanelUI>

    // 2. app
    const app = draft.app
    if (app == null) return <ErrorPanelUI>File not found</ErrorPanelUI>

    // 3. compiled app
    const compiledApp = app.executable_orExtract
    if (compiledApp == null) return <AppCompilationErrorUI app={app} />

    // 4. get form
    const guiR = draft.form
    if (guiR == null)
        return (
            <ErrorPanelUI>
                {/* <div>{draft.id}</div> */}
                <div>draft.form is null</div>
                {/* <div>test: {draft.test}</div> */}
            </ErrorPanelUI>
        )

    // ⏸️ if (guiR.error)
    // ⏸️     return (
    // ⏸️         <>
    // ⏸️             <DraftHeaderUI draft={draft} children={justify.render()} />
    // ⏸️             <ErrorPanelUI>
    // ⏸️                 <RecompileUI always app={draft.app} />
    // ⏸️                 <b>App failed to load</b>
    // ⏸️                 <div>❌ {guiR.error}</div>
    // ⏸️                 <div>{stringifyUnknown(guiR.error)}</div>
    // ⏸️             </ErrorPanelUI>
    // ⏸️         </>
    // ⏸️     )

    // 5. render form
    const { containerClassName, containerStyle } = compiledApp.def ?? {}
    const defaultContainerStyle = {} // { margin: '0 auto' }

    const wrapMobile = st.isConfigValueEq('draft.mockup-mobile', true)
    const metadata = draft.app.executable_orExtract?.metadata
    // {/* <ActionDraftListUI card={card} /> */}
    const OUT = (
        <draftContext.Provider value={draft} key={draft.id}>
            <DraftHeaderUI draft={draft} children={justify.root.renderSimple({ className: 'ml-auto' })} />
            {draft.shouldAutoStart && (
                <MessageInfoUI>Autorun active: this draft will execute when the form changes</MessageInfoUI>
            )}
            <RecompileUI app={draft.app} />
            <Frame
                base={0}
                style={toJS(containerStyle ?? defaultContainerStyle)}
                tw={[
                    //
                    'flex-1 flex flex-col p-2 gap-1',
                    run_justify(justify.value),
                    containerClassName,
                ]}
                onKeyUp={(ev) => {
                    // submit on meta+enter
                    if (ev.key === 'Enter' && (ev.metaKey || ev.ctrlKey)) {
                        ev.preventDefault()
                        ev.stopPropagation()
                        draft.start({})
                    }
                }}
            >
                {metadata?.help && (
                    <MessageInfoUI>
                        <MarkdownUI tw='_WidgetMardownUI w-full' markdown={metadata.help} />
                    </MessageInfoUI>
                )}

                {/* {metadata?.description && (
                    <BoxSubtle>
                        <MarkdownUI tw='_WidgetMardownUI text-sm italic px-1 w-full' markdown={metadata.description} />
                    </BoxSubtle>
                )} */}
                {metadata?.requirements && (
                    <InstallRequirementsBtnUI label='requirements' active={true} requirements={metadata.requirements} />
                )}
                <FormUI tw='pb-10' key={draft.id} field={draft.form} />
                <RevealUI
                    content={() => (
                        <div tw='overflow-auto bd1' style={{ maxHeight: '30rem' }}>
                            <ul>
                                {Object.keys(app.script.data.metafile?.inputs ?? {}).map((t, ix) => (
                                    <li key={ix}>{t}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                >
                    <div tw='subtle'>{Object.keys(app.script.data.metafile?.inputs ?? {}).length} files</div>
                </RevealUI>
            </Frame>
        </draftContext.Provider>
    )
    if (!wrapMobile) return OUT
    return (
        <div tw='flex flex-col items-center pt-2'>
            <SelectUI
                tw='w-full'
                options={() => [
                    { label: 'iPhone 5', value: 5 },
                    { label: 'iPhone 6', value: 6 },
                ]}
                onChange={null}
                getLabelText={(t): string => {
                    return t.label
                }}
            />
            <FramePhoneUI tw='m-auto' size={5}>
                {OUT}
            </FramePhoneUI>
        </div>
    )
})

/**
 * this is the root interraction widget
 * if a workflow need user-supplied infos, it will send an 'ask' request with a list
 * of things it needs to know.
 */
const ErrorPanelUI = observer(function ErrorPanelUI_(p: { children: React.ReactNode }) {
    return (
        <div tw='h-full'>
            <MessageErrorUI>
                <div>{p.children}</div>
            </MessageErrorUI>
        </div>
    )
})

export const AppCompilationErrorUI = observer(function AppCompilationErrorUI_(p: { app: CushyAppL }) {
    return (
        <ErrorPanelUI>
            <h3>invalid app</h3>
            <RecompileUI always app={p.app} />
            <pre tw='bg-black text-white text-xs'>{p.app.script.data.code}</pre>
        </ErrorPanelUI>
    )
})
