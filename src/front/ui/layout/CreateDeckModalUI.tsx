import { observer } from 'mobx-react-lite'
import { Button, Input, Loader, Modal, Placeholder } from 'rsuite'
import { GithubUsernameInputUI } from './GithubAppBarInputUI'
import { makeAutoObservable } from 'mobx'
import { useSt } from 'src/front/FrontStateCtx'
import { DeckFolder } from 'src/library/Deck'

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
            <Modal.Header>
                <Modal.Title>
                    <b>Create your action pack !</b>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div tw='flex flex-col gap-3'>
                    <div>
                        <div>1. Make sure your github username is correct</div>
                        <GithubUsernameInputUI />
                    </div>
                    <div>
                        <div>2. Choose your action pack name</div>
                        <Input
                            //
                            onChange={(next) => (uist.deckName = next)}
                            value={uist.deckName}
                        ></Input>
                    </div>
                    {/* <Placeholder.Paragraph /> */}
                </div>
            </Modal.Body>
            <Modal.Footer>
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
            </Modal.Footer>
        </Modal>
    )
})
