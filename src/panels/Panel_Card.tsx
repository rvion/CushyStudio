// import type { CardPath } from 'src/cards/CardPath'

// import { observer } from 'mobx-react-lite'
// import { cwd } from 'process'
// import { useEffect } from 'react'
// import { Button, Message } from 'rsuite'
// import { useSt } from 'src/state/stateContext'
// import { openInVSCode } from 'src/utils/electron/openInVsCode'
// import { ActionDraftListUI } from '../widgets/drafts/ActionDraftListUI'
// import { Panel_Draft } from 'src/panels/Panel_Draft'

// export const Panel_Card = observer(function ActionFileUI_(p: { actionPath: CardPath }) {
//     const st = useSt()
//     const toolbox = st.library
//     const card = toolbox.getCard(p.actionPath)

//     useEffect(() => {
//         void card?.load()
//     }, [card])

//     if (card == null)
//         return (
//             <Message type='error'>
//                 <pre tw='bg-red-900'>A. ❌ action file {JSON.stringify(p.actionPath)} not found</pre>
//             </Message>
//         )

//     const defaultDraft = card?.drafts[0]
//     const errors =
//         card.errors.length > 0 ? ( //
//             <Message type='warning'>{JSON.stringify(card.errors, null, 4)}</Message>
//         ) : null

//     if (defaultDraft == null)
//         return (
//             <>
//                 <div tw='row items-center gap-2' style={{ fontSize: '1.7rem' }}>
//                     {/* TITLE */}
//                     <span>{card.displayName}</span>
//                     {/* EDIT */}
//                     <Button
//                         size='xs'
//                         color='blue'
//                         appearance='ghost'
//                         startIcon={<span className='material-symbols-outlined'>edit</span>}
//                         onClick={() => openInVSCode(cwd(), card.absPath)}
//                     >
//                         Edit
//                     </Button>
//                 </div>
//                 {/* {st.liveTime} */}
//                 {card.action == null ? (
//                     <Message type='error' showIcon>
//                         <pre tw='bg-red-900'>B. ❌ action not found</pre>
//                         <pre>loadRequested: {card.loadRequested ? '🟢' : '❌'}</pre>
//                         <pre tw='bg-red-900'>{JSON.stringify(card.errors)}</pre>
//                     </Message>
//                 ) : null}
//                 {errors}
//                 {/* DRAFT LIST */}
//                 <ActionDraftListUI card={card} />
//             </>
//         )

//     return <Panel_Draft draft={defaultDraft} />
// })
