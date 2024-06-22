import type { DraftL } from '../../../models/Draft'
import type { MediaImageL } from '../../../models/MediaImage'
import type { STATE } from '../../../state/state'
import type { UnifiedCanvasViewInfos } from '../types/RectSimple'
import type { KonvaEventObject } from 'konva/lib/Node'

import Konva from 'konva'
import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { createRef } from 'react'

import { toastError } from '../../../csuite/utils/toasts'
import { onMouseMoveCanvas } from '../behaviours/onMouseMoveCanvas'
import { onWheelScrollCanvas } from '../behaviours/onWheelScrollCanvas'
import { setupStageForPainting } from '../behaviours/setupStageForPainting'
import { KonvaGrid } from './KonvaGrid1'
import { UnifiedCanvasBrushMode, UnifiedCanvasTool } from './UnifiedCanvasTool'
import { UnifiedImage } from './UnifiedImage'
import { UnifiedMask } from './UnifiedMask'
import { UnifiedSelection } from './UnifiedSelection'
import { UnifiedStep } from './UnifiedStep'

export class UnifiedCanvas {
    snapToGrid = true
    snapSize = 64
    usePenPressure = true
    rootRef = createRef<HTMLDivElement>()
    currentDraft: DraftL | null = null
    // ---------------------------------------------------
    undo = () => {
        const last = this.undoBuffer.pop()
        if (last == null) return toastError('Nothing to undo')
        last()
    }
    undoBuffer: (() => void)[] = []
    // ---------------------------------------------------

    activeSelection: UnifiedSelection
    private _activeMask: UnifiedMask
    get activeMask() { return this._activeMask } // prettier-ignore
    set activeMask(mask: UnifiedMask) {
        this._activeMask = mask
        for (const mask of this.masks) mask.layer.hide()
        if (mask == null) return
        mask.layer.show()
        mask.layer.moveToTop()
    }

    tool: UnifiedCanvasTool = 'none'
    brushMode: UnifiedCanvasBrushMode = 'paint'
    maskToolSize: number = 32
    maskColor = 'red'
    maskOpacity = 0.5

    _lastLine: Konva.Line | null = null

    get pointerPosition() {
        return {
            x: this.infos.viewPointerX,
            y: this.infos.viewPointerY,
        }
    }

    infos: UnifiedCanvasViewInfos = {
        canvasX: 0,
        canvasY: 0,
        scale: 1,
        viewPointerX: 0,
        viewPointerY: 0,
        viewportPointerX: 0,
        viewportPointerY: 0,
        isDown: false,
    }

    onWheel = (e: any) => {
        //
    }

    brush = new Konva.Circle({
        fill: this.brushMode === 'paint' ? 'black' : 'white',
        stroke: 'black',
        // strokeWidth: this.maskToolSize,
        radius: this.maskToolSize / 2,
        opacity: this.maskOpacity,
    })

    enable_none = () => {
        this.tool = 'none'
        this.disable_generate()
        this.disable_mask()
        this.disable_paint()
        this.disable_move()
    }
    disable_none = () => {}
    enable_generate = () => {
        this.tool = 'generate'
        this.activeSelection.show()
        this.disable_mask()
        this.disable_paint()
        this.disable_move()
        this.disable_none()
    }
    disable_generate = () => {
        this.activeSelection.hide()
    }
    enable_mask = () => {
        this.tool = 'mask'
        this.disable_generate()
        this.disable_paint()
        this.disable_move()
        this.disable_none()
    }
    disable_mask = () => {}
    enable_paint = () => {
        this.tool = 'paint'
        this.disable_generate()
        this.disable_mask()
        this.disable_move()
        this.disable_none()
    }
    disable_paint = () => {}
    enable_move = () => {
        this.tool = 'move'
        this.disable_generate()
        this.disable_mask()
        this.disable_paint()
        this.disable_none()
    }
    disable_move = () => {}

    onKeyDown = (e: any) => {
        if (e.key === '0') { this.enable_none(); return } // prettier-ignore
        if (e.key === '1') { this.enable_generate(); return } // prettier-ignore
        if (e.key === '2') { this.enable_mask(); return } // prettier-ignore
        if (e.key === '3') { this.enable_paint(); return } // prettier-ignore
        if (e.key === '4') { this.enable_move(); return } // prettier-ignore
        if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
            this.undo()
        }
        e.preventDefault()
    }

    // immutable base for calculations
    readonly base = Object.freeze({ width: 512, height: 512 })
    images: UnifiedImage[]
    steps: UnifiedStep[] = []
    masks: UnifiedMask[] = []
    selections: UnifiedSelection[] = []
    grid: KonvaGrid
    containerDiv = document.createElement('div')

    /*
        layer order:
        [
            // background
            gridLayer: base grid
            // validated images
            image[].layer commited images
            // pending changes
            unifiedSteps[]: proposed changes
            // masking stuff
            tempLayer: current line being drawn when in paint mode
            mask[].layer manually drawn or imported masks, each a differnt color, slighly transparent
        ]
    */
    stage: Konva.Stage
    gridLayer: Konva.Layer
    tempLayer: Konva.Layer // to hold the line currently being drawn
    imageLayer: Konva.Layer

    /** used as container id for potential Portals to display html overlays */
    uid = nanoid()

    constructor(
        public st: STATE,
        baseImage: MediaImageL,
    ) {
        // core layers
        this.stage = new Konva.Stage({ container: this.containerDiv, width: 512, height: 512 })
        this.gridLayer = new Konva.Layer({ imageSmoothingEnabled: false })
        this.imageLayer = new Konva.Layer()
        this.tempLayer = new Konva.Layer()
        this.stage.add(this.gridLayer, this.imageLayer, this.tempLayer)

        // ------------------------------
        this.grid = new KonvaGrid(this)
        this.tempLayer.opacity(0.5)
        this.tempLayer.add(this.brush)

        this.images = [new UnifiedImage(this, baseImage)]
        this.stage.on('wheel', (e: KonvaEventObject<WheelEvent>) => onWheelScrollCanvas(this, e))
        this.stage.on('mousemove', (e: KonvaEventObject<MouseEvent>) => onMouseMoveCanvas(this, e))

        // ------------------------------

        const selection = this.addSelection()
        this.activeSelection = selection
        const mask = this.addMask()
        this._activeMask = mask
        // this.activeMask = mask

        makeAutoObservable(this)
        setupStageForPainting(this)
    }

    addImage = (img: MediaImageL, position?: { x: number; y: number }) => {
        this.images.push(new UnifiedImage(this, img, position))
    }

    addMask = (img?: MediaImageL): UnifiedMask => {
        const mask = new UnifiedMask(this, img)
        this.masks.push(mask)
        this.tool = 'mask'
        return mask
    }

    addSelection = (): UnifiedSelection => {
        const selection = new UnifiedSelection(this)
        this.selections.push(selection)
        return selection
    }
}
