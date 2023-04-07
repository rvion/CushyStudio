import ts from 'typescript'

console.log(ts.version)

const code = `
export default WORKFLOW('sample', async (comfy) => {
    const ckpt = comfy.CheckpointLoaderSimple({
      ckpt_name: "AOM3A1_orangemixs.safetensors",
    });
    const latent = comfy.EmptyLatentImage({
      width: 512,
      height: 512,
      batch_size: 1,
    });
    const positive = comfy.CLIPTextEncode({
      text: "masterpiece, (chair:1.3)",
      clip: ckpt,
    });
    const negative = comfy.CLIPTextEncode({ text: "", clip: ckpt });
    const sampler = comfy.KSampler({
      seed: comfy.randomSeed(),
      steps: 20 as number,
      cfg: 10,
      sampler_name: "euler",
      scheduler: "normal",
      denoise: 0.8,
      model: ckpt,
      positive,
      negative,
      latent_image: latent,
    });
    const vae = comfy.VAEDecode({ samples: sampler, vae: ckpt });

    comfy.SaveImage({ filename_prefix: "ComfyUI", images: vae });
    await comfy.get();
  });
  `

let result = ts.transpileModule(code.replace('export default ', ''), {
    compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ESNext,
    },
})
console.log(result.outputText)
