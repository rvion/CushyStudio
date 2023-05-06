import type * as T from '../global'
import type { FlowRun } from './FlowRun'

// prettier-ignore
export type LATER<T>
    // should be generated
    = T extends 'ComfySetup' ? T.ComfySetup
    : T extends 'LoadImage' ? T.LoadImage
    : T extends 'Embeddings' ? T.Embeddings
    : T extends 'Enum_CheckpointLoader_ckpt_name' ? T.Enum_CheckpointLoader_ckpt_name
    : T extends 'HasSingle_CLIP' ?  T.HasSingle_CLIP
    : T extends 'HasSingle_MODEL' ?  T.HasSingle_MODEL

    // those need to be mocked
    : T extends 'FlowRun' ? FlowRun
    // : T extends 'Presets' ? Presets
    : any
