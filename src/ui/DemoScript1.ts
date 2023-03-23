export const DemoScript1: string = `export {}
const _ckpt = C.CheckpointLoaderSimple({ ckpt_name: 'v1-5-pruned-emaonly.ckpt' })
const _positive = C.CLIPTextEncode({text: "photograph of victorian woman with wings, sky clouds, meadow grass", clip: _ckpt.CLIP, }, '6')
const _negative = C.CLIPTextEncode({text: "watermark, text", clip: _ckpt.CLIP, }, '7')
const _baseImg = C.LoadImage({image: "example.png", }, '10')
const _vaeEncode = C.VAEEncode({pixels: _baseImg, vae: _ckpt.VAE, }, '12')
const _sampler = C.KSampler({seed: C.randomSeed(), steps: 20, cfg: 8, sampler_name: "dpmpp_2m", scheduler: "normal", denoise: 0.8700000000000001, model: _ckpt.MODEL, positive: _positive.CONDITIONING, negative: _negative.CONDITIONING, latent_image: _vaeEncode.LATENT, }, '3')
const _vaeDecode = C.VAEDecode({samples: _sampler.LATENT, vae: _ckpt.VAE, }, '8')
const _image = C.SaveImage({filename_prefix: "ComfyUI", images: _vaeDecode.IMAGE, }, '9')

do {
    const r1 = await C.get()
    const imgs = r1.images
    C.print('🐙1', imgs.length)
    const img0 = imgs[0]
    C.print('🐙2', img0.url)
    const next = await C.convertToImageInput(r1.images[0])
    console.log({next})
    _vaeEncode.inputs.pixels = next
} while (
    await C.askBoolean('Continue and increase batch size?')
)
`

export const DemoScript2: string = `export {}

const ckpt = C.CheckpointLoaderSimple({ ckpt_name: 'v1-5-pruned-emaonly.ckpt' })
const latent = C.EmptyLatentImage({ width: 512, height: 512, batch_size: 1 })

const TOPIC = await C.askString('what is your subject about? (e.g. "cat")', 'cat')

const positive = C.CLIPTextEncode({ text: ['masterpiece', TOPIC, C.wildcards.adj_beauty[0]].join(' '), clip: ckpt })
const negative = C.CLIPTextEncode({ text: 'bad hands', clip: ckpt })
const sampler = C.KSampler({ seed: C.randomSeed(), steps: 20, cfg: 8, sampler_name: 'euler', scheduler: 'normal', denoise: 1, model: ckpt, positive, negative, latent_image: latent })
const vae = C.VAEDecode({ samples: sampler, vae: ckpt })
const image = C.SaveImage({ filename_prefix: 'ComfyUI', images: vae })

do {
    const r1 = await C.get()
    const fName = await C.upload(r1.images[0])
    console.log({fName})

    latent.inputs.batch_size++
    // sampler.inputs.seed ++
} while (
    await C.askBoolean('Continue and increase batch size?')
)
`
