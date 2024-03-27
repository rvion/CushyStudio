#

temporary page holding infos to reproduce rvion ComfyUI setup

```
192.168.1.18
```


# Go to your Your ComfyUI root directory, for my example:

cd <...>\ComfyUI_windows_portable

conda create -p ./python_miniconda_env/ComfyUI python=3.11

# conda will tell what command to use to activate the env
conda activate <...>\ComfyUI_windows_portable\python_miniconda_env\ComfyUI

# update pip
python -m pip install --upgrade pip

# You can using following command to installing CUDA only in the miniconda environment you just created if you don't want to donwload and install it manually & globally:
# conda install -c "nvidia/label/cuda-12.1.0" cuda-toolkit

# Install the main packahes
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121

pip install -r ./ComfyUI/requirements.txt

# Then go to ComfyUI-3D-Pack directory under the ComfyUI Root Directory\ComfyUI\custom_nodes for my example is:
cd <...>\ComfyUI_windows_portable\ComfyUI\custom_nodes\ComfyUI-3D-Pack


----------

- add ip (e.g 192.168.1.18) in here `configs\system.conf`