import type { MediaImageL } from 'src/models/MediaImage'
import type { STATE } from 'src/state/state'

import Konva from 'konva'
import { makeAutoObservable } from 'mobx'
import { createRef } from 'react'
import { onWheelScrollCanvas } from '../behaviours/onWheelScrollCanvas'
import { KonvaGrid1 } from './KonvaGrid1'
import { UnifiedSelection } from './UnifiedSelection'
import { UnifiedImage } from './UnifiedImage'
import { UnifiedMask, setupStageForPainting } from './UnifiedMask'

export class UnifiedCanvas {
    snapToGrid = true
    snapSize = 64
    rootRef = createRef<HTMLDivElement>()

    activeSelection: UnifiedSelection | null = null
    activeMask: UnifiedMask | null = null

    mode: 'mask' | 'move' = 'move'
    maskTool: 'paint' | 'erase' = 'paint'
    maskColor = 'red'
    maskOpacity = 0.5
    maskToolSize: number = 32

    _isPaint = false
    _lastLine: Konva.Line | null = null

    // immutable base for calculations
    readonly base = Object.freeze({ width: 512, height: 512 })
    images: UnifiedImage[]
    masks: UnifiedMask[] = []
    selections: UnifiedSelection[] = []
    grid: KonvaGrid1
    TEMP = document.createElement('div')
    stage: Konva.Stage
    constructor(public st: STATE, baseImage: MediaImageL) {
        this.stage = new Konva.Stage({ container: this.TEMP, width: 512, height: 512 })
        this.images = [new UnifiedImage(this, baseImage)]
        this.stage.on('wheel', onWheelScrollCanvas)
        this.grid = new KonvaGrid1(this)
        this.addSelection()
        makeAutoObservable(this)
        setupStageForPainting(this)
    }

    addImage = (img: MediaImageL) => {
        this.images.push(new UnifiedImage(this, img))
    }

    addMask = (img?: MediaImageL) => {
        this.masks.push(new UnifiedMask(this, img))
        this.mode = 'mask'
    }

    addSelection = () => {
        this.selections.push(new UnifiedSelection(this))
    }
}
