import type { KnownComfyPluginTitle } from '../generated/KnownComfyPluginTitle'
import type { KnownComfyPluginURL } from '../generated/KnownComfyPluginURL'
import type { ComfyManagerPluginID } from './ComfyManagerPluginID'

import { Type } from '@sinclair/typebox'
import * as v from 'valibot'

export type ComfyManagerPluginInfo = {
   // required
   author: string // "Dr.Lt.Data",
   title: KnownComfyPluginTitle // "ComfyUI-Manager",
   id: ComfyManagerPluginID // Added in 2024-??
   reference: string // "https://github.com/ltdrdata/ComfyUI-Manager",
   files: KnownComfyPluginURL[] // ["https://github.com/ltdrdata/ComfyUI-Manager"],
   install_type: string // "git-clone",
   description: string // "ComfyUI-Manager itself is also a custom node."

   // optional
   preemptions?: string[] // ❓
   pip?: string[] // [ "ultralytics" ],
   nodename_pattern?: string // "Inspire$",
   apt_dependency?: string[] // [ "rustc", "cargo" ],
   js_path?: string // "strimmlarn",
}

// #region valibot

export const ComfyManagerPluginInfo_valibot = v.strictObject({
   // required
   author: v.string(),
   title: v.string(),
   id: v.string(),
   reference: v.string(),
   files: v.array(v.string()),
   install_type: v.string(),
   description: v.string(),

   // optional
   preemptions: v.optional(v.array(v.string())),
   pip: v.optional(v.array(v.string())),
   nodename_pattern: v.optional(v.string()),
   apt_dependency: v.optional(v.array(v.string())),
   js_path: v.optional(v.string()),
})

// #region typebox
export const CustomNodesInfo_Schema = Type.Object(
   {
      author: Type.String(),
      title: Type.String() as any,
      reference: Type.String(),
      files: Type.Array(Type.String()) as any,
      install_type: Type.String(),
      description: Type.String(),
      preemptions: Type.Optional(Type.Array(Type.String())),
      //
      pip: Type.Optional(Type.Array(Type.String())),
      nodename_pattern: Type.Optional(Type.String()),
      apt_dependency: Type.Optional(Type.Array(Type.String())),
      js_path: Type.Optional(Type.String()),
   },
   { additionalProperties: false },
)
