import type { UnifiedCanvas } from '../states/UnifiedCanvas'
import type { KonvaEventObject } from 'konva/lib/Node'

export class Tool {
    onStart() {}
    onStop() {}

    /** return true if event is consumed */
    onMouseMove(
        //
        _ev: KonvaEventObject<MouseEvent>,
        _uc: UnifiedCanvas,
    ) {
        return false
    }

    /** return true if event is consumed */
    onMouseDown(
        //
        _ev: KonvaEventObject<MouseEvent>,
        _uc: UnifiedCanvas,
    ) {
        return false
    }

    /** return true if event is consumed */
    onMouseUp(
        //
        _ev: KonvaEventObject<MouseEvent>,
        _uc: UnifiedCanvas,
    ) {
        return false
    }

    /** return true if event is consumed */
    onScroll(
        //
        _ev: KonvaEventObject<MouseEvent>,
        _uc: UnifiedCanvas,
    ) {
        return false
    }
}
