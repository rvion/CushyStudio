import type { ParsedComfyUIObjectInfoNodeSchema } from '../../comfyui/ParsedComfyUIObjectInfoNodeSchema'
import type { ProjectL } from '../../models/Project'

import { makeAutoObservable } from 'mobx'

import { searchMatches } from '../../csuite/utils/searchMatches'

export class ComfyNodeExplorerState {
   // globalSearch = ''
   name: string = ''
   input: string = ''
   output: string = ''
   category: string = ''
   constructor(public pj: ProjectL) {
      makeAutoObservable(this)
   }
   get nodeEntries(): [string, ParsedComfyUIObjectInfoNodeSchema][] {
      return Object.entries(this.pj.schema.parseObjectInfo.nodesByNameInComfy)
   }
   get matches(): [string, ParsedComfyUIObjectInfoNodeSchema][] {
      const OUT: [string, ParsedComfyUIObjectInfoNodeSchema][] = []
      for (const [_nameInCushy, nodeSchema] of this.nodeEntries) {
         const nameInCushy = _nameInCushy.toLowerCase()
         const nameInComfy = nodeSchema.nameInComfy.toLowerCase()
         if (this.name && !(nameInCushy.includes(this.name) || nameInComfy.includes(this.name))) continue
         if (this.input) {
            const matches = nodeSchema.inputs.some((x) => searchMatches(x.nameInComfy, this.input))
            if (!matches) continue
         }
         if (this.output && !nodeSchema.outputs.some((x) => searchMatches(x.nameInComfy, this.output)))
            continue
         if (this.category && !nodeSchema.category.includes(this.category)) continue
         OUT.push([nameInCushy, nodeSchema])
      }
      return OUT
   }
}
