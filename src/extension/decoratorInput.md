how can I use the typescript compiler API to match code like this

```ts
WORKFLOW('test', async ({ G, flow }) => {
    const negative = G.CLIPTextEncode({ text: 'text, watermark', clip: ckpt })
    const vaeload = G.VAELoader({ vae_name: 'vae-ft-mse-840000-ema-pruned.safetensors' })

    const first = G.KSampler({
        seed: flow.randomSeed(),
        steps: 33,
        cfg: 7,
        sampler_name: 'euler_ancestral',
        scheduler: 'normal',
        denoise: 1,
        model: ckpt,
        positive: G.CLIPTextEncode({ text: 'landscape by james gurney,HD,4k,8k', clip: ckpt }),
        negative,
        latent_image: latent,
    })
})
```

and obtain a result like this:

```ts
const out = [
    { col: 1, row: 41, nodeName: "CLIPTextEncode", paramName: "text" },
    { col: 1, row: 66, nodeName: "CLIPTextEncode", paramName: "clip" },
    { col: 2, row: 35, nodeName: "VAELoader", paramName: "vae_name" },

    { col: 7,  row:9, nodeName: 'KSampler', paramName: 'seed'},
    { col: 8,  row:9, nodeName: 'KSampler', paramName: 'steps'},
    { col: 9,  row:9, nodeName: 'KSampler', paramName: 'cfg'},
    { col: 10, row:9, nodeName: 'KSampler', paramName: 'sampler_name'},
    { col: 11, row:9, nodeName: 'KSampler', paramName: 'scheduler'},
    { col: 12, row:9, nodeName: 'KSampler', paramName: 'denoise'},
    { col: 13, row:9, nodeName: 'KSampler', paramName: 'model'},
    { col: 14, row:9, nodeName: 'KSampler', paramName: 'positive'}

    { col: 14, row: 38, nodeName: 'CLIPTextEncode', paramName: 'text' },
    { col: 14, row: 82, nodeName: 'CLIPTextEncode', paramName: 'clip' },

    { col: 15, row:9, nodeName: 'KSampler', paramName: 'negative'},
    { col: 16, row:9, nodeName: 'KSampler', paramName: 'latent_image'},
]
```
