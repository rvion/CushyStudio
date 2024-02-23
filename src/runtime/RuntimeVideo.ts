import type { Runtime } from './Runtime'
import type { MediaImageL } from 'src/models/MediaImage'

import { makeAutoObservable } from 'mobx'
import path from 'pathe'

import { createMP4FromImages } from 'src/utils/ffmpeg/ffmpegScripts'
import { asAbsolutePath } from 'src/utils/fs/pathUtils'

/** namespace for all video-related utils */
export class RuntimeVideos {
    private st = this.rt.Cushy
    private step = this.rt.step
    private folder = this.rt.folder

    constructor(private rt: Runtime) {
        makeAutoObservable(this)
    }

    /** outputs a video */
    output_video = (p: {
        //
        url: string
        filePath?: string
    }) => {
        this.rt.Cushy.db.media_videos.create({
            url: p.url,
            absPath: p.filePath,
            stepID: this.rt.step.id,
        })
    }

    static VideoCounter = 1

    output_video_ffmpegGeneratedImagesTogether = async (
        /** image to incldue (defaults to all images generated in the fun) */
        source?: MediaImageL[],
        /** FPS (e.g. 60, 30, etc.) default is 30 */
        inputFPS = 30,
        opts: { transparent?: Maybe<boolean> } = {},
    ): Promise<void> => {
        // 1. path
        console.log('🎥 creating animation')

        // 2. ensure we have enough outputs
        const images = source ?? this.rt.generatedImages
        if (images.length === 1) return this.step.recordError(`only one image to create animation`, {})
        if (images.length === 0)
            return this.step.recordError(`no images to create animation; did you forget to call prompt() first ?`, {})

        console.info(`🎥 awaiting all files to be ready locally...`)
        // 🔴 TODO 2024-01-25 rvion: ensure all image really are ready
        // await Promise.all(images.map((i) => i.finished))
        console.info(`🎥 all files are ready locally`)

        const outputAbsPath = this.st.cacheFolderPath
        const targetVideoAbsPath = asAbsolutePath(
            path.join(outputAbsPath, `video-${Date.now()}-${RuntimeVideos.VideoCounter++}.mp4`),
        )
        console.log('🎥 outputAbsPath', outputAbsPath)
        console.log('🎥 targetVideoAbsPath', targetVideoAbsPath)
        const cwd = outputAbsPath

        // 4. create video
        console.info(`🎥 this.folder.path: ${this.folder}`)
        console.info(`🎥 cwd: ${cwd}`)
        const allAbsPaths = images.map((i) => i.absPath).filter((p) => p != null) as AbsolutePath[]
        const ffmpegComandInfos = await createMP4FromImages(allAbsPaths, targetVideoAbsPath, inputFPS, cwd, opts)
        if (ffmpegComandInfos) {
            this.st.db.media_texts.create({
                kind: 'markdown',
                title: 'Video creation summary',
                stepID: this.step.id,
                content: mkFfmpegSummary(ffmpegComandInfos),
            })
        }
        this.st.db.media_videos.create({
            url: `file://${targetVideoAbsPath}`,
            absPath: targetVideoAbsPath,
            stepID: this.step.id,
            filePath: targetVideoAbsPath,
        })
    }
}

function mkFfmpegSummary(ffmpegComandInfos: {
    ffmpegCommand: string
    framesFilePath: string //
    //
    framesFileContent: string
}): string {
    return `\
# Video creation summary

## command:

\`\`\`
${ffmpegComandInfos.ffmpegCommand}
\`\`\`


## frames file path:

\`\`\`
${ffmpegComandInfos.framesFilePath}
\`\`\`

## frames file content:

\`\`\`
${ffmpegComandInfos.framesFileContent}
\`\`\`

`
}
