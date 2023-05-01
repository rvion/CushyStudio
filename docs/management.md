https://github.com/open-mmlab/mmcv/issues/1594
https://github.com/open-mmlab/mmcv/issues/1594#issuecomment-1219239657
https://github.com/ltdrdata/ComfyUI-Impact-Pack

```sh
pip install torch==2.0.0+cu118 torchvision==0.15.1+cu118 --extra-index-url https://download.pytorch.org/whl/cu118
pip install --use-pep517 --upgrade -r requirements.txt
pip install -U -I --no-deps https://files.pythonhosted.org/packages/d6/f7/02662286419a2652c899e2b3d1913c47723fc164b4ac06a85f769c291013/xformers-0.0.17rc482-cp310-cp310-win_amd64.whl
```

ComfyUI update script

```bash
# load venv
cd ~/dev/intuition
venv

# update comfy_clipseg
cd ~/dev/intuition/ComfyUI/custom_nodes/comfy_clipseg
git reset --hard
git remote -v
git pull

# update comfy_controlnet_preprocessors
cd ~/dev/intuition/ComfyUI/custom_nodes/comfy_controlnet_preprocessors
git remote -v
git pull


# updte ComfyUI_Cutoff
cd ~/dev/intuition/ComfyUI/custom_nodes/ComfyUI_Cutoff
git remote -v
git pull


# update ComfyUI-Impact-Pack
# https://github.com/ltdrdata/ComfyUI-Impact-Pack
# https://github.com/ltdrdata/ComfyUI-Impact-Pack#installation
cd ~/dev/intuition/ComfyUI/custom_nodes/ComfyUI-Impact-Pack
git remote -v
git pull
pip install -r requirements.txt  -U
# python
# >>> import mmcv
# >>> from mmcv.ops import get_compiling_cuda_version, get_compiler_version
# python -c 'import torch;print(torch.__version__);print(torch.version.cuda)'
# 2.0.0.dev20230128+cu118
# 11.8
# pip install mmcv==2.0.0 -f https://download.openmmlab.com/mmcv/dist/cu118/torch2.0/index.html

# update ComfyUI-nodes-hnmr
# https://github.com/hnmr293/ComfyUI-nodes-hnmr
cd ~/dev/intuition/ComfyUI/custom_nodes/ComfyUI-nodes-hnmr
git pull


# update efficiency-nodes-comfyui
# https://github.com/LucianoCirino/efficiency-nodes-comfyui
cd ~/dev/intuition/ComfyUI/custom_nodes/efficiency-nodes-comfyui
git remote -v
git pull

# update was suite
# https://github.com/WASasquatch/was-node-suite-comfyui/
cd ~/dev/intuition/ComfyUI/custom_nodes/was-node-suite-comfyui
git remove -v
git pull
pip install -r requirements.txt  -U


# update yk-node-suite-comfyui
# https://github.com/guoyk93/yk-node-suite-comfyui
cd ~/dev/intuition/ComfyUI/custom_nodes/yk-node-suite-comfyui
git remote -v
git pull
```
