first: ID: azb9hb1dtoe9m9
second: ID: 6m0k9825k8mikf


```sh
# clone comfy on network volue
cd /workspace/
git clone https://github.com/comfyanonymous/ComfyUI

# crate venv
cd /workspace/ComfyUI/
python3 -m venv .env

# install comfy
cd /workspace/ComfyUI/
source .env/bin/activate
pip install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cu121
pip install -r requirements.txt

# install comfy manager
cd /workspace/ComfyUI/custom_nodes
git clone https://github.com/ltdrdata/ComfyUI-Manager.git

# start **comfy**
cd /workspace/ComfyUI/
source .env/bin/activate
python main.py

# intall cloudflared for tunnel
# https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/get-started/create-local-tunnel/

# Add Cloudflare’s package signing key:
mkdir -p --mode=0755 /usr/share/keyrings
curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null

# Add Cloudflare’s apt repo to your apt repositories:
echo "deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared $(lsb_release -cs) main" |  tee /etc/apt/sources.list.d/cloudflared.list

# Update repositories and install cloudflared:
apt-get update && apt-get install cloudflared


cloudflared tunnel --url http://localhost:8188
```
