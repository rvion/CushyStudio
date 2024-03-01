import type { CushyAppL } from 'src/models/CushyApp'
import type { DraftL } from 'src/models/Draft'

import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useEffect, useLayoutEffect } from 'react'

import { draftContext } from '../../widgets/misc/useDraft'
import { MessageInfoUI } from '../MessageUI'
import { DraftHeaderUI } from './DraftHeaderUI'
import { RecompileUI } from './RecompileUI'
import { FormUI } from 'src/controls/FormUI'
import { InstallRequirementsBtnUI } from 'src/controls/REQUIREMENTS/Panel_InstallRequirementsUI'
import { MarkdownUI } from 'src/rsuite/MarkdownUI'
import { PhoneWrapperUI } from 'src/rsuite/PhoneWrapperUI'
import { SelectUI } from 'src/rsuite/SelectUI'
import { Message } from 'src/rsuite/shims'
import { useSt } from 'src/state/stateContext'
import { stringifyUnknown } from 'src/utils/formatters/stringifyUnknown'
import { JsonViewUI } from 'src/widgets/workspace/JsonViewUI'

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

    if (guiR.error)
        return (
            <>
                <DraftHeaderUI draft={draft} />
                <ErrorPanelUI>
                    <RecompileUI app={draft.app} />
                    <b>App failed to load</b>
                    <div>❌ {guiR.error}</div>
                    <div>{stringifyUnknown(guiR.error)}</div>
                </ErrorPanelUI>
            </>
        )

    // 5. render form
    const { containerClassName, containerStyle } = compiledApp.def ?? {}
    const defaultContainerStyle = {} // { margin: '0 auto' }

    const wrapMobile = st.isConfigValueEq('draft.mockup-mobile', true)
    const metadata = draft.app.executable_orExtract?.metadata
    // {/* <ActionDraftListUI card={card} /> */}
    const OUT = (
        <draftContext.Provider value={draft} key={draft.id}>
            <RecompileUI app={draft.app} />
            <div
                style={toJS(containerStyle ?? defaultContainerStyle)}
                tw={['flex-1 flex flex-col gap-1 px-2', containerClassName, 'bg-base-300']}
                onKeyUp={(ev) => {
                    // submit on meta+enter
                    if (ev.key === 'Enter' && (ev.metaKey || ev.ctrlKey)) {
                        ev.preventDefault()
                        ev.stopPropagation()
                        draft.start({})
                    }
                }}
            >
                <DraftHeaderUI draft={draft} />
                {draft.shouldAutoStart && (
                    <MessageInfoUI>Autorun active: this draft will execute when the form changes</MessageInfoUI>
                )}
                {metadata?.help && (
                    <MessageInfoUI>
                        <MarkdownUI tw='_WidgetMardownUI w-full' markdown={metadata.help} />
                    </MessageInfoUI>
                )}
                {metadata?.description && (
                    <MarkdownUI tw='_WidgetMardownUI italic px-1 text-gray-500 w-full' markdown={metadata.description} />
                )}
                {metadata?.requirements && (
                    <InstallRequirementsBtnUI label='requirements' active={true} requirements={metadata.requirements} />
                )}
                <div tw='pb-10'>
                    <FormUI key={draft.id} form={draft.form} />
                </div>
            </div>
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
            <PhoneWrapperUI tw='m-auto' size={5}>
                {OUT}
            </PhoneWrapperUI>
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
            <Message type='error'>{p.children}</Message>
        </div>
    )
})

export const AppCompilationErrorUI = observer(function AppCompilationErrorUI_(p: { app: CushyAppL }) {
    return (
        <ErrorPanelUI>
            <h3 tw='text-red-600'>invalid app</h3>
            <RecompileUI app={p.app} />
        </ErrorPanelUI>
    )
})
