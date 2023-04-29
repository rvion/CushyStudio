import type { ComfySetup, Enum_CheckpointLoader_ckpt_name, LoadImage } from '../global'
import type { FlowRun } from './FlowRun'

// prettier-ignore
export type LATER<T>
    // should be generated
    = T extends 'ComfySetup' ? ComfySetup
    : T extends 'LoadImage' ? LoadImage
    : T extends 'Enum_CheckpointLoader_ckpt_name' ? Enum_CheckpointLoader_ckpt_name

    // those need to be mocked
    : T extends 'FlowRun' ? FlowRun
    // : T extends 'Presets' ? Presets
    : any
