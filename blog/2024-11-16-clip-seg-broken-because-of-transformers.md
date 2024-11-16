the `Input image size (352*352) doesn't match model (224*224).` error

- first found https://github.com/comfyanonymous/ComfyUI/issues/5402
  - offers to downgrade transformers to 4.45.0
  - somewhat satisfactory answer, but looking if a more recent fix exists

- then found https://github.com/huggingface/transformers/issues/34415
  - confirms its broken with 4.46.0
  - poor interractions with transformers team.

advice to udpate transformers version
    - 4.46.1 not working either according to me
    - 4.46.2 neither according to https://github.com/huggingface/transformers/issues/34415#issuecomment-2466558101

misc:

```shell
wsl
docker exec -it comfyui bash
pip show transformers
# Name: transformers
# Version: 4.46.1
# Summary: State-of-the-art Machine Learning for JAX, PyTorch and TensorFlow
# Home-page: https://github.com/huggingface/transformers
# Author: The Hugging Face team (past and future) with the help of all our contributors (https://github.com/huggingface/transformers/graphs/contributors)
# Author-email: transformers@huggingface.co
# License: Apache 2.0 License
# Location: /usr/local/lib/python3.11/site-packages
# Requires: filelock, huggingface-hub, numpy, packaging, pyyaml, regex, requests, safetensors, tokenizers, tqdm
# Required-by: clip-interrogator, compel, peft

pip index versions transformers
# Available versions: 4.46.2, 4.46.1, 4.45.2, 4.45.1, 4.45.0, 4.44.2, 4.44.1, 4.44.0, 4.43.4, 4.43.3, 4.43.2, 4.43.1, 4.43.0, 4.42.4, 4.42.3, 4.42.2, 4.42.1, 4.42.0, 4.41.2, 4.41.1, 4.41.0, 4.40.2, 4.40.1, 4.40.0, 4.39.3, 4.39.2, 4.39.1, 4.39.0, 4.38.2, 4.38.1, 4.38.0, 4.37.2, 4.37.1, 4.37.0, 4.36.2, 4.36.1, 4.36.0, 4.35.2, 4.35.1, 4.35.0, 4.34.1, 4.34.0, 4.33.3, 4.33.2, 4.33.1, 4.33.0, 4.32.1, 4.32.0, 4.31.0, 4.30.2, 4.30.1, 4.30.0, 4.29.2, 4.29.1, 4.29.0, 4.28.1, 4.28.0, 4.27.4, 4.27.3, 4.27.2, 4.27.1, 4.27.0, 4.26.1, 4.26.0, 4.25.1, 4.24.0, 4.23.1, 4.23.0, 4.22.2, 4.22.1, 4.22.0, 4.21.3, 4.21.2, 4.21.1, 4.21.0, 4.20.1, 4.20.0, 4.19.4, 4.19.3, 4.19.2, 4.19.1, 4.19.0, 4.18.0, 4.17.0, 4.16.2, 4.16.1, 4.16.0, 4.15.0, 4.14.1, 4.13.0, 4.12.5, 4.12.4, 4.12.3, 4.12.2, 4.12.1, 4.12.0, 4.11.3, 4.11.2, 4.11.1, 4.11.0, 4.10.3, 4.10.2, 4.10.1, 4.10.0, 4.9.2, 4.9.1, 4.9.0, 4.8.2, 4.8.1, 4.8.0, 4.7.0, 4.6.1, 4.6.0, 4.5.1, 4.5.0, 4.4.2, 4.4.1, 4.4.0, 4.3.3, 4.3.2, 4.3.1, 4.3.0, 4.2.2, 4.2.1, 4.2.0, 4.1.1, 4.1.0, 4.0.1, 4.0.0, 3.5.1, 3.5.0, 3.4.0, 3.3.1, 3.3.0, 3.2.0, 3.1.0, 3.0.2, 3.0.1, 3.0.0, 2.11.0, 2.10.0, 2.9.1, 2.9.0, 2.8.0, 2.7.0, 2.6.0, 2.5.1, 2.5.0, 2.4.1, 2.4.0, 2.3.0, 2.2.2, 2.2.1, 2.2.0, 2.1.1, 2.1.0, 2.0.0, 0.1
#   INSTALLED: 4.46.1
#   LATEST:    4.46.2

pip install transformers==4.45.0
pip install transformers==4.46.2
```
