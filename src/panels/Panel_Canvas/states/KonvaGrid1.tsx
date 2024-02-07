import type { UnifiedCanvas } from './UnifiedCanvas'
import Konva from 'konva'

export class KonvaGrid1 {
    constructor(public canvas: UnifiedCanvas) {
        const stage = canvas.stage
        const layer = new Konva.Layer()
        stage.add(layer)

        const xSnaps = 10 // Math.round(stage.width() / 100)
        const ySnaps = 10 // Math.round(stage.height() / 100)
        const cellWidth = 64 // stage.width() / xSnaps
        const cellHeight = 64 // stage.height() / ySnaps

        for (var i = 0; i < xSnaps; i++) {
            layer.add(
                new Konva.Line({
                    x: i * cellWidth,
                    points: [0, 0, 0, stage.height()],
                    stroke: 'rgba(255, 255, 255, 0.4)',
                    strokeWidth: 1,
                }),
            )
        }

        for (var i = 0; i < ySnaps; i++) {
            layer.add(
                new Konva.Line({
                    y: i * cellHeight,
                    points: [0, 0, stage.width(), 0],
                    stroke: 'rgba(255, 255, 255, 0.4)',
                    strokeWidth: 1,
                }),
            )
        }
    }
}
