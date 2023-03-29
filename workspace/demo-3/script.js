
WORKFLOW(async ($) => {
    // generate an empty table
    const ckpt = $.CheckpointLoaderSimple({ ckpt_name: 'AOM3A1_orangemixs.safetensors' });
    const latent = $.EmptyLatentImage({ width: 512, height: 512, batch_size: 1 });
    const positive = $.CLIPTextEncode({ text: 'masterpiece, chair', clip: ckpt });
    const negative = $.CLIPTextEncode({ text: '', clip: ckpt });
    const sampler = $.KSampler({ seed: 2123, steps: 20, cfg: 10, sampler_name: 'euler', scheduler: 'normal', denoise: 0.8, model: ckpt, positive, negative, latent_image: latent });
    const vae = $.VAEDecode({ samples: sampler, vae: ckpt });
    $.SaveImage({ filename_prefix: 'ComfyUI', images: vae });
    await $.get();
});
