import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from 'src/rsuite/shims'
import { DeckFolder } from 'src/cards/Deck'
import { useSt } from 'src/state/stateContext'
import { GithubUsernameInputUI } from './GithubUsernameInputUI'

export class CreateDeckModalState {
    constructor() {
        makeAutoObservable(this)
    }
    deckName: string = 'my-cushy-deck'
    open = false
    isCreating = false
    error: Maybe<string>
    setOpen = (next: boolean) => (this.open = next)
    handleOpen = () => this.setOpen(true)
    handleClose = () => this.setOpen(false)
}

export const CreateDeckModalUI = observer(function CreateDeckModalUI_(p: { uist: CreateDeckModalState }) {
    const st = useSt()
    const uist = p.uist
    return (
        <Modal open={uist.open} onClose={uist.handleClose}>
            <ModalHeader>
                <ModalTitle>
                    <b>Create your action pack !</b>
                </ModalTitle>
            </ModalHeader>
            <ModalBody>
                <div tw='flex flex-col gap-3'>
                    <div>
                        <div>1. Make sure your github username is correct</div>
                        <GithubUsernameInputUI />
                    </div>
                    <div>
                        <div>2. Choose your action pack name</div>
                        <Input
                            //
                            onChange={(ev) => (uist.deckName = ev.target.value)}
                            value={uist.deckName}
                        ></Input>
                    </div>
                    {/* <Placeholder.Paragraph /> */}
                </div>
            </ModalBody>
            <ModalFooter>
                <Button
                    //
                    // startIcon={}
                    loading={uist.isCreating}
                    onClick={async () => {
                        uist.isCreating = true
                        const res = await st.library.createDeck(`library/${st.githubUsername}/${uist.deckName}` as DeckFolder)
                        await new Promise((yes) => setTimeout(yes, 1_000))
                        uist.isCreating = false
                        uist.handleClose()
                    }}
                    appearance='primary'
                >
                    Ok
                </Button>
                <Button onClick={uist.handleClose} appearance='subtle'>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    )
})
