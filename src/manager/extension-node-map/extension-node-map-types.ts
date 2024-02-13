import { Static, Type } from '@sinclair/typebox'
import { NodeNameInComfy } from 'src/models/Schema'

// FILE TYPE ------------------------------------------------------------------------
// wtf is this format...
export type ExtensionNodeMapFile = {
    [file: string /* ComfyUIManagerKnownCustomNode_File */]: [NodeNameInComfy[], ENMInfos]
}

// TYPE ------------------------------------------------------------------------
export type ENMInfos = {
    // always present
    title_aux: string // "Jovimetrix Composition Nodes",

    // optional
    author?: string // "amorano",
    nickname?: string // "Comfy Deploy",
    description?: string // "Webcams, GLSL shader, Media Streaming, Tick animation, Image manipulation,",
    nodename_pattern?: string // " \\(jov\\)$",
    title?: string // "Jovimetrix",
}

// SCHEMA ------------------------------------------------------------------------
export const ENMInfos_Schema = Type.Object(
    {
        title_aux: Type.String(),

        //
        author: Type.Optional(Type.String()),
        nickname: Type.Optional(Type.String()),
        description: Type.Optional(Type.String()),
        nodename_pattern: Type.Optional(Type.String()),
        title: Type.Optional(Type.String()),
    },
    { additionalProperties: false },
)

/* ✅ */ type ENMInfos2 = Static<typeof ENMInfos_Schema>
/* ✅ */ const _t1: ENMInfos = 0 as any as ENMInfos2
/* ✅ */ const _t2: ENMInfos2 = 0 as any as ENMInfos
