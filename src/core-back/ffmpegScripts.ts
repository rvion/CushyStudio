import { execSync } from 'child_process'
// import { promisify } from 'util'
import { logger } from '../logger/logger'
import { extractErrorMessage } from '../utils/extractErrorMessage'

// const execAsync = promisify(exec)

export async function createMP4FromImages(
    //
    imageFiles: string[],
    outputVideo: string,
    frameRate: number = 30,
    workingDirectory: string,
): Promise<void> {
    // Your list of image paths
    // const imageFiles: string[] = [
    //     'path/to/image1.jpg',
    //     'path/to/image2.jpg',
    //     // ...
    // ]

    // The duration each image should be displayed, in milliseconds
    const durationPerImage = 200 // 2 seconds

    // Create the input file arguments for ffmpeg
    const inputArgs = imageFiles.map((path, index) => `-loop 1 -t ${durationPerImage / 1000} -i "${path}"`).join(' ')

    // Output video file
    // const outputVideo = outputVideo // 'output.mp4'

    // Additional ffmpeg arguments for encoding
    const encodingArgs = `-filter_complex "concat=n=${imageFiles.length}:v=1:a=0,format=yuv420p" -c:v libx264 -preset veryfast -crf 23`

    // Construct the full ffmpeg command
    const ffmpegCommand = `ffmpeg ${inputArgs} ${encodingArgs} "${outputVideo}"`

    logger().info(`Working directory: ${workingDirectory}`)
    logger().info(`Creating video with command: ${ffmpegCommand}`)

    try {
        const res = execSync(ffmpegCommand, { cwd: workingDirectory })
        const str = res.toString()
        // logger().info(`[stdout] ${res.stdout}`)
        // logger().info(`[stderr] ${res.stderr}`)
        logger().info(`[out] ${res}`)
        logger().info(`Video created successfully: ${outputVideo}`)
    } catch (error) {
        logger().error('Error creating video:', extractErrorMessage(error))
    }

    // Execute the command synchronously
    // try {
    //     const result = execSync(ffmpegCommand, { stdio: 'inherit' })
    //     console.log('Video created successfully:', outputVideoPath)
    // } catch (error) {
    //     console.error('Error creating video:', error.message)
    // }

    // const inputFiles = imageFiles.join('|')
    // // prettier-ignore
    // const commandV1 = [
    //     `ffmpeg`,
    //     `-pattern_type`, `glob`,
    //     `-i`, `"${inputFiles}"`,
    //     `-r`, `${frameRate}`,
    //     `-pix_fmt`, `yuv420p`,
    //     `-preset`, `slow`,
    //     `-crf`, `22`,
    //     `-movflags`, `+faststart`,
    //     `-c:v`,
    //     `libx264`,
    //     `"${outputVideo}"`,
    // ].join(' ')
    // ffmpeg -framerate 2 -i "/Users/loco/csdemo/.cushy/cache/Run-20230422121132/QNYwIRgf-8U0rqzJ3LCy3_prompt-2_*.png" -c:v libx264 -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -r 2 -t 8 output.mp4

    // const inputFiles = imageFiles.map((file, index) => `-i "${file}"`).join(' ')
    // const filterComplex = imageFiles.map((_, index) => `[${index}:v]`).join('')
    // const command = `ffmpeg ${inputFiles} -filter_complex "${filterComplex}concat=n=${imageFiles.length}:v=1:a=0[outv]" -map "[outv]" -r ${frameRate} -pix_fmt yuv420p -preset slow -crf 22 -movflags +faststart -c:v libx264 "${outputVideo}"`

    // const inputFiles = imageFiles.map((file, index) => `-i "${file}"`).join(' ')
    // const filterComplex =
    //     imageFiles.map((_, index) => `[${index}:v]scale=-1:-1,setsar=1,fps=${frameRate},duration=1[img${index}];`).join('') +
    //     imageFiles.map((_, index) => `[img${index}]`).join('') +
    //     `concat=n=${imageFiles.length}:v=1:a=0[outv]`
    // const command = `ffmpeg ${inputFiles} -filter_complex "${filterComplex}" -map "[outv]" -c:v libx264 -preset slow -crf 22 -movflags +faststart "${outputVideo}"`

    // const images = ['foo/img1.png', 'foo/img2.png', 'foo/img3.png']
    // const images =
    // const duration = 1
    // // const frameRate = 10

    // const command = `ffmpeg -f concat -safe 0 -i <(printf "file '%s'\nduration ${duration}\n" "${imageFiles.join(
    //     '" "',
    // )}") -c:v libx264 -pix_fmt yuv420p -r ${frameRate} output.mp4`

    // logger().info(`Working directory: ${workingDirectory}`)
    // logger().info(`Creating video with command: ${command}`)

    // try {
    //     const res = await execAsync(command, { cwd: workingDirectory })
    //     logger().info(`[stdout] ${res.stdout}`)
    //     logger().info(`[stderr] ${res.stderr}`)
    //     logger().info('Video created successfully!')
    // } catch (error) {
    //     logger().error('Error creating video:', extractErrorMessage(error))
    // }
}
