# Win setup

```sh
python.exe --version
Python 3.10.6
```

```sh
python -m pip install --upgrade virtualenv
python -m virtualenv -p /c/Python31010/python.exe venv
source venv/Scripts/activate

which pip
/c/Users/user/dev/intuition/venv/Scripts/pip
(venv)

which python
/c/Users/user/dev/intuition/venv/Scripts/python
(venv)

cd ComfyUI
python -m pip install -r requirements.txt

# torch =======================================
# uninstall torch
pip uninstall torch torchvision torchaudio xformers
pip uninstall torch

pip install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cu117
pip install torch==2.0.0.dev20230128+cu118 torchvision==0.15.0.dev20230128+cu118 --index-url https://download.pytorch.org/whl/nightly/cu118

# cuda ========================================
# - v11.7 TODO
# - v11.8 🟢
# - v12.1 🟢

# cudnn ========================================
# versions =>                                                vA.A.A                  BB.B
# https://developer.download.nvidia.com/compute/redist/cudnn/v8.6.0/local_installers/11.8/
# https://developer.download.nvidia.com/compute/redist/cudnn/v8.7.0/local_installers/11.8/
# https://developer.download.nvidia.com/compute/redist/cudnn/v8.8.0/local_installers/11.8/
# https://developer.download.nvidia.com/compute/redist/cudnn/v8.8.0/local_installers/12.0/
# - 8.8.0.121

# Xformers ====================================
pip uninstall xformers
pip install xformers # ❌ default install => do not nork
pip install xformers==0.0.16+2166360.d20230112 # ❌
pip install xformers==0.0.17.dev451 # ❌
pip install xformers-0.0.17.dev451-cp310-cp310-win_amd64.whl # ❌

# manual compilation??
pip install ninja setuptools
pip install -v -U git+https://github.com/facebookresearch/xformers.git@main#egg=xformers
python -m xformers.info
# ❌ bug during installC:\Users\user\AppData\Local\Temp\pip-install-z7wvqf_f\xformers_86d323b8b5be416699b644839c0f36cb\third_party\flash-attention\csrc\flash_attn\cutlass\docs

# even mode manual setup ?
# https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Xformers
git clone https://github.com/facebookresearch/xformers.git --depth=1
cd xformers
git submodule update --init --recursive
python setup.py build
python setup.py bdist_wheel

# python -m venv venv
# ./venv/scripts/activate


pip install xformers-0.0.17.dev451-cp310-cp310-win_amd64.whl
python main.py
```

https://www.reddit.com/r/StableDiffusion/comments/11849sp/4090_33_its_windows_10/
https://developer.nvidia.com/cuda-downloads?target_os=Windows&target_arch=x86_64&target_version=10&target_type=exe_local
https://pypi.org/project/xformers/0.0.17.dev451/
https://pypi.org/project/xformers/0.0.17.dev451/#files
https://files.pythonhosted.org/packages/95/d1/e726ed516eef229117afbc2daac8e6e839bbb9f325514fed557564b9aaf5/xformers-0.0.17.dev451-cp310-cp310-win_amd64.whl

https://developer.download.nvidia.com/compute/redist/cudnn/v8.6.0/local_installers/11.8/
https://developer.download.nvidia.com/compute/redist/cudnn/v8.7.0/local_installers/11.8/
https://developer.download.nvidia.com/compute/redist/cudnn/v8.8.0/local_installers/11.8/
https://developer.download.nvidia.com/compute/redist/cudnn/v8.8.0/local_installers/12.0/
https://download.pytorch.org/whl/nightly/torch/


- CUDA is NVIDIA’s language/API for programming on the graphics card.
I’ve found it to be the easiest way to write really high performance programs run on the GPU.

- cuDNN is a library for deep neural nets built using CUDA.
It provides GPU accelerated functionality for common operations in deep neural nets.
You could use it directly yourself, but other libraries like TensorFlow already have built abstractions backed by cuDNN.

------------

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
