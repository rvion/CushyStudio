import type { ComfyNodeSchema } from '../../models/ComfySchema'
import type { ProjectL } from '../../models/Project'

import { makeAutoObservable } from 'mobx'

import { searchMatches } from '../../csuite/utils/searchMatches'

export class ComfyNodeExplorerState {
   // globalSearch = ''
   name = ''
   input = ''
   output = ''
   category = ''
   constructor(public pj: ProjectL) {
      makeAutoObservable(this)
   }
   get nodeEntries(): [string, ComfyNodeSchema][] {
      return Object.entries(this.pj.schema.nodesByNameInComfy)
   }
   get matches(): [string, ComfyNodeSchema][] {
      const OUT: [string, ComfyNodeSchema][] = []
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
