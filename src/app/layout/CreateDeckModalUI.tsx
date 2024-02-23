import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import { createRef } from 'react'

import { useSt } from 'src/state/stateContext'

export class CreateDeckModalState {
    constructor(public id = nanoid()) {
        makeAutoObservable(this)
    }
    ref = createRef<HTMLDialogElement>()
    deckName: string = 'cushy-package'
    open = false
    isCreating = false
    error: Maybe<string>
    setOpen = (next: boolean) => (this.open = next)
    handleOpen = () => {
        // @ts-ignore
        // document.getElementById(this.id)?.showModal()
        this.setOpen(true)
    }
    handleClose = () => this.setOpen(false)
}

// export const CreateDeckModalUI = observer(function CreateDeckModalUI_(p: { uist: CreateDeckModalState }) {
//     const st = useSt()
//     const uist = p.uist
//     return (
//         // {/* You can open the modal using document.getElementById('ID').showModal() method */}
//         <dialog id='my_modal_3' className='modal'>
//             <div className='modal-box'>
//                 <form method='dialog'>
//                     {/* if there is a button in form, it will close the modal */}
//                     <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>✕</button>
//                 </form>
//                 <b>Create your action pack !</b>
//                 {/* <h3 className="font-bold text-lg">Hello!</h3> */}
//                 <p className='py-4'>Press ESC key or click on ✕ button to close</p>
//             </div>
//         </dialog>
//         <Modal open={uist.open} onClose={uist.handleClose}>
//             <ModalHeader>
//                 <ModalTitle>
//                 </ModalTitle>
//             </ModalHeader>
//             <ModalBody>
//                 <div tw='flex flex-col gap-3'>
//                     <div>
//                         <div>1. Make sure your github username is correct</div>
//                         <GithubUsernameInputUI />
//                     </div>
//                     <div>
//                         <div>2. Choose your action pack name</div>
//                         <Input
//                             //
//                             onChange={(ev) => (uist.deckName = ev.target.value)}
//                             value={uist.deckName}
//                         ></Input>
//                     </div>
//                     {/* <Placeholder.Paragraph /> */}
//                 </div>
//             </ModalBody>
//             <ModalFooter>
//                 <Button
//                     //
//                     // startIcon={}
//                     loading={uist.isCreating}
//                     onClick={async () => {
//                         uist.isCreating = true
//                         const res = await st.library.createDeck(`library/${st.githubUsername}/${uist.deckName}` as DeckFolder)
//                         await new Promise((yes) => setTimeout(yes, 1_000))
//                         uist.isCreating = false
//                         uist.handleClose()
//                     }}
//                     appearance='primary'
//                 >
//                     Ok
//                 </Button>
//                 <Button onClick={uist.handleClose} appearance='subtle'>
//                     Cancel
//                 </Button>
//             </ModalFooter>
//         </Modal>
//     )
// })
