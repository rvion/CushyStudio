import * as rt from './builder.ts'
const node5 = new rt.EmptyLatentImage({ batch_size: 1 })
const node4 = new rt.CheckpointLoader({})
const node6 = new rt.CLIPTextEncode({
    clip: 0 as any,
})
const node7 = new rt.CLIPTextEncode({
    clip: 0 as any,
})
const node3 = new rt.KSampler({
    model: 0 as any,
    positive: 0 as any,
    negative: 0 as any,
    latent_image: 0 as any,
})
const node8 = new rt.VAEDecode({
    samples: 0 as any,
    vae: 0 as any,
})
const node9 = new rt.SaveImage({
    images: 0 as any,
})
