import { makeAutoObservable } from 'mobx'
import { UnifiedSelection } from './UnifiedSelection'
import type { MediaImageL } from 'src/models/MediaImage'
import type { STATE } from 'src/state/state'
import { KonvaGrid1 } from './KonvaGrid1'

export class UnifiedCanvas {
    snapToGrid = true
    snapSize = 64

    activeSelection: UnifiedSelection | null = null

    // immutable base for calculations
    readonly base = Object.freeze({
        width: 512,
        height: 512,
    })

    images: { img: MediaImageL }[]
    masks: { img: MediaImageL }[] = []
    selections: UnifiedSelection[] = []

    grid = new KonvaGrid1(this)

    constructor(public st: STATE, baseImage: MediaImageL) {
        this.images = [{ img: baseImage }]
        this.addSelection()
        makeAutoObservable(this)
    }

    addSelection = () => {
        this.selections.push(new UnifiedSelection(this))
    }
}
