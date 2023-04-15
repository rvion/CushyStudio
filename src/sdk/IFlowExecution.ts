import { LATER } from '../core-back/LATER'
import type { ComfyUploadImageResult } from '../core-types/ComfyWsPayloads'
import type { AbsolutePath, RelativePath } from '../fs/BrandedPaths'
import type { Maybe } from '../utils/types'
import type { Wildcards } from '../wildcards/wildcards'

export interface IFlowExecution {
    // misc
    randomSeed(): number
    print(msg: string): void

    // uploads
    resolveRelative(path: string): RelativePath
    resolveAbsolute(path: string): AbsolutePath
    uploadWorkspaceFile(path: string): Promise<ComfyUploadImageResult>
    uploadWorkspaceFileAndLoad(path: RelativePath): Promise<LATER<'LoadImage'>>
    uploadAnyFile(path: string): Promise<ComfyUploadImageResult>
    uploadURL(url: string): Promise<ComfyUploadImageResult>

    // interractions
    askBoolean(msg: string, def?: Maybe<boolean>): Promise<boolean>
    askString(msg: string, def?: Maybe<string>): Promise<string>

    sleep(ms: number): Promise<void>

    // prompts
    PROMPT(): Promise<IPromptExecution>
    wildcards: Wildcards
    generatedImages: IGeneratedImage[]
}

export interface IPromptExecution {
    images: IGeneratedImage[]
}

export interface IGeneratedImage {
    get relativePath(): string
}

const pick = (...x: string[]) => x[Math.floor(Math.random() * x.length)]
