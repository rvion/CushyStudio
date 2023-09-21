// action('demo3-abc', {
//     run: async ($) => {
//         // generate an empty table
//         const ckpt = $.nodes.CheckpointLoaderSimple({ ckpt_name: 'albedobaseXL_v02.safetensors' })
//         const latent = $.nodes.EmptyLatentImage({ width: 512, height: 512, batch_size: 1 })
//         const positive = $.nodes.CLIPTextEncode({ text: 'masterpiece super table anime', clip: ckpt })
//         const negative = $.nodes.CLIPTextEncode({ text: 'bad hands', clip: ckpt })
//         const sampler = $.nodes.KSampler({
//             seed: 2123,
//             steps: 20,
//             cfg: 10,
//             sampler_name: 'euler',
//             scheduler: 'normal',
//             denoise: 0.8,
//             model: ckpt,
//             positive,
//             negative,
//             latent_image: latent,
//         })
//         const vae = $.nodes.VAEDecode({ samples: sampler, vae: ckpt })
//         const image = $.nodes.SaveImage({ filename_prefix: 'ComfyUI', images: vae })
//         let r1 = await $.PROMPT()

//         // 🔴 ERROR V
//         const image_path = r1.images[0].data.filename
//         $.nodes.WASImageLoad({ image_path })

//         // use that table to put objects on top of it
//         const _ipt = r1.images[0].convertToImageInput()
//         // @ts-ignore
//         const nextBase = $.nodes.LoadImage({ image: _ipt })
//         const _vaeEncode = $.nodes.VAEEncode({ pixels: nextBase, vae: ckpt.VAE })
//         sampler.set({ latent_image: _vaeEncode })

//         for (const item of ['cat', 'dog', 'frog', 'woman']) {
//             positive.inputs.text = `masterpiece, (${item}:1.3), on table`
//             r1 = await $.PROMPT()
//         }
//     },
// })
