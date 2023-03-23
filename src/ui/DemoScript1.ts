export const DemoScript1: string = `export {}

// generate an empty table
const ckpt = C.CheckpointLoaderSimple({ ckpt_name: 'AOM3A1_orangemixs.safetensors' })
const latent = C.EmptyLatentImage({ width: 512, height: 512, batch_size: 1 })
const positive = C.CLIPTextEncode({ text: 'masterpiece table anime', clip: ckpt })
const negative = C.CLIPTextEncode({ text: 'bad hands', clip: ckpt })
const sampler = C.KSampler({ seed: 2, steps: 20, cfg: 10, sampler_name: 'euler', scheduler: 'normal',
denoise: 0.8, model: ckpt, positive, negative, latent_image: latent })
const vae = C.VAEDecode({ samples: sampler, vae: ckpt })
const image = C.SaveImage({ filename_prefix: 'ComfyUI', images: vae })
let r1 = await C.get()

// use that table to put objects on top of it
const _ipt = await C.convertToImageInput(r1.images[0])
const nextBase =  C.LoadImage({image: _ipt})
const _vaeEncode = C.VAEEncode({pixels: nextBase, vae: ckpt.VAE, })
sampler.set({ latent_image: _vaeEncode })


for (const item of ['cat','dog','frog','woman']) {
    // @ts-ignore
    positive.inputs.text =  \`masterpiece, (\${item}:1.3), on table\`
    r1 = await C.get()
}
`

export const DemoScript2: string = `export {}
const ckpt = C.CheckpointLoaderSimple({ ckpt_name: 'v1-5-pruned-emaonly.ckpt' })
const latent = C.EmptyLatentImage({ width: 512, height: 512, batch_size: 1 })
const positive = C.CLIPTextEncode({ text: 'empty table', clip: ckpt })
const negative = C.CLIPTextEncode({ text: 'bad hands', clip: ckpt })
const sampler = C.KSampler({ seed: C.randomSeed(), steps: 20, cfg: 10, sampler_name: 'euler', scheduler: 'normal',
denoise: 0.8, model: ckpt, positive, negative, latent_image: latent })
const vae = C.VAEDecode({ samples: sampler, vae: ckpt })
const image = C.SaveImage({ filename_prefix: 'ComfyUI', images: vae })


// get empty table
let r1 = await C.get()


for (const item of ['cat','dog','frog','woman']) {
    const _ipt = await C.convertToImageInput(r1.images[0])
    // @ts-ignore
    const nextBase =  C.LoadImage({image: _ipt})
    const _vaeEncode = C.VAEEncode({pixels: nextBase, vae: ckpt.VAE, })
    sampler.set({ latent_image: _vaeEncode })
    positive.inputs.text =  \`\${item} on table\`
    r1 = await C.get()
}
`

export const DemoScript3: string = `export {}

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
