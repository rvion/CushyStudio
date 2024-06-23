import type { UnifiedCanvas } from '../states/UnifiedCanvas'
import type { KonvaEventObject } from 'konva/lib/Node'

export class Tool {
    onStart() {}
    onStop() {}

    onMouseMove(
        //
        ev: KonvaEventObject<MouseEvent>,
        uc: UnifiedCanvas,
    ) {}
    onMouseDown(
        //
        ev: KonvaEventObject<MouseEvent>,
        uc: UnifiedCanvas,
    ) {}
    onMouseUp(
        //
        ev: KonvaEventObject<MouseEvent>,
        uc: UnifiedCanvas,
    ) {}
}
