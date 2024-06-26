// prettier-ignore
export type KnownModel_Type =
    | "TAESD"              // x   4
    | "upscale"            // x  10
    | "checkpoints"        // x  28
    | "insightface"        // x  13
    | "deepbump"           // x   1
    | "face_restore"       // x   3
    | "zero123"            // x   1
    | "embeddings"         // x   4
    | "VAE"                // x   7
    | "unet"               // x  10
    | "clip"               // x   1
    | "lora"               // x  16
    | "unclip"             // x   2
    | "T2I-Adapter"        // x  18
    | "T2I-Style"          // x   1
    | "controlnet"         // x  38
    | "clip_vision"        // x   4
    | "gligen"             // x   1
    | "sam"                // x   6
    | "seecoder"           // x   3
    | "Ultralytics"        // x  16
    | "animatediff"        // x  13
    | "motion lora"        // x   8
    | "IP-Adapter"         // x  22
    | "PFG"                // x   3
    | "GFPGAN"             // x   1
    | "CodeFormer"         // x   1
    | "facexlib"           // x   4
    | "photomaker"         // x   1
    | "instantid"          // x   2
    | "efficient_sam"      // x   2
    | "Shape Predictor"    // x   1
    | "Face Recognition"   // x   1
    | "InstanceDiffusion"  // x   3
    | "BLIP_MODEL"         // x   1
    | "GroundingDINO"      // x   2
    | "RAM"                // x   3
    | "Zero123"            // x   4
    | "IC-Light"           // x   3
    | "ID-Animator"        // x   3
    | "CustomNet"          // x   1

export const knownModel_Type: KnownModel_Type[] = [
    "TAESD"             ,  // x   4
    "upscale"           ,  // x  10
    "checkpoints"       ,  // x  28
    "insightface"       ,  // x  13
    "deepbump"          ,  // x   1
    "face_restore"      ,  // x   3
    "zero123"           ,  // x   1
    "embeddings"        ,  // x   4
    "VAE"               ,  // x   7
    "unet"              ,  // x  10
    "clip"              ,  // x   1
    "lora"              ,  // x  16
    "unclip"            ,  // x   2
    "T2I-Adapter"       ,  // x  18
    "T2I-Style"         ,  // x   1
    "controlnet"        ,  // x  38
    "clip_vision"       ,  // x   4
    "gligen"            ,  // x   1
    "sam"               ,  // x   6
    "seecoder"          ,  // x   3
    "Ultralytics"       ,  // x  16
    "animatediff"       ,  // x  13
    "motion lora"       ,  // x   8
    "IP-Adapter"        ,  // x  22
    "PFG"               ,  // x   3
    "GFPGAN"            ,  // x   1
    "CodeFormer"        ,  // x   1
    "facexlib"          ,  // x   4
    "photomaker"        ,  // x   1
    "instantid"         ,  // x   2
    "efficient_sam"     ,  // x   2
    "Shape Predictor"   ,  // x   1
    "Face Recognition"  ,  // x   1
    "InstanceDiffusion" ,  // x   3
    "BLIP_MODEL"        ,  // x   1
    "GroundingDINO"     ,  // x   2
    "RAM"               ,  // x   3
    "Zero123"           ,  // x   4
    "IC-Light"          ,  // x   3
    "ID-Animator"       ,  // x   3
    "CustomNet"         ,  // x   1
]

