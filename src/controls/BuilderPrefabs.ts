import type { CushySchemaBuilder } from './CushyBuilder'

import { nanoid } from 'nanoid'

export class BuilderPrefabs {
   _uid = nanoid(4)

   constructor(public b: CushySchemaBuilder) {}
}
