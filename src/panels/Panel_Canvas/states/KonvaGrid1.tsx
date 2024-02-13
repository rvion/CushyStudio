import type { UnifiedCanvas } from './UnifiedCanvas'
import Konva from 'konva'

export class KonvaGrid1 {
    hide = () => this.layer.hide()
    show = () => this.layer.show()
    layer: Konva.Layer
    constructor(public canvas: UnifiedCanvas) {
        const cellSize = 64 // stage.width() / xSnaps
        const stage = canvas.stage
        const layer = new Konva.Layer({
            imageSmoothingEnabled: false,
        })
        this.layer = layer
        stage.add(layer)

        const _canvas = document.createElement('canvas')
        _canvas.width = 200
        _canvas.height = 200
        const ctx = _canvas.getContext('2d')!
        for (var x = 0; x < 200; x++) {
            for (var y = 0; y < 200; y++) {
                ctx.fillStyle =
                    (x + y) % 2 === 0 //
                        ? '#656565'
                        : '#333333'
                ctx.fillRect(x, y, 1, 1)
            }
        }

        layer.add(
            new Konva.Image({
                x: -100 * cellSize,
                y: -100 * cellSize,
                image: _canvas,
                width: 200 * cellSize,
                height: 200 * cellSize,
            }),
        )
    }
}
