// import { observer } from 'mobx-react-lite'
// import { AppIllustrationUI } from 'src/cards/fancycard/AppIllustrationUI'
// import { DraftL } from 'src/models/Draft'
// import { AppEntryStyle, AppEntryStyleSelected } from 'src/panels/libraryUI/AppListStyles'
// import { useSt } from 'src/state/stateContext'

// export const DraftEntryUI = observer(function DraftEntryUI_(p: { draft: DraftL }) {
//     const st = useSt()
//     const draft = p.draft
//     const isSelected = st.currentDraft === draft
//     return (
//         <div
//             key={draft.id}
//             tw={[
//                 //
//                 'flex items-center gap-0.5',
//                 isSelected ? AppEntryStyleSelected : AppEntryStyle,
//             ]}
//         >
//             <div
//                 tw='btn btn-ghost btn-xs btn-square'
//                 onClick={() => {
//                     if (st.currentDraft?.id === draft.id) st.currentDraft = null
//                     draft.delete()
//                 }}
//             >
//                 <span className='material-symbols-outlined'>close</span>
//             </div>
//             <AppIllustrationUI app={draft.app} size='1.5rem' />
//             <div
//                 tw='cursor-pointer single-line-ellipsis flex-grow'
//                 onClick={() => {
//                     st.currentDraft = draft
//                     draft.openOrFocusTab()
//                     // st.layout.FOCUS_OR_CREATE('CurrentDraft', {}, 'LEFT_PANE_TABSET')
//                 }}
//             >
//                 {draft.data.title || draft.app.name}
//             </div>
//             <div
//                 tw='btn btn-ghost btn-xs btn-square'
//                 onClick={() => {
//                     st.layout.FOCUS_OR_CREATE('Draft', { draftID: draft.id }, 'LEFT_PANE_TABSET')
//                 }}
//             >
//                 <span className='material-symbols-outlined'>open_in_new</span>
//             </div>
//         </div>
//     )
// })
