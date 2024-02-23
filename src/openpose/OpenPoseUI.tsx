import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'

import { OpenPoseAnimV0 } from './OpenPoseAnimV0'
import { Button } from 'src/rsuite/shims'
import { useSt } from 'src/state/stateContext'

const CANVAS_WIDTH = 640
const CANVAS_HEIGHT = 480

// Get the canvas element from the HTML document
const canvas = document.getElementById('canvas')

export const OpenPoseViewerUI = observer(function OpenPoseViewerUI_(p: {}) {
    const workspace = useSt()
    const OPAnim = useMemo(() => new OpenPoseAnimV0(workspace), [])

    return (
        <div>
            <div>
                <Button onClick={() => OPAnim.start()} icon={<span className='material-symbols-outlined'>play_arrow</span>} />
                <Button onClick={() => OPAnim.stop()} icon={<span className='material-symbols-outlined'>pause</span>} />
                <Button
                    onClick={() => OPAnim.drawAllToPngAndSaveLocally()}
                    icon={<span className='material-symbols-outlined'>save_alt</span>}
                >
                    Draw all to png and save locally
                </Button>
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
