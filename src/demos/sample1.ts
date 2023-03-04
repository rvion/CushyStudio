export const x = 1

// import * as x from './builder.ts'

// const seed = x.Seed()
// const config = new x.CheckpointLoader({ config_name: '...', ckpt_name: '...' })
// const positive = new x.Conditionning({ clip: config, text: 'cat' })
// const negative = x.conditionning({ clip: config, text: 'ugly' })
// const latent = x.EmptyLatentImage()
// const sampler = x.KSampler({
//     seed: seed,
//     model: config,
//     positive,
//     negative,
//     latent_image: latent,
// })
// const latentCache = Cache(sampler.samples)
// const vae = SDVAEDecode({ model: config.vae, samples: sampler.samples })
// const img = SaveImage({ image: vae.image })

// await img.get() // |  NEED TO GENERATE A REQUEST TO THE BACKEND

// for (const i in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
//     seed.updateToRandomValue()
//     sampler.input.latent_image = latentCache.value

//     await img.get() // |  NEED TO GENERATE A REQUEST FOR THE BACKEND
// }
