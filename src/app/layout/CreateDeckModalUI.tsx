import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import { createRef } from 'react'

import { useSt } from '../../state/stateContext'

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
