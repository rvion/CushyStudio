import { OpenPoseData } from './OpenPoseData'

export function drawOpenPoseBones(
    //
    openposeData: OpenPoseData,
    ctx: CanvasRenderingContext2D,
) {
    // Define the colors for the bones and joints
    const BONE_COLOR = 'red'
    const JOINT_COLOR = 'blue'

    // Define the thickness of the bones
    const BONE_THICKNESS = 4

    // Get the list of body part indices that form the bones
    const boneIndices = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [1, 5],
        [5, 6],
        [6, 7],
        [1, 8],
        [8, 9],
        [9, 10],
        [10, 11],
        [8, 12],
        [12, 13],
        [13, 14],
        [0, 15],
        [15, 17],
        [0, 16],
        [16, 18],
        [14, 19],
        [19, 20],
        [14, 21],
        [11, 22],
        [22, 23],
        [11, 24],
    ]

    // Loop through each person in the JSON data
    for (const person of openposeData.people) {
        // Get the list of body part coordinates for the person
        const keypoints = person.pose_keypoints_2d

        // Loop through each bone and draw it on the canvas
        for (const bone of boneIndices) {
            const [start, end] = bone
            const startX = keypoints[start * 3]
            const startY = keypoints[start * 3 + 1]
            const endX = keypoints[end * 3]
            const endY = keypoints[end * 3 + 1]

            // Draw the bone
            ctx.beginPath()
            ctx.moveTo(startX, startY)
            ctx.lineTo(endX, endY)
            ctx.strokeStyle = BONE_COLOR
            ctx.lineWidth = BONE_THICKNESS
            ctx.stroke()

            // Draw the joints at the start and end of the bone
            ctx.beginPath()
            ctx.arc(startX, startY, BONE_THICKNESS / 2, 0, 2 * Math.PI)
            ctx.fillStyle = JOINT_COLOR
            ctx.fill()
            ctx.beginPath()
            ctx.arc(endX, endY, BONE_THICKNESS / 2, 0, 2 * Math.PI)
            ctx.fillStyle = JOINT_COLOR
            ctx.fill()
        }
    }
}
