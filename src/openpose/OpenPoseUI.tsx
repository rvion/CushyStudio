import * as I from '@fluentui/react-icons'
import { observer } from 'mobx-react-lite'
import { drawOpenPoseBones } from './drawPoseV2'
const CANVAS_WIDTH = 640
const CANVAS_HEIGHT = 480

// Get the canvas element from the HTML document
const canvas = document.getElementById('canvas')

import { Button } from '@fluentui/react-components'
import samplePose1 from './json_inputs/32/010.json'
import { OpenPoseAnimV0 } from './OpenPoseAnimV0'

const TEST = new OpenPoseAnimV0()

export const OpenPoseViewerUI = observer(function OpenPoseViewerUI_(p: {}) {
    return (
        <div>
            <div>
                <Button icon={<I.Play24Regular />} />
                <Button icon={<I.Pause24Regular />} />
            </div>
            <canvas
                id='test'
                ref={(canvas) => {
                    if (!canvas) return
                    const ctx = canvas.getContext('2d')
                    if (!ctx) return
                    // Set the canvas dimensions
                    canvas.width = CANVAS_WIDTH
                    canvas.height = CANVAS_HEIGHT
                    TEST.ctx = ctx
                    TEST.start()

                    // drawOpenPoseBones(samplePose1, ctx)
                    // opd.renderPoses(ctx, [samplePose1.people[0].face_keypoints_2d], CANVAS_WIDTH, CANVAS_HEIGHT)
                }}
            ></canvas>
        </div>
    )
})
