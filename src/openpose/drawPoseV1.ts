import { OpenPoseData } from './OpenPoseData'

const boneColors = [
    '#ff0055',
    '#ff0000',
    '#ff5500',
    '#ffaa00',
    '#ffff00',
    '#aaff00',
    '#55ff00',
    '#00ff00',
    '#ff0000',
    '#00ff55',
    '#00ffaa',
    '#00ffff',
    '#00aaff',
    '#0055ff',
    '#0000ff',
    '#ff00aa',
    '#aa00ff',
    '#ff00ff',
    '#5500ff',
    '#0000ff',
    '#0000ff',
    '#0000ff',
    '#00ffff',
    '#00ffff',
    '#00ffff',
]

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
        let j = -1
        for (const bone of boneIndices) {
            j++
            const [start, end] = bone
            const startX = keypoints[start * 3]
            const startY = keypoints[start * 3 + 1]
            const endX = keypoints[end * 3]
            const endY = keypoints[end * 3 + 1]

            ctx.strokeStyle = convertHexToRGBA(boneColors[j], 0.5)
            ctx.lineWidth = BONE_THICKNESS

            // Draw the bone
            ctx.beginPath()
            ctx.moveTo(startX, startY)
            ctx.lineTo(endX, endY)
            // ctx.strokeStyle = BONE_COLOR
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

const convertHexToRGBA = (hex: string, alpha: number) => {
    const tempHex = hex.replace('#', '')
    const r = parseInt(tempHex.substring(0, 2), 16)
    const g = parseInt(tempHex.substring(2, 4), 16)
    const b = parseInt(tempHex.substring(4, 6), 16)

    return `rgba(${r},${g},${b},${alpha})`
}
