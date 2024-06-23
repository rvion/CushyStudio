import type { DraftL } from '../../../models/Draft'
import type { MediaImageL } from '../../../models/MediaImage'
import type { STATE } from '../../../state/state'
import type { Tool } from '../tools/Tool'
import type { UnifiedCanvasViewInfos } from '../types/RectSimple'
import type { KonvaEventObject } from 'konva/lib/Node'

import Konva from 'konva'
import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { createRef } from 'react'

import { toastError } from '../../../csuite/utils/toasts'
import { moveBehaviour_updatePointerInfos } from '../behaviours/moveBehaviour_updatePointerInfos'
import { scrollBehavior_zoomCanvas } from '../behaviours/scrollBehavior_zoomCanvas'
import { setupStageForPainting } from '../behaviours/setupStageForPainting'
import { ToolGenerate } from '../tools/ToolGenerate'
import { ToolMask } from '../tools/ToolMask'
import { ToolMove } from '../tools/ToolMove'
import { ToolNone } from '../tools/ToolNone'
import { ToolPaint } from '../tools/ToolPaint'
import { ToolStamp } from '../tools/ToolStamp'
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
    enableOverlay = true

    toolShelf = { visible: true, size: cushy.preferences.interface.value.toolBarIconSize }

    rootRef = createRef<HTMLDivElement>()
    currentDraft: DraftL | null = null

    // tools V2 ----------------------------------------------------------------
    toolGenerate = new ToolGenerate(this)
    toolNone = new ToolNone(this)
    toolPaint = new ToolPaint(this)
    toolMove = new ToolMove(this)
    toolMask = new ToolMask(this)
    toolStamp = new ToolStamp(this)
    allTools = [
        //
        this.toolNone,
        this.toolGenerate,
        this.toolPaint,
        this.toolMove,
        this.toolMask,
        this.toolStamp,
    ]
    _currentTool: Tool = this.toolNone
    get currentTool(): Tool {
        return this._currentTool
    }
    set currentTool(tool: Tool) {
        this._currentTool.onStop()
        this._currentTool = tool
        this._currentTool.onStart()
    }

    // backwards compatibility utils; to remove later
    enable_none = () => (this.currentTool = this.toolNone)
    enable_generate = () => (this.currentTool = this.toolGenerate)
    enable_mask = () => (this.currentTool = this.toolMask)
    enable_paint = () => (this.currentTool = this.toolPaint)
    enable_move = () => (this.currentTool = this.toolMove)

    // UNDO SYSTEM ---------------------------------------------------
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

    // ----------------------------------------------------------------------
    tool: UnifiedCanvasTool = 'none'
    brushMode: UnifiedCanvasBrushMode = 'paint'
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

    // BRUSH -------------------------------------------------
    maskToolSize: number = 32
    brush = new Konva.Circle({
        fill: this.brushMode === 'paint' ? 'black' : 'white',
        stroke: 'black',
        // strokeWidth: this.maskToolSize,
        radius: this.maskToolSize / 2,
        opacity: this.maskOpacity,
    })
    setBrushSize = (size: number) => {
        this.maskToolSize = size
        this.brush.radius(size / 2)
    }
    // -------------------------------------------------

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
        this.stage = new Konva.Stage({ container: this.containerDiv, width: 512, height: 512 })
        this.gridLayer = new Konva.Layer({ imageSmoothingEnabled: false })
        this.imageLayer = new Konva.Layer()
        this.tempLayer = new Konva.Layer()
        this.stage.add(this.gridLayer, this.imageLayer, this.tempLayer)
        this.grid = new KonvaGrid(this)
        this.tempLayer.opacity(0.5)
        this.tempLayer.add(this.brush)
        this.images = [new UnifiedImage(this, baseImage)]

        this.stage.on('wheel', (e: KonvaEventObject<WheelEvent>) => {
            const consumed = this.currentTool.onScroll(e, this)
            if (consumed) return
            scrollBehavior_zoomCanvas(this, e)
        })

        this.stage.on('mousemove', (e: KonvaEventObject<MouseEvent>) => {
            moveBehaviour_updatePointerInfos(e, this)
            this.currentTool.onMouseMove?.(e, this)
        })

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
