#/bin/bash

set -eux

curl -sSL --output ./ComfyUI/models/checkpoints/v1-5-pruned-emaonly.ckpt         https://huggingface.co/runwayml/stable-diffusion-v1-5/resolve/main/v1-5-pruned-emaonly.ckpt
curl -sSL --output ./ComfyUI/models/vae/vae-ft-mse-840000-ema-pruned.safetensors https://huggingface.co/stabilityai/sd-vae-ft-mse-original/resolve/main/vae-ft-mse-840000-ema-pruned.safetensors
curl -sSL --output ./ComfyUI/models/checkpoints/AbyssOrangeMix2_hard.safetensors https://huggingface.co/WarriorMama777/OrangeMixs/resolve/main/Models/AbyssOrangeMix2/AbyssOrangeMix2_hard.safetensorc

du -sh ./ComfyUI/models/checkpoints/v1-5-pruned-emaonly.ckpt
du -sh ./ComfyUI/models/vae/vae-ft-mse-840000-ema-pruned.safetensors
du -sh ./ComfyUI/models/checkpoints/AbyssOrangeMix2_hard.safetensors