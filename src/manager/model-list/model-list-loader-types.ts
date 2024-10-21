import type { KnownModel_Base } from './KnownModel_Base'
import type { KnownModel_Name } from './KnownModel_Name'
import type { KnownModel_SavePath } from './KnownModel_SavePath'
import type { KnownModel_Type } from './KnownModel_Type'
import type { Static } from '@sinclair/typebox'

import { Type } from '@sinclair/typebox'

const K: ModelInfo = {
    name: 'TEMP_briaai_RMBG-1.4',
    type: 'controlnet',
    base: 'SDXL',
    save_path: 'custom_nodes/ComfyUI-BRIA_AI-RMBG/RMBG-1.4',
    description: '<3 stuff',
    reference: 'https://huggingface.co/briaai/RMBG-1.4',
    filename: 'model.pth',
    url: 'https://huggingface.co/briaai/RMBG-1.4/resolve/main/model.pth?download=true',
}

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
    "size"?: string; // e.g.  "698.4MB"
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
        size: Type.Optional(Type.String()),
    },
    { additionalProperties: false },
)
/* ✅ */ type ModelInfo2 = Static<typeof ModelInfo_Schema>
/* ✅ */ const _t1: ModelInfo = 0 as any as ModelInfo2
/* ✅ */ const _t2: ModelInfo2 = 0 as any as ModelInfo
