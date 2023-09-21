// prettier-ignore
export type LATER<T>
    // should be generated
    = T extends 'ComfySetup' ? ComfySetup
    : T extends 'Requirable' ? Requirable
    : T extends 'LoadImage' ? LoadImage
    : T extends 'Embeddings' ? Embeddings
    : T extends 'Enum_LoraLoader_lora_name' ? Enum_LoraLoader_Lora_name
    : T extends 'Enum_CheckpointLoader_ckpt_name' ? Enum_CheckpointLoader_Ckpt_name
    : T extends 'Enum_VAELoader_vae_name' ? Enum_VAELoader_Vae_name
    : T extends 'HasSingle_CLIP' ?  HasSingle_CLIP
    : T extends 'HasSingle_MODEL' ?  HasSingle_MODEL
    : T extends 'CLIP' ?  CLIP
    : T extends 'MODEL' ?  MODEL
    : T extends 'VAE' ?  VAE
    : T extends 'CheckpointLoaderSimple' ?  CheckpointLoaderSimple
    : any
