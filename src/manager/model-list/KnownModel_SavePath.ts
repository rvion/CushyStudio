// prettier-ignore
export type KnownModel_SavePath =
    | "vae_approx"                                       // x   8
    | "default"                                          // x  85
    | "upscale_models/ldsr"                              // x   1
    | "checkpoints/upscale"                              // x   1
    | "insightface"                                      // x   2
    | "deepbump"                                         // x   1
    | "face_restore"                                     // x   3
    | "checkpoints/SVD"                                  // x   2
    | "checkpoints/zero123"                              // x   5
    | "checkpoints/Stable-Cascade"                       // x   2
    | "vae/Stable-Cascade"                               // x   2
    | "diffusion_models/Stable-Cascade"                  // x   8
    | "clip/Stable-Cascade"                              // x   1
    | "checkpoints/SDXL-TURBO"                           // x   2
    | "diffusion_models/xl-inpaint-0.1"                  // x   2
    | "loras/SDXL-Lightning"                             // x   3
    | "loras/DMD2"                                       // x   2
    | "loras/HyperSD/FLUX.1"                             // x   2
    | "loras/HyperSD/SD15"                               // x   6
    | "loras/HyperSD/SDXL"                               // x   6
    | "loras/HyperSD/SD3"                                // x   3
    | "clip/t5-base"                                     // x   1
    | "clip/t5"                                          // x  13
    | "vae/openai_consistency_decoder"                   // x   1
    | "loras/lcm/SD1.5"                                  // x   1
    | "loras/lcm/SSD-1B"                                 // x   1
    | "loras/lcm/SDXL"                                   // x   1
    | "checkpoints/segmind-vega"                         // x   1
    | "loras/segmind-vega"                               // x   1
    | "controlnet/TemporalNet1XL"                        // x   1
    | "clip_vision"                                      // x   5
    | "custom_nodes/ControlNet-LLLite-ComfyUI/models"    // x   1
    | "sams"                                             // x   4
    | "seecoders"                                        // x   3
    | "ultralytics/bbox"                                 // x   6
    | "ultralytics/segm"                                 // x  10
    | "AnimateDiff"                                      // x   2
    | "animatediff_models"                               // x  11
    | "animatediff_motion_lora"                          // x   8
    | "controlnet/SD1.5/animatediff"                     // x   2
    | "loras/SD1.5/animatediff"                          // x   1
    | "checkpoints/motionctrl"                           // x   1
    | "ipadapter"                                        // x  24
    | "loras/ipadapter"                                  // x   5
    | "custom_nodes/pfg-ComfyUI/models"                  // x   3
    | "facerestore_models"                               // x   4
    | "facedetection"                                    // x   2
    | "photomaker"                                       // x   2
    | "insightface/models/antelopev2"                    // x   5
    | "instantid"                                        // x   1
    | "controlnet/instantid"                             // x   1
    | "custom_nodes/ComfyUI-YoloWorld-EfficientSAM"      // x   2
    | "custom_nodes/ComfyUI_FaceAnalysis/dlib"           // x   2
    | "instance_models/fuser_models"                     // x   1
    | "instance_models/positionnet_models"               // x   1
    | "instance_models/scaleu_models"                    // x   1
    | "insightface/models/buffalo_l"                     // x   5
    | "blip"                                             // x   1
    | "groundingdino"                                    // x   2
    | "checkpoints/dynamicrafter"                        // x   2
    | "checkpoints/depthfm"                              // x   2
    | "checkpoints/SUPIR"                                // x   4
    | "rams"                                             // x   3
    | "instantid/SDXL"                                   // x   1
    | "controlnet/SDXL/instantid"                        // x   1
    | "insightface/models"                               // x   1
    | "diffusion_models/IC-Light"                        // x   3
    | "custom_nodes/ComfyUI_ID_Animator/models"          // x   1
    | "custom_nodes/ComfyUI_ID_Animator/models/animatediff_models" // x   1
    | "custom_nodes/ComfyUI_ID_Animator/models/image_encoder" // x   1
    | "custom_nodes/ComfyUI_CustomNet/pretrain"          // x   1
    | "controlnet/SDXL"                                  // x  12
    | "RGT/RGT"                                          // x   3
    | "RGT/RGT_S"                                        // x   3
    | "custom_nodes/ComfyUI-ToonCrafter/ToonCrafter/checkpoints/tooncrafter_512_interp_v1" // x   1
    | "controlnet/FLUX.1/InstantX-FLUX1-Dev-Union"       // x   1
    | "controlnet/FLUX.1/Shakker-Labs-ControlNet-Union-Pro" // x   1
    | "controlnet/FLUX.1"                                // x   1
    | "controlnet/FLUX.1/jasperai-dev-Upscaler"          // x   1
    | "controlnet/FLUX.1/jasperai-dev-Depth"             // x   1
    | "controlnet/FLUX.1/jasperai-dev-Surface-Normals"   // x   1
    | "controlnet/SDXL/controlnet-union-sdxl-1.0"        // x   2
    | "controlnet/SDXL/controlnet-scribble-sdxl-1.0"     // x   1
    | "controlnet/SDXL/controlnet-canny-sdxl-1.0"        // x   1
    | "controlnet/SDXL/controlnet-openpose-sdxl-1.0"     // x   2
    | "controlnet/SDXL/controlnet-scribble-sdxl-1.0-anime" // x   1
    | "controlnet/SDXL/controlnet-depth-sdxl-1.0"        // x   1
    | "controlnet/SDXL/controlnet-tile-sdxl-1.0"         // x   1
    | "controlnet/SD3/InstantX-Controlnet-Canny"         // x   1
    | "controlnet/SD3/InstantX-Controlnet-Pose"          // x   1
    | "controlnet/SD3/InstantX-Controlnet-Tile"          // x   1
    | "checkpoints/ToonCrafter"                          // x   1
    | "depthanything"                                    // x   6
    | "checkpoints/PixArt-Sigma"                         // x   1
    | "checkpoints/hunyuan_dit_comfyui"                  // x   3
    | "diffusion_models/FLUX1"                           // x  25
    | "vae/FLUX1"                                        // x   1
    | "checkpoints/FLUX1"                                // x   2
    | "custom_nodes/comfyui-SegGPT"                      // x   1
    | "clip/long_clip"                                   // x   2
    | "depth/ml-depth-pro"                               // x   1
    | "diffusion_models"                                 // x   7
    | "diffusion_models/kolors"                          // x   2
    | "LLM"                                              // x   3
    | "custom_nodes/ComfyUI-BRIA_AI-RMBG/RMBG-1.4"       // x   1

