import type { KnownCustomNode_File } from './KnownCustomNode_File'
import type { KnownCustomNode_Title } from './KnownCustomNode_Title'

import { Type } from '@sinclair/typebox'

// prettier-ignore
export type PluginInfo = {
    "title": KnownCustomNode_Title;  // "ComfyUI-Manager",
    "files": KnownCustomNode_File[];  // ["https://github.com/ltdrdata/ComfyUI-Manager"],
    "author": string;                // "Dr.Lt.Data",
    "reference": string;             // "https://github.com/ltdrdata/ComfyUI-Manager",
    "install_type": string;          // "git-clone",
    "description": string;           // "ComfyUI-Manager itself is also a custom node."

    // optional
    pip?: string[];                  // [ "ultralytics" ],
    nodename_pattern?: string;       // "Inspire$",
    apt_dependency?: string[];       // [ "rustc", "cargo" ],
    js_path?: string;                // "strimmlarn",
};

export const CustomNodesInfo_Schema = Type.Object(
    {
        author: Type.String(),
        reference: Type.String(),
        title: Type.String() as any,
        files: Type.Array(Type.String()) as any,
        install_type: Type.String(),
        description: Type.String(),
        //
        pip: Type.Optional(Type.Array(Type.String())),
        nodename_pattern: Type.Optional(Type.String()),
        apt_dependency: Type.Optional(Type.Array(Type.String())),
        js_path: Type.Optional(Type.String()),
    },
    { additionalProperties: false },
)

export type CustomNodeFile = {
    custom_nodes: PluginInfo[]
}
