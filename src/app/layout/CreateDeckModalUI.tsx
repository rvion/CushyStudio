import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { createRef } from 'react'

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
