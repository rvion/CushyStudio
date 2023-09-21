// action('abccxx', {
//     run: async ($) => {
//         // generate an empty table
//         const ckpt = $.nodes.CheckpointLoaderSimple({ ckpt_name: 'albedobaseXL_v02.safetensors' })
//         const latent = $.nodes.EmptyLatentImage({ width: 512, height: 512, batch_size: 1 })

//         // setup initial image
//         const positive = $.nodes.CLIPTextEncode({ text: 'masterpiece, 1girl, walking, alone, white_background', clip: ckpt })
//         const control_net = $.nodes.ControlNetLoader({ control_net_name: 'control_openpose-fp16.safetensors' })
//         const upload = await $.uploadWorkspaceFile($.resolveRelative(`assets/test-0.png`))
//         // @ts-ignore
//         const img = $.nodes.LoadImage({ image: upload.name })
//         const control_net_apply = $.nodes.ControlNetApply({ conditioning: positive, control_net, image: img, strength: 1 })
//         const negative = $.nodes.CLIPTextEncode({ text: 'bad hands', clip: ckpt })
//         const sampler = $.nodes.KSampler({
//             seed: 200,
//             steps: 20,
//             cfg: 10,
//             sampler_name: 'euler',
//             scheduler: 'normal',
//             denoise: 0.8,
//             model: ckpt,
//             positive: control_net_apply,
//             negative,
//             latent_image: latent,
//         })
//         const vae = $.nodes.VAEDecode({ samples: sampler, vae: ckpt })
//         const image = $.nodes.SaveImage({ filename_prefix: 'ComfyUI', images: vae })
//         let r1 = await $.PROMPT()
//         $.print(`🟢`)
//         $.print(`🟢 ${JSON.stringify(r1.images[0])}`)
//         $.print(`🟢 ${JSON.stringify(r1.images[0].data.filename)}`)

//         for (const i of [1, 2]) {
//             // use previous output as base
//             const nextBase = $.nodes.WASImageLoad({ image_path: r1.images[0].data.filename })
//             const preview = $.nodes.PreviewImage({ images: nextBase })
//             // const _vaeEncode = $.nodes.VAEEncode({ pixels: nextBase, vae: ckpt.VAE })
//             // sampler.set({ latent_image: _vaeEncode })

//             // // use connect frame as input
//             // const nextGuideUpload = await flow.uploadWorkspaceFile(flow.resolveRelative(`assets/test-${i}.png`))
//             // // @ts-ignore
//             // const nextGuide = $.nodes.LoadImage({ image: nextGuideUpload.name })
//             // control_net_apply.set({ image: nextGuide })
//         }
//         r1 = await $.PROMPT()
//         // for (const item of ['cat',/*'dog','frog','woman'*/]) {
//         //     // @ts-ignore
//         //     positive.inputs.text =  `masterpiece, (${item}:1.3), on table`
//         //     r1 = await C.get()
//         // }
//     },
// })
