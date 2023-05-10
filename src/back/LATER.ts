import type * as T from '../global'

// prettier-ignore
export type LATER<T>
    // should be generated
    = T extends 'ComfySetup' ? T.ComfySetup
    : T extends 'LoadImage' ? T.LoadImage
    : T extends 'Embeddings' ? T.Embeddings
    : T extends 'Enum_LoraLoader_lora_name' ? T.Enum_LoraLoader_lora_name
    : T extends 'Enum_CheckpointLoader_ckpt_name' ? T.Enum_CheckpointLoader_ckpt_name
    : T extends 'Enum_VAELoader_vae_name' ? T.Enum_VAELoader_vae_name
    : T extends 'HasSingle_CLIP' ?  T.HasSingle_CLIP
    : T extends 'HasSingle_MODEL' ?  T.HasSingle_MODEL
    : T extends 'CLIP' ?  T.CLIP
    : T extends 'MODEL' ?  T.MODEL
    : T extends 'VAE' ?  T.VAE
    : T extends 'CheckpointLoaderSimple' ?  T.CheckpointLoaderSimple
    : any
