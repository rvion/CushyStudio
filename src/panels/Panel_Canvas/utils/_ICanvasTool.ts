import type { IconName } from '../../../csuite/icons/icons'
import type { UnifiedCanvas } from '../states/UnifiedCanvas'
import type { UnifiedCanvasViewInfos } from '../types/RectSimple'
import type { KonvaEventObject } from 'konva/lib/Node'

import { Stroke } from './_StrokeInfo'

export type ToolPressPayload = {
    /** on press, a stroke is started */
    stroke: Stroke
    canvas: UnifiedCanvas
    infos: UnifiedCanvasViewInfos
    ev: KonvaEventObject<MouseEvent>
}

export type ToolMovePayload = {
    /** stroke is null when mouse is not pressed */
    stroke: Maybe<Stroke>
    canvas: UnifiedCanvas
    infos: UnifiedCanvasViewInfos
    ev: KonvaEventObject<MouseEvent>
}

export type ToolCommitPayload = {
    //
    stroke: Stroke
    canvas: UnifiedCanvas
    infos: UnifiedCanvasViewInfos
    ev: KonvaEventObject<MouseEvent>
}

export interface ICanvasTool {
    // ------------------------------------------------
    id: string
    category: string
    icon: IconName
    description: string

    // ------------------------------------------------
    /** always having the canvas readilly availalbe will help */
    canvas: UnifiedCanvas

    // ------------------------------------------------
    /**
     * when the tool is selected in the toolbar
     * usefull to set some extra stuff visible, if need be
     * or register some events
     */
    onSelect?: () => void

    /**
     * when the tool is deselected in the toolbar
     * usefull to hide some extra stuff, if need be.
     * */
    onDeselect?: () => void

    // ------------------------------------------------
    // simplified api (since most tools can be implemented with those)

    /** when a stroke starts */
    onPress?: (p: ToolPressPayload) => void

    /**
     * when mouse move; you can access stroke
     * state if the move is part of a stroke
     */
    onMove?: (p: ToolMovePayload) => void

    /** when the gesture finishes, regardless of it's a cancel or commit */
    onRelease?: (p: ToolCommitPayload) => void
}

// export interface CanvasTool extends ICanvasTool {}
// export abstract class CanvasTool implements ICanvasTool {}
