// taken from here https://github.com/mobiledgex/edge-cloud-sampleapps/blob/c9cf67c7c502406465d647d013f0d98cad2d4c44/ComputerVisionServer/moedx/static/js/poseRenderer.js

export class OpenPoseDrawer {
   /**
    * The bonePairs array is a 2D list of the body parts that should be connected together.
    * E.g., 1 for "Neck", 2 for "RShoulder", etc.
    * See https://github.com/CMU-Perceptual-Computing-Lab/openpose/blob/master/doc/output.md
    */
   bonePairs = [
      [1, 8],
      [1, 2],
      [1, 5],
      [2, 3],
      [3, 4],
      [5, 6],
      [6, 7],
      [8, 9],
      [9, 10],
      [10, 11],
      [8, 12],
      [12, 13],
      [13, 14],
      [1, 0],
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

   /**
    * Colors array corresponding to the "bonePairs" array above. For example, the first pair of
    * coordinates [1,8] will be drawn with the first color in this array, "#ff0055".
    */
   boneColors: string[] = [
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

   jointCircleRadius: number = 6
   lineWidth: number = 4

   /**
    * Goes through each set of bonePairs and if the received data has those
    * coordinates populated, draws a line between them and circles at the joints,
    * in the corresponding boneColors value.
    */
   renderPoses(
      //
      ctx: CanvasRenderingContext2D,
      poses: any[],
      renderScale: number,
      animationAlpha: number,
   ): void {
      console.log('renderPoses')
      console.log(poses)
      const totalPoses = poses.length
      for (let i = 0; i < totalPoses; i++) {
         const pose = poses[i]
         for (let j = 0; j < this.bonePairs.length; j++) {
            const pair = this.bonePairs[j]!
            const indexStart = pair[0]!
            const indexEnd = pair[1]!

            const keypoint1 = pose[indexStart]
            const x1 = keypoint1[0] * renderScale
            const y1 = keypoint1[1] * renderScale
            const score1 = keypoint1[2]

            const keypoint2 = pose[indexEnd]
            const x2 = keypoint2[0] * renderScale
            const y2 = keypoint2[1] * renderScale
            const score2 = keypoint2[2]

            if (score1 == 0 || score2 == 0) {
               continue
            }

            ctx.strokeStyle = this.convertHexToRGBA(this.boneColors[j]!, animationAlpha)
            ctx.lineWidth = this.lineWidth

            // Draw the bone
            ctx.beginPath()
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y2)
            ctx.stroke()

            // Draw the joints at the start and end of the bone
            ctx.fillStyle = this.convertHexToRGBA(this.boneColors[j]!, animationAlpha)
            ctx.moveTo(x1, y1)
            ctx.arc(x1, y1, this.jointCircleRadius, 0, 2 * Math.PI)
            ctx.moveTo(x2, y2)
            ctx.arc(x2, y2, this.jointCircleRadius, 0, 2 * Math.PI)
            ctx.stroke()
            ctx.fill()
         }
      }
   }

   convertHexToRGBA = (hex: string, alpha: number) => {
      const tempHex = hex.replace('#', '')
      const r = parseInt(tempHex.substring(0, 2), 16)
      const g = parseInt(tempHex.substring(2, 4), 16)
      const b = parseInt(tempHex.substring(4, 6), 16)

      return `rgba(${r},${g},${b},${alpha})`
   }
}
