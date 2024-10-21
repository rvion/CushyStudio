import type { UnifiedCanvas } from './UnifiedCanvas'
import type { Image } from 'konva/lib/shapes/Image'

import Konva from 'konva'

export class KonvaGrid {
    hide = (): Image => this.image.hide()
    show = (): Image => this.image.show()

    image: Konva.Image

    constructor(public canvas: UnifiedCanvas) {
        const cellSize = 64
        const _canvas = document.createElement('canvas')
        _canvas.width = 200
        _canvas.height = 200
        const ctx = _canvas.getContext('2d')!
        for (let x = 0; x < 200; x++) {
            for (let y = 0; y < 200; y++) {
                ctx.fillStyle =
                    (x + y) % 2 === 0 //
                        ? '#656565'
                        : '#333333'
                ctx.fillRect(x, y, 1, 1)
            }
        }
        this.image = new Konva.Image({
            x: -100 * cellSize,
            y: -100 * cellSize,
            image: _canvas,
            width: 200 * cellSize,
            height: 200 * cellSize,
        })
        canvas.gridLayer.add(this.image)
    }
}
