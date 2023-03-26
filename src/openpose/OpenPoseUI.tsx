import * as I from '@fluentui/react-icons'
import { observer } from 'mobx-react-lite'
const CANVAS_WIDTH = 640
const CANVAS_HEIGHT = 480

// Get the canvas element from the HTML document
const canvas = document.getElementById('canvas')

import { Button } from '@fluentui/react-components'
import { OpenPoseAnimV0 } from './OpenPoseAnimV0'
import { useMemo } from 'react'
import { useWorkspace } from '../ui/WorkspaceContext'

export const OpenPoseViewerUI = observer(function OpenPoseViewerUI_(p: {}) {
    const workspace = useWorkspace()
    const TEST = useMemo(() => new OpenPoseAnimV0(workspace), [])

    return (
        <div>
            <div>
                <Button onClick={() => TEST.start()} icon={<I.Play24Regular />} />
                <Button onClick={() => TEST.stop()} icon={<I.Pause24Regular />} />
                <Button onClick={() => TEST.drawAllToPngAndSaveLocally()} icon={<I.DataTrending24Regular />}>
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
                    TEST.ctx = ctx

                    // drawOpenPoseBones(samplePose1, ctx)
                    // opd.renderPoses(ctx, [samplePose1.people[0].face_keypoints_2d], CANVAS_WIDTH, CANVAS_HEIGHT)
                }}
            ></canvas>
        </div>
    )
})
