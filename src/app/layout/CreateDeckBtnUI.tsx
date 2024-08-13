// import { observer } from 'mobx-react-lite'
// import { useMemo } from 'react'
// import { Button } from '../../rsuite/shims'
// import { useSt } from '../../state/stateContext'
// import { CreateDeckModalState } from './CreateDeckModalUI'
// import { GithubUsernameInputUI } from './GithubUsernameInputUI'
// import { PackageRelPath } from '../../cards/Pkg'

// export const CreateDeckBtnUI = observer(function CreateDeckBtnUI_(p: {}) {
//     const st = useSt()
//     const uist = useMemo(() => new CreateDeckModalState(), [])
//     return (
//         <div>
//             <Button
//                 tw='btn-sm'
//                 onClick={uist.handleOpen}
//                 look='primary'
//                 color='green'
//                 icon={<span className='material-symbols-outlined'>add</span>}
//             >
//                 Create App
//             </Button>

//             {uist.open && (
//                 <dialog open id={uist.id} className='modal' ref={uist.ref}>
//                     <div className='modal-box'>
//                         <form method='dialog'>
//                             {/* if there is a button in form, it will close the modal */}
//                             <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>✕</button>
//                         </form>
//                         <b>Create your action pack !</b>
//                         <div>
//                             <div tw='flex flex-col gap-3'>
//                                 <div>
//                                     <div>1. Make sure your github username is correct</div>
//                                     <GithubUsernameInputUI />
//                                 </div>
//                                 <div>
//                                     <div>2. Choose your action pack name</div>
//                                     <input
//                                         //
//                                         type='text'
//                                         onChange={(ev) => (uist.deckName = ev.target.value)}
//                                         value={uist.deckName}
//                                     />
//                                 </div>
//                                 {/* <Placeholder.Paragraph /> */}
//                             </div>
//                             <Button
//                                 //
//                                 // startIcon={}
//                                 loading={uist.isCreating}
//                                 onClick={async () => {
//                                     uist.isCreating = true
//                                     const res = await st.library.createDeck(
//                                         `library/${st.githubUsername}/${uist.deckName}` as PackageRelPath,
//                                     )
//                                     await new Promise((yes) => setTimeout(yes, 1_000))
//                                     uist.isCreating = false
//                                     uist.handleClose()
//                                 }}
//                                 look='primary'
//                             >
//                                 Ok
//                             </Button>
//                             <Button onClick={uist.handleClose} look='subtle'>
//                                 Cancel
//                             </Button>
//                         </div>
//                         {/* <h3 className="font-bold text-lg">Hello!</h3> */}
//                         <p className='py-4'>Press ESC key or click on ✕ button to close</p>
//                     </div>
//                 </dialog>
//             )}
//             {/* <CreateDeckModalUI uist={uist} /> */}
//         </div>
//     )
// })
