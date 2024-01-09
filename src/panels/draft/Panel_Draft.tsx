import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { CushyAppL } from 'src/models/CushyApp'
import { DraftL } from 'src/models/Draft'
import { PhoneWrapperUI } from 'src/rsuite/PhoneWrapperUI'
import { SelectUI } from 'src/rsuite/SelectUI'
import { Message } from 'src/rsuite/shims'
import { useSt } from 'src/state/stateContext'
import { stringifyUnknown } from 'src/utils/formatters/stringifyUnknown'
import { WidgetUI } from '../../controls/widgets/WidgetUI'
import { ResultWrapperUI } from '../../widgets/misc/ResultWrapperUI'
import { draftContext } from '../../widgets/misc/useDraft'
import { DraftHeaderUI } from './DraftHeaderUI'

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
    useEffect(() => {
        if (draft?.name != null) st.layout.syncTabTitle('Draft', { draftID: draft.id }, draft.name)
    }, [draft?.name])

    // 1. draft
    if (draft == null) return <ErrorPanelUI>Draft not found</ErrorPanelUI>

    // 2. app
    const app = draft.app
    if (app == null) return <ErrorPanelUI>File not found</ErrorPanelUI>

    // 3. compiled app
    const compiledApp = app.executable
    if (compiledApp == null) return <AppCompilationErrorUI app={app} />

    // 4. get form
    const guiR = draft.form
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

    const wrapMobile = st.isConfigValueEq('draft.mockup-mobile', true)
    // {/* <ActionDraftListUI card={card} /> */}
    const OUT = (
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
                <div tw='pb-80 px-1'>
                    <ResultWrapperUI
                        //
                        res={draft.form}
                        whenValid={(req) => <WidgetUI widget={req} />}
                    />
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
    // const app = p.app
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
