# Win setup

```sh
python.exe --version
Python 3.10.6
```

```
pip install --upgrade virtualenv
virtualenv -p python3 venv
source venv/Scripts/activate
$ which python
/c/Users/user/dev/ComfyUI/venv/Scripts/python
python -m pip install -r requirements.txt
python main.py
```

https://gnuwin32.sourceforge.net/packages/wget.htm

```
function scoop() { powershell -ex unrestricted scoop.ps1 "$@" ;} && export -f scoop

curl -sSL --output ./models/checkpoints/v1-5-pruned-emaonly.ckpt         https://huggingface.co/runwayml/stable-diffusion-v1-5/resolve/main/v1-5-pruned-emaonly.ckpt
curl -sSL --output ./models/vae/vae-ft-mse-840000-ema-pruned.safetensors https://huggingface.co/stabilityai/sd-vae-ft-mse-original/resolve/main/vae-ft-mse-840000-ema-pruned.safetensors
curl -sSL --output ./models/checkpoints/AbyssOrangeMix2_hard.safetensors https://huggingface.co/WarriorMama777/OrangeMixs/resolve/main/Models/AbyssOrangeMix2/AbyssOrangeMix2_hard.safetensorc

du -sh ./models/checkpoints/v1-5-pruned-emaonly.ckpt
du -sh ./models/vae/vae-ft-mse-840000-ema-pruned.safetensors
du -sh ./models/checkpoints/AbyssOrangeMix2_hard.safetensors

```

Nvidia users should also install Xformers for a speed boost but can still run the software without it.
If you get the "Torch not compiled with CUDA enabled" error, uninstall torch with:

```
pip uninstall torch
pip install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cu117
pip install xformers
```
