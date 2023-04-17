import type { LATER } from '../core-back/LATER'
import type { ComfyUploadImageResult } from '../core-types/ComfyWsPayloads'
import type { AbsolutePath, RelativePath } from '../fs/BrandedPaths'
import type { HTMLContent, MDContent } from '../utils/markdown'
import type { Maybe } from '../utils/types'
import type { Wildcards } from '../wildcards/wildcards'

export interface IFlowExecution {
    // random value generation
    randomSeed(): number

    // debug
    print(msg: string): void
    showHTMLContent(content: string): void
    showMardownContent(content: string): void

    // path manipulation
    resolveRelative(path: string): RelativePath
    resolveAbsolute(path: string): AbsolutePath

    // file upload
    uploadWorkspaceFile(path: string): Promise<ComfyUploadImageResult>
    uploadWorkspaceFileAndLoad(path: string): Promise<LATER<'LoadImage'>>
    uploadAnyFile(path: string): Promise<ComfyUploadImageResult>
    uploadURL(url: string): Promise<ComfyUploadImageResult>

    // interractions
    askBoolean(msg: string, def?: Maybe<boolean>): Promise<boolean>
    askString(msg: string, def?: Maybe<string>): Promise<string>
    askPaint(msg: string, path: string): Promise<string>

    // commands
    exec(cmd: string): string
    sleep(ms: number): Promise<void>

    // file features
    saveTextFile(relativePath: string, content: string): Promise<void>

    // summary
    writeFlowSummary(): void
    get flowSummaryMd(): MDContent
    get flowSummaryHTML(): HTMLContent

    // prompts
    PROMPT(): Promise<IPromptExecution>
    wildcards: Wildcards

    // images
    generatedImages: IGeneratedImage[]
    get firstImage(): IGeneratedImage
    get lastImage(): IGeneratedImage
}

export interface IPromptExecution {
    images: IGeneratedImage[]
}

export interface IGeneratedImage {
    /** run an imagemagick convert action */
    imagemagicConvert(partialCmd: string, suffix: string): string

    /** file name within the ComfyUI folder */
    get comfyFilename(): string
    /** relative path on the comfy URL */
    get comfyRelativePath(): string
    /** url to acces the image */
    get comfyURL(): string
    /** path within the input folder */
    comfyInputPath?: Maybe<string>

    /** folder in which the image should be saved */
    get localFolder(): string
    /** local workspace file name, without extension */
    get localFileNameNoExt(): string
    /** local workspace file name, WITH extension */
    get localFileName(): string
    /** local workspace relative file path */
    get localRelativeFilePath(): string

    /** uri the webview can access */
    get webviewURI(): string
}

const pick = (...x: string[]) => x[Math.floor(Math.random() * x.length)]
