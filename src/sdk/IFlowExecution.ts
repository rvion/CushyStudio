import type { ComfyUploadImageResult } from '../core-types/ComfyWsPayloads'
import type { Maybe } from '../utils/types'
import type { Wildcards } from '../wildcards/wildcards'

// export type { FlowExecution } from '../core-back/FlowExecution'
// export type { ComfyNode } from '../core-shared/Node'
// export type { Slot } from '../core-shared/Slot'
export interface IFlowExecution {
    randomSeed(): number
    print(msg: string): void
    uploadImgFromDisk(path: string): Promise<ComfyUploadImageResult>
    askBoolean(msg: string, def?: Maybe<boolean>): Promise<boolean>
    askString(msg: string, def?: Maybe<string>): Promise<string>
    PROMPT(): Promise<void>
    wildcards: Wildcards
}
