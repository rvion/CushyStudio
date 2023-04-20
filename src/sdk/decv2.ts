import { extractAllPossibleNodeInputAssignment } from '../core-back/decoratorInput'

// Define the source code to be parsed
const sourceCode = `
WORKFLOW("test", async ({ G, flow }) => {
    const negative = G.CLIPTextEncode({ text: "text, watermark", clip: ckpt })
    const vaeload = G.VAELoader({ vae_name: "vae-ft-mse-840000-ema-pruned.safetensors" })

    const first = G.KSampler({
        seed: flow.randomSeed(),
        steps: 33,
        cfg: 7,
        sampler_name: "euler_ancestral",
        scheduler: "normal",
        denoise: 1,
        model: ckpt,
        positive: G.CLIPTextEncode({ text: "landscape by james gurney,HD,4k,8k", clip: ckpt }),
        negative,
        latent_image: latent,
    })
})
`

// Parse the source code and traverse the AST to find function calls
const result = extractAllPossibleNodeInputAssignment(sourceCode)
console.log(result)

// [
//     { col: 1, row: 2, nodeName: 'WORKFLOW', paramName: '"test"' },
//     {
//       col: 1,
//       row: 2,
//       nodeName: 'WORKFLOW',
//       paramName: 'async ({ G, flow }) => {\n' +
//         '    const negative = G.CLIPTextEncode({ text: "text, watermark", clip: ckpt })\n' +
//         '    const vaeload = G.VAELoader({ vae_name: "vae-ft-mse-840000-ema-pruned.safetensors" })\n' +
//         '\n' +
//         '    const first = G.KSampler({\n' +
//         '        seed: flow.randomSeed(),\n' +
//         '        steps: 33,\n' +
//         '        cfg: 7,\n' +
//         '        sampler_name: "euler_ancestral",\n' +
//         '        scheduler: "normal",\n' +
//         '        denoise: 1,\n' +
//         '        model: ckpt,\n' +
//         '        positive: G.CLIPTextEncode({ text: "landscape by james gurney,HD,4k,8k", clip: ckpt }),\n' +
//         '        negative,\n' +
//         '        latent_image: latent,\n' +
//         '    })\n' +
//         '}'
//     },
//     { col: 22, row: 3, nodeName: 'G.CLIPTextEncode', paramName: 'text' },
//     { col: 22, row: 3, nodeName: 'G.CLIPTextEncode', paramName: 'clip' },
//     { col: 21, row: 4, nodeName: 'G.VAELoader', paramName: 'vae_name' },
//     { col: 19, row: 6, nodeName: 'G.KSampler', paramName: 'seed' },
//     { col: 19, row: 6, nodeName: 'G.KSampler', paramName: 'steps' },
//     { col: 19, row: 6, nodeName: 'G.KSampler', paramName: 'cfg' },
//     {
//       col: 19,
//       row: 6,
//       nodeName: 'G.KSampler',
//       paramName: 'sampler_name'
//     },
//     { col: 19, row: 6, nodeName: 'G.KSampler', paramName: 'scheduler' },
//     { col: 19, row: 6, nodeName: 'G.KSampler', paramName: 'denoise' },
//     { col: 19, row: 6, nodeName: 'G.KSampler', paramName: 'model' },
//     { col: 19, row: 6, nodeName: 'G.KSampler', paramName: 'positive' },
//     {
//       col: 19,
//       row: 6,
//       nodeName: 'G.KSampler',
//       paramName: 'latent_image'
//     },
// ]
