import type { KnownModel_Base } from './KnownModel_Base'
import type { KnownModel_Name } from './KnownModel_Name'
import type { KnownModel_SavePath } from './KnownModel_SavePath'
import type { KnownModel_Type } from './KnownModel_Type'

import { Static, Type } from '@sinclair/typebox'

// prettier-ignore

export type ModelInfo = {
    "name": KnownModel_Name; // e.g. "ip-adapter_sd15_light.safetensors",
    "type": KnownModel_Type; // e.g. "IP-Adapter",
    "base": KnownModel_Base; // e.g. "SD1.5",
    "save_path": KnownModel_SavePath; // e.g. "ipadapter",
    "description": string; // e.g. "You can use this model in the [a/ComfyUI IPAdapter plus](https://github.com/cubiq/ComfyUI_IPAdapter_plus) extension.",
    "reference": string; // e.g. "https://huggingface.co/h94/IP-Adapter",
    "filename": string; // e.g. "ip-adapter_sd15_light.safetensors",
    "url": string; // e.g. "https://huggingface.co/h94/IP-Adapter/resolve/main/models/ip-adapter_sd15_light.safetensors"
};

export const ModelInfo_Schema = Type.Object(
    {
        name: Type.Any(),
        type: Type.Any(),
        base: Type.Any(),
        save_path: Type.Any(),
        description: Type.String(),
        reference: Type.String(),
        filename: Type.String(),
        url: Type.String(),
    },
    { additionalProperties: false },
)
/* ✅ */ type ModelInfo2 = Static<typeof ModelInfo_Schema>
/* ✅ */ const _t1: ModelInfo = 0 as any as ModelInfo2
/* ✅ */ const _t2: ModelInfo2 = 0 as any as ModelInfo
