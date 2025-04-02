import type { KnownModel_Name } from '../CUSHY'
import type { Requirements } from '../manager/REQUIREMENTS/Requirements'

import { CSchema } from '../csuite/model/CSchema'

export { CSchema } from '../csuite/model/CSchema'

declare global {
   // eslint-disable-next-line @typescript-eslint/no-namespace
   namespace CSuite {
      type LocoSchemaExtension<$ extends { ҨSchema: CSchema<any> }> = {
         addRequirementOnComfyManagerModel(modelName: KnownModel_Name | KnownModel_Name[]): $['ҨSchema']
         addRequirements(requirements: Maybe<Requirements | Requirements[]>): $['ҨSchema']
      }

      export interface CSchemaExtensions<$ extends { ҨSchema: CSchema<any> }>
         extends LocoSchemaExtension<$> {}
   }
}

CSchema.addMIXIN({
   // 💬 2025-02-23 rvion:
   // check this still works
   get requirements(): Requirements[] {
      const value: Requirements[] = []
      Object.defineProperty(this, 'requirements', { value })
      return value
   },

   addRequirementOnComfyManagerModel(modelName: KnownModel_Name | KnownModel_Name[]): CSchema {
      this.addRequirements(
         typeof modelName === 'string'
            ? { type: 'modelInManager', modelName, optional: true }
            : modelName.map((mn) => ({ type: 'modelInManager', modelName: mn, optional: true })),
      )
      return this
   },

   addRequirements(requirements: Maybe<Requirements | Requirements[]>): CSchema {
      if (requirements == null) return this
      if (Array.isArray(requirements)) this.requirements.push(...requirements)
      else this.requirements.push(requirements)
      // this.🐌
      return this
   },
})
