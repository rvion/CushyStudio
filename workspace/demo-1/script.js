
WORKFLOW(async (x) => {
    // generate an empty table
    const ckpt = x.CheckpointLoaderSimple({ ckpt_name: 'AOM3A1_orangemixs.safetensors' });
    const latent = x.EmptyLatentImage({ width: 512, height: 512, batch_size: 1 });
    const positive = x.CLIPTextEncode({ text: 'masterpiece super table anime', clip: ckpt });
    const negative = x.CLIPTextEncode({ text: 'bad hands', clip: ckpt });
    const sampler = x.KSampler({ seed: 2123, steps: 20, cfg: 10, sampler_name: 'euler', scheduler: 'normal',
        denoise: 0.8, model: ckpt, positive, negative, latent_image: latent });
    const vae = x.VAEDecode({ samples: sampler, vae: ckpt });
    const image = x.SaveImage({ filename_prefix: 'ComfyUI', images: vae });
    let r1 = await x.get();
    // use that table to put objects on top of it
    const _ipt = await x.convertToImageInput(r1.images[0]);
    const nextBase = x.LoadImage({ image: _ipt });
    const _vaeEncode = x.VAEEncode({ pixels: nextBase, vae: ckpt.VAE, });
    sampler.set({ latent_image: _vaeEncode });
    for (const item of ['cat', 'dog', 'frog', 'woman']) {
        positive.inputs.text = `masterpiece, (${item}:1.3), on table`;
        r1 = await x.get();
    }
});
