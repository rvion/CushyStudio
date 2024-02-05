import type { UnifiedCanvas } from './UnifiedCanvas'
import Konva from 'konva'

export class KonvaGrid1 {
    // stage: Konva.Stage
    constructor(public canvas: UnifiedCanvas) {
        // var width = window.innerWidth
        // var height = window.innerHeight
        // this.stage = new Konva.Stage({
        //     container: 'container',
        //     width: width,
        //     height: height,
        // })
        // const layer = new Konva.Layer()
        // this.stage.add(layer)
        // const xSnaps = Math.round(this.stage.width() / 100)
        // const ySnaps = Math.round(this.stage.height() / 100)
        // const cellWidth = this.stage.width() / xSnaps
        // const cellHeight = this.stage.height() / ySnaps
        // for (var i = 0; i < xSnaps; i++) {
        //     layer.add(
        //         new Konva.Line({
        //             x: i * cellWidth,
        //             points: [0, 0, 0, this.stage.height()],
        //             stroke: 'rgba(0, 0, 0, 0.2)',
        //             strokeWidth: 1,
        //         }),
        //     )
        // }
        // for (var i = 0; i < ySnaps; i++) {
        //     layer.add(
        //         new Konva.Line({
        //             y: i * cellHeight,
        //             points: [0, 0, this.stage.width(), 0],
        //             stroke: 'rgba(0, 0, 0, 0.2)',
        //             strokeWidth: 1,
        //         }),
        //     )
        // }
    }
}
