import type { DraftL } from '../../models/Draft'
import type { PanelState } from '../../router/PanelState'

import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect } from 'react'

import { openFolderInOS } from '../../app/layout/openExternal'
import { Button } from '../../csuite/button/Button'
import { Frame } from '../../csuite/frame/Frame'
import { MarkdownUI } from '../../csuite/markdown/MarkdownUI'
import { MessageErrorUI } from '../../csuite/messages/MessageErrorUI'
import { MessageInfoUI } from '../../csuite/messages/MessageInfoUI'
import { ProvenanceCtx } from '../../csuite/provenance/Provenance'
import { SelectUI } from '../../csuite/select/SelectUI'
import { SQLITE_true } from '../../csuite/types/SQLITE_boolean'
import { QuickTableUI } from '../../csuite/utils/quicktable'
import { FramePhoneUI } from '../../csuite/wrappers/FramePhoneUI'
import { InstallRequirementsBtnUI } from '../../manager/REQUIREMENTS/InstallRequirementsBtnUI'
import { usePanel } from '../../router/usePanel'
import { draftContext } from '../../widgets/misc/useDraft'
import { AppCompilationErrorUI } from './AppCompilationErrorUI'
import { DraftHeaderUI } from './DraftHeaderUI'
import { ErrorPanelUI } from './ErrorPanelUI'
import { run_justify, ui_justify } from './prefab_justify'
import { RecompileUI } from './RecompileUI'

export type PanelDraftProps = {
   draftID: DraftID
}

export const PanelDraftUI = observer(function PanelDraftUI_(p: PanelDraftProps) {
   // 1. get draft
   const draft = typeof p.draftID === 'string' ? cushy.db.draft.get(p.draftID) : p.draftID
   return <DraftUI draft={draft} />
})

export const DraftUI = observer(function Panel_Draft_(p: { draft: Maybe<DraftL> }) {
   const draft = p.draft
   const justify = cushy.forms.use(ui_justify)

   // useEffect(() => draft?.AWAKE(), [draft?.id])
   const panel: PanelState<any> = usePanel()
   // ensure
   useLayoutEffect(() => {
      if (draft?.name != null)
         cushy.layout.syncTabTitle('Draft', { draftID: draft.id }, `Draft (${draft.name})`)
      // if (panel.def.tabColor) panel.setTabColor('!bg-blue-900')
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
            <div>draft.form is null (err. #syZcdJZpwY)</div>
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

   const wrapMobile = cushy.isConfigValueEq('draft.mockup-mobile', true)
   const metadata = draft.app.executable_orExtract?.metadata
   // {/* <ActionDraftListUI card={card} /> */}
   const fpath = draft.file.fPath
   let OUT = (
      <draftContext.Provider value={draft} key={draft.id}>
         {/* <DraftHeaderUI
                draft={draft}
                children={justify.root.UI({
                    classNameForShell: 'ml-auto',
                    MenuBtn: false,
                    Extra: false,
                    UndoBtn: false,
                    LabelText: false,
                })}
            /> */}
         <DraftHeaderUI draft={draft} />
         <Frame tw={'overflow-auto'}>
            {fpath.existsSync ? null : (
               <MessageErrorUI title='File Does not exists'>
                  <QuickTableUI
                     dense
                     rows={fpath.hierarchy.map((str) => ({
                        exists: str.existsSync ? '✅' : '❌',
                        path: JSON.stringify(str.path),
                     }))}
                  ></QuickTableUI>
                  {/* {fpath.hierarchy.map} */}
                  <Button onClick={() => openFolderInOS(draft.file.folderAbs)}>open folder</Button>
               </MessageErrorUI>
            )}
            {draft.shouldAutoStart && (
               <MessageInfoUI>Autorun active: this draft will execute when the form changes</MessageInfoUI>
            )}
            <RecompileUI app={draft.app} />
            <Frame
               base={0}
               style={toJS(containerStyle ?? defaultContainerStyle)}
               tw={[
                  //
                  'flex flex-1 flex-col gap-1 p-2',
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
               {app.data.showInfo === SQLITE_true && metadata?.help && (
                  // <MessageInfoUI>
                  <MarkdownUI tw='_WidgetMardownUI w-full' markdown={metadata.help} />
                  // </MessageInfoUI>
               )}
               {/* {metadata?.description && (
                    <BoxSubtle>
                        <MarkdownUI tw='_WidgetMardownUI text-sm italic px-1 w-full' markdown={metadata.description} />
                    </BoxSubtle>
                )} */}
               {metadata?.requirements && (
                  <InstallRequirementsBtnUI
                     label='requirements'
                     active={true}
                     requirements={metadata.requirements}
                  />
               )}
               {draft.form && (
                  <draft.form.UI //
                     rule={draft.app.layout ?? undefined}
                     // global={{ Shell: ShellMobileUI }}
                  />
               )}
            </Frame>
         </Frame>
      </draftContext.Provider>
   )
   OUT = <ProvenanceCtx.Provider value={draft.provenance} children={OUT} />
   if (!wrapMobile) return OUT
   return (
      <div tw='flex flex-col items-center pt-2'>
         <SelectUI
            tw='w-full'
            options={() => [
               { label: 'iPhone 5', value: 5 },
               { label: 'iPhone 6', value: 6 },
            ]}
            onOptionToggled={null}
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
