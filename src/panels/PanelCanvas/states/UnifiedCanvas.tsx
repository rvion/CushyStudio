import type { DraftL } from '../../../models/Draft'
import type { MediaImageL } from '../../../models/MediaImage'
import type { STATE } from '../../../state/state'
import type { UnifiedCanvasBrushMode, UnifiedCanvasTool } from '../tools/UnifiedCanvasTool'
import type { UnifiedCanvasViewInfos } from '../types/RectSimple'
import type { ICanvasTool } from '../utils/_ICanvasTool'
import type { UC2$ } from '../V2/ucV2'
import type { UnifiedStep } from './UnifiedStep'
import type { Viewport } from 'pixi-viewport'
import type { Application, Renderer } from 'pixi.js'

import Konva from 'konva'
import { makeAutoObservable, observable } from 'mobx'
import { nanoid } from 'nanoid'
import { createRef } from 'react'

import { toastError } from '../../../csuite/utils/toasts'
import { setupStage } from '../events/setupStage'
import { ToolGenerate } from '../tools/ToolGenerate'
import { ToolMask } from '../tools/ToolMask'
import { ToolMove } from '../tools/ToolMove'
import { ToolPaint } from '../tools/ToolPaint'
import { ToolStamp } from '../tools/ToolStamp'
import { KonvaGrid } from './KonvaGrid1'
import { UnifiedImage } from './UnifiedImage'
import { UnifiedMask } from './UnifiedMask'
import { UnifiedSelection } from './UnifiedSelection'

export class UnifiedCanvas {
    app: Application<Renderer> | null = null
    updateViewportInfos = (vp: Viewport): void => {
        this.viewportInfos.x = vp.x
        this.viewportInfos.y = vp.y
        this.viewportInfos.width = vp.width
        this.viewportInfos.height = vp.height
        this.viewportInfos.scaleX = vp.scale.x
        this.viewportInfos.scaleY = vp.scale.y
    }
    viewportInstance: Maybe<Viewport> = null
    viewportInfos = {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        scaleX: 1,
        scaleY: 1,
    }

    cursor = {
        xInWorld: 0,
        yInWorld: 0,
        xInScreen: 0,
        yInScreen: 0,
    }

    snapToGrid = true
    snapSize = 64
    usePenPressure = true
    enableOverlay = true
    toolShelf = {
        visible: true,
        size: cushy.preferences.interface.value.toolBarIconSize,
    }
    rootRef = createRef<HTMLDivElement>()
    currentDraft: DraftL | null = null

    // tools V2 ----------------------------------------------------------------
    toolGenerate = new ToolGenerate(this)
    toolPaint = new ToolPaint(this)
    toolMove = new ToolMove(this)
    toolMask = new ToolMask(this)
    toolStamp = new ToolStamp(this)
    allTools = [
        //
        this.toolGenerate,
        this.toolPaint,
        this.toolMove,
        this.toolMask,
        this.toolStamp,
    ]
    private _currentTool: ICanvasTool = this.toolMove
    get currentTool(): ICanvasTool {
        return this._currentTool
    }
    set currentTool(tool: ICanvasTool) {
        this._currentTool.onDeselect?.()
        this._currentTool = tool
        this._currentTool.onSelect?.()
    }

    // UNDO SYSTEM ---------------------------------------------------
    redo = (): void => {
        const last = this._redoBuffer.pop()
        if (last == null) return void toastError('Nothing to redo')
        last()
        // this._undoBuffer.push(last)
    }

    undo = (): void => {
        const last = this._undoBuffer.pop()
        if (last == null) return void toastError('Nothing to undo')
        last()
        // this._redoBuffer.push(last)
    }

    _undoBuffer: (() => void)[] = []
    _redoBuffer: (() => void)[] = []

    get canUndo(): boolean {
        return this._undoBuffer.length > 0
    }

    get canRedo(): boolean {
        return this._redoBuffer.length > 0
    }

    addToUndo = (fn: () => void): void => {
        this._undoBuffer.push(fn)
        this._redoBuffer = []
    }

    // ---------------------------------------------------

    activeSelection: UnifiedSelection
    private _activeMask: UnifiedMask
    get activeMask(): UnifiedMask {
        return this._activeMask
    }

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

    get pointerPosition(): {
        x: number
        y: number
    } {
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
    setBrushSize = (size: number): void => {
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

    /** used as container id for potential Portals to display html over122ays */
    uid = nanoid()

    constructor(
        public st: STATE,
        public ucv2: UC2$['$Field'],
    ) {
        this.stage = new Konva.Stage({ container: this.containerDiv, width: 512, height: 512 })

        // basic core layers
        this.gridLayer = new Konva.Layer({ imageSmoothingEnabled: false })
        this.imageLayer = new Konva.Layer()
        this.tempLayer = new Konva.Layer()
        this.stage.add(this.gridLayer, this.imageLayer, this.tempLayer)
        this.grid = new KonvaGrid(this)
        this.tempLayer.opacity(0.5)
        this.tempLayer.add(this.brush)
        this.images = []

        // ------------------------------

        const selection = this.addSelection()
        this.activeSelection = selection
        this.activeSelection.hide()

        const mask = this.addMask()
        this._activeMask = mask
        // this.activeMask = mask

        makeAutoObservable(this, {
            _undoBuffer: observable.shallow,
            _redoBuffer: observable.shallow,
        })
        setupStage(this)
    }

    addImage = (img: MediaImageL, position?: { x: number; y: number }): void => {
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
