# Installing Models

Working with generative AI require having models available on your runtime host.

There are lots of very different models covering different use-cases.
Most CushyApp use several models.

Some models are used for segmentation, some for shape detections, some are for image generation, image refinements, adding new concepts, upsacaling images, guiding generation from depth map, etc.

# By manually downloading models into your host ComfyUI installation

if you follow some online instructions telling you to download a model into your ComfyUI installation subfolder, this will work with cushy whitout any problem. Just make sure to reload your ComfyUI server so it picks up the model, then make sure to reload the schema on CushyStudio side too

# Via the built-in Civitai UI

You can install civitai models via the dedicated civitai interface.
This interface is focused on finding and downloading models.

![](https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/FqDYlfMgIYxnlKfx80cdhGqgoEKDpz0ZD0pNuHeto0.jpg)

![](https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/jBOukcIgmPCUjVi1zWmeFjDccMgTjdV4iT8tYJuItCg.jpg)


- it uses the civitai API to find models / versions / previews / files
- it convert downloadable files from Civitai into compatible request with ComfyUI manager.

> 👉 the conversion is not perfect yet; feel free to make it more robust there `src/panels/Panel_Models/CivitaiResultVersionUI.tsx`


Make sure to reload your ComfyUI server so it picks up the model, then make sure to reload the schema on CushyStudio side too.

# Via the wiget requirements in your apps.

Apps can define model via the `requirements` property available on every widget.

![](https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/5v4kQlnbyKvV6taXSliL4DqN15jZXTHPheE3Rpdqw.mp4)

## Built-in list of known models

Cushy use the list of Known Models from [ComfyManager](https://github.com/ltdrdata/ComfyUI-Manager).

<!-- `src/manager/model-list/KnownModel_Type.ts` -->
This widget have a built-in list of hundreds of models, such as `TAESD`, `upscale`, `checkpoints`, `insightface`, `deepbump`, `face_restore`, `zero123`, `embeddings`, `VAE`, `unet`, `clip`, `lora`, `unclip`, `T2I-Adapter`, `T2I-Style`, `controlnet`, `clip_vision`, `gligen`, `sam`, `seecoder`, `Ultralytics`, `animatediff`, `motion lora`, `IP-Adapter`, `PFG`, `GFPGAN`, `CodeFormer`, `facexlib`, `photomaker`, `instantid`, `efficient_sam`, `Shape Predictor`, `Face Recognition`

The list of models is cached locally, and processed to generate various metadata.

# Via the Civitai custom nodes for ComfyUI.

Some Cushy Apps allow to paste a Civitai special code to download and use the model right from your ComfyUI workflow execution.

![](https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/AYacYzeDCztEkFCFkbMRwt3AaFcMXeA212xkZ2Xw.jpg)

this approach requires having the civitai custom nodes installed.

# Browse models from the official civitai

You can also browser the Civitai official UI directly from Cushy using and embedded iframe; it will allow you to search things differently, or will allow you to copy the ckpt-air.

Beware, loading this website is really slow; may make you fan spin. For simple use-cases, use the built-in

![](https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/Vkc8k0riGEbeK6b8bK5iWu7S16piWhebFE9vBMyRXs.jpg)
