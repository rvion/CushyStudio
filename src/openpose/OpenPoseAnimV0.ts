import { drawOpenPoseBones } from './drawPoseV2'
import samplePose1 from './json_inputs/32/001.json'
import samplePose2 from './json_inputs/32/002.json'
import samplePose3 from './json_inputs/32/003.json'
import samplePose4 from './json_inputs/32/004.json'
import samplePose5 from './json_inputs/32/005.json'
import samplePose6 from './json_inputs/32/006.json'
import samplePose7 from './json_inputs/32/007.json'
import samplePose8 from './json_inputs/32/008.json'
import samplePose9 from './json_inputs/32/009.json'

export class OpenPoseAnimV0 {
    poses = [
        //
        samplePose1,
        samplePose2,
        samplePose3,
        samplePose4,
        samplePose5,
        samplePose6,
        samplePose7,
        samplePose8,
        samplePose9,
    ]
    ctx: CanvasRenderingContext2D | null = null

    // @internal
    private intervalId: NodeJS.Timer | null = null

    ix = 0

    start = () => {
        if (this.intervalId) return
        this.intervalId = setInterval(() => this.draw(), 200)
    }

    stop = () => {
        if (!this.intervalId) return
        clearInterval(this.intervalId)
        this.intervalId = null
    }

    draw = () => {
        if (this.ctx == null) return
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
        drawOpenPoseBones(this.poses[this.ix++ % this.poses.length], this.ctx)
    }
}