export const knownModel_SavePath: KnownModel_SavePath[] = [
    "vae_approx"                                      ,  // x   8
    "default"                                         ,  // x  85
    "upscale_models/ldsr"                             ,  // x   1
    "checkpoints/upscale"                             ,  // x   1
    "insightface"                                     ,  // x   2
    "deepbump"                                        ,  // x   1
    "face_restore"                                    ,  // x   3
    "checkpoints/SVD"                                 ,  // x   2
    "checkpoints/zero123"                             ,  // x   5
    "checkpoints/Stable-Cascade"                      ,  // x   2
    "vae/Stable-Cascade"                              ,  // x   2
    "diffusion_models/Stable-Cascade"                 ,  // x   8
    "clip/Stable-Cascade"                             ,  // x   1
    "checkpoints/SDXL-TURBO"                          ,  // x   2
    "diffusion_models/xl-inpaint-0.1"                 ,  // x   2
    "loras/SDXL-Lightning"                            ,  // x   3
    "loras/DMD2"                                      ,  // x   2
    "loras/HyperSD/FLUX.1"                            ,  // x   2
    "loras/HyperSD/SD15"                              ,  // x   6
    "loras/HyperSD/SDXL"                              ,  // x   6
    "loras/HyperSD/SD3"                               ,  // x   3
    "clip/t5-base"                                    ,  // x   1
    "clip/t5"                                         ,  // x  13
    "vae/openai_consistency_decoder"                  ,  // x   1
    "loras/lcm/SD1.5"                                 ,  // x   1
    "loras/lcm/SSD-1B"                                ,  // x   1
    "loras/lcm/SDXL"                                  ,  // x   1
    "checkpoints/segmind-vega"                        ,  // x   1
    "loras/segmind-vega"                              ,  // x   1
    "controlnet/TemporalNet1XL"                       ,  // x   1
    "clip_vision"                                     ,  // x   5
    "custom_nodes/ControlNet-LLLite-ComfyUI/models"   ,  // x   1
    "sams"                                            ,  // x   4
    "seecoders"                                       ,  // x   3
    "ultralytics/bbox"                                ,  // x   6
    "ultralytics/segm"                                ,  // x  10
    "AnimateDiff"                                     ,  // x   2
    "animatediff_models"                              ,  // x  11
    "animatediff_motion_lora"                         ,  // x   8
    "controlnet/SD1.5/animatediff"                    ,  // x   2
    "loras/SD1.5/animatediff"                         ,  // x   1
    "checkpoints/motionctrl"                          ,  // x   1
    "ipadapter"                                       ,  // x  24
    "loras/ipadapter"                                 ,  // x   5
    "custom_nodes/pfg-ComfyUI/models"                 ,  // x   3
    "facerestore_models"                              ,  // x   4
    "facedetection"                                   ,  // x   2
    "photomaker"                                      ,  // x   2
    "insightface/models/antelopev2"                   ,  // x   5
    "instantid"                                       ,  // x   1
    "controlnet/instantid"                            ,  // x   1
    "custom_nodes/ComfyUI-YoloWorld-EfficientSAM"     ,  // x   2
    "custom_nodes/ComfyUI_FaceAnalysis/dlib"          ,  // x   2
    "instance_models/fuser_models"                    ,  // x   1
    "instance_models/positionnet_models"              ,  // x   1
    "instance_models/scaleu_models"                   ,  // x   1
    "insightface/models/buffalo_l"                    ,  // x   5
    "blip"                                            ,  // x   1
    "groundingdino"                                   ,  // x   2
    "checkpoints/dynamicrafter"                       ,  // x   2
    "checkpoints/depthfm"                             ,  // x   2
    "checkpoints/SUPIR"                               ,  // x   4
    "rams"                                            ,  // x   3
    "instantid/SDXL"                                  ,  // x   1
    "controlnet/SDXL/instantid"                       ,  // x   1
    "insightface/models"                              ,  // x   1
    "diffusion_models/IC-Light"                       ,  // x   3
    "custom_nodes/ComfyUI_ID_Animator/models"         ,  // x   1
    "custom_nodes/ComfyUI_ID_Animator/models/animatediff_models",  // x   1
    "custom_nodes/ComfyUI_ID_Animator/models/image_encoder",  // x   1
    "custom_nodes/ComfyUI_CustomNet/pretrain"         ,  // x   1
    "controlnet/SDXL"                                 ,  // x  12
    "RGT/RGT"                                         ,  // x   3
    "RGT/RGT_S"                                       ,  // x   3
    "custom_nodes/ComfyUI-ToonCrafter/ToonCrafter/checkpoints/tooncrafter_512_interp_v1",  // x   1
    "controlnet/FLUX.1/InstantX-FLUX1-Dev-Union"      ,  // x   1
    "controlnet/FLUX.1/Shakker-Labs-ControlNet-Union-Pro",  // x   1
    "controlnet/FLUX.1"                               ,  // x   1
    "controlnet/FLUX.1/jasperai-dev-Upscaler"         ,  // x   1
    "controlnet/FLUX.1/jasperai-dev-Depth"            ,  // x   1
    "controlnet/FLUX.1/jasperai-dev-Surface-Normals"  ,  // x   1
    "controlnet/SDXL/controlnet-union-sdxl-1.0"       ,  // x   2
    "controlnet/SDXL/controlnet-scribble-sdxl-1.0"    ,  // x   1
    "controlnet/SDXL/controlnet-canny-sdxl-1.0"       ,  // x   1
    "controlnet/SDXL/controlnet-openpose-sdxl-1.0"    ,  // x   2
    "controlnet/SDXL/controlnet-scribble-sdxl-1.0-anime",  // x   1
    "controlnet/SDXL/controlnet-depth-sdxl-1.0"       ,  // x   1
    "controlnet/SDXL/controlnet-tile-sdxl-1.0"        ,  // x   1
    "controlnet/SD3/InstantX-Controlnet-Canny"        ,  // x   1
    "controlnet/SD3/InstantX-Controlnet-Pose"         ,  // x   1
    "controlnet/SD3/InstantX-Controlnet-Tile"         ,  // x   1
    "checkpoints/ToonCrafter"                         ,  // x   1
    "depthanything"                                   ,  // x   6
    "checkpoints/PixArt-Sigma"                        ,  // x   1
    "checkpoints/hunyuan_dit_comfyui"                 ,  // x   3
    "diffusion_models/FLUX1"                          ,  // x  25
    "vae/FLUX1"                                       ,  // x   1
    "checkpoints/FLUX1"                               ,  // x   2
    "custom_nodes/comfyui-SegGPT"                     ,  // x   1
    "clip/long_clip"                                  ,  // x   2
    "depth/ml-depth-pro"                              ,  // x   1
    "diffusion_models"                                ,  // x   7
    "diffusion_models/kolors"                         ,  // x   2
    "LLM"                                             ,  // x   3
    "custom_nodes/ComfyUI-BRIA_AI-RMBG/RMBG-1.4"      ,  // x   1
]

