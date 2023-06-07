import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'

const CANVAS_WIDTH = 640
const CANVAS_HEIGHT = 480

// Get the canvas element from the HTML document
const canvas = document.getElementById('canvas')

import { useMemo } from 'react'
import { IconButton } from 'rsuite'
import { OpenPoseAnimV0 } from './OpenPoseAnimV0'
import { useSt } from 'src/front/FrontStateCtx'

export const OpenPoseViewerUI = observer(function OpenPoseViewerUI_(p: {}) {
    const workspace = useSt()
    const OPAnim = useMemo(() => new OpenPoseAnimV0(workspace), [])

    return (
        <div>
            <div>
                <IconButton onClick={() => OPAnim.start()} icon={<I.PlayOutline />} />
                <IconButton onClick={() => OPAnim.stop()} icon={<I.PauseOutline />} />
                <IconButton onClick={() => OPAnim.drawAllToPngAndSaveLocally()} icon={<I.Scatter />}>
                    Draw all to png and save locally
                </IconButton>
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
                    OPAnim.ctx = ctx

                    // drawOpenPoseBones(samplePose1, ctx)
                    // opd.renderPoses(ctx, [samplePose1.people[0].face_keypoints_2d], CANVAS_WIDTH, CANVAS_HEIGHT)
                }}
            ></canvas>
        </div>
    )
})
