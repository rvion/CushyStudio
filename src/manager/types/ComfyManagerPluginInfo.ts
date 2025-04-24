import type { KnownComfyPluginTitle } from '../generated/KnownComfyPluginTitle'
import type { KnownComfyPluginURL } from '../generated/KnownComfyPluginURL'
import type { ComfyManagerPluginID } from './ComfyManagerPluginID'

import { Type } from '@sinclair/typebox'
import * as v from 'valibot'

export type ComfyManagerPluginInfo = {
   // required
   author: string // "Dr.Lt.Data",
   title: KnownComfyPluginTitle // "ComfyUI-Manager",
   reference: string // "https://github.com/ltdrdata/ComfyUI-Manager",
   files: KnownComfyPluginURL[] // ["https://github.com/ltdrdata/ComfyUI-Manager"],
   install_type: string // "git-clone",
   description: string // "ComfyUI-Manager itself is also a custom node."

   // optional, but shouldn't
   // optional
   id?: ComfyManagerPluginID // Added in 2024-??
   preemptions?: string[] // ❓
   pip?: string[] // [ "ultralytics" ],
   nodename_pattern?: string // "Inspire$",
   apt_dependency?: string[] // [ "rustc", "cargo" ],
   js_path?: string // "strimmlarn",
   version?: string
}

// #region valibot

export const ComfyManagerPluginInfo_valibot = v.strictObject({
   // required
   author: v.string(),
   reference: v.string(),
   files: v.array(v.string()),
   install_type: v.string(),
   description: v.string(),

   // optional, but shouldn't, so they'll pre-emptively auto-fixed before validation
   id: v.string(), // on 2024-11-09, 579 fields are missing this
   title: v.string(), // on 2024-11-09, 1 field is missing this

   // optional
   preemptions: v.optional(v.array(v.string())),
   pip: v.optional(v.array(v.string())),
   nodename_pattern: v.optional(v.string()),
   apt_dependency: v.optional(v.array(v.string())),
   js_path: v.optional(v.string()),
   version: v.optional(v.string()),

   // optional ?
   // (probably not really well specified, sicne some of those only appear one or two times)
   tags: v.optional(v.array(v.string())), // 🔶 as of 2024-11-09, this shows only one time
})
