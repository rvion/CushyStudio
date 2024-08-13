misc notes while reviewing the PR:

- 1. there seems to have a new ip-adapter-faceid-plusv2 that came out yesteday: adding the related models such as 'ip-adapter-faceid-plusv2_sd15.bin' to the recommendation list

- 2. NNLatentUpscale
  - Seems to exists in two different custom nodes pack
  - I didn't have it.
  -  => Recommending both extensions
  -  => making it behind a flag in case custom node not installed
