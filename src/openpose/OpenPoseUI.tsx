import { observer } from 'mobx-react-lite'
import { drawOpenPoseBones } from './drawPoseV1'

const CANVAS_WIDTH = 640
const CANVAS_HEIGHT = 480

// Get the canvas element from the HTML document
const canvas = document.getElementById('canvas')

import samplePose1 from './json_inputs/32/010.json'
import samplePose2 from './sample1.json'

export const OpenPoseViewerUI = observer(function OpenPoseViewerUI_(p: {}) {
    return (
        <div>
            <canvas
                id='test'
                ref={(canvas) => {
                    if (!canvas) return
                    const ctx = canvas.getContext('2d')
                    if (!ctx) return
                    // Set the canvas dimensions
                    canvas.width = CANVAS_WIDTH
                    canvas.height = CANVAS_HEIGHT
                    drawOpenPoseBones(samplePose1, ctx)
                }}
            ></canvas>
        </div>
    )
})
