import type { CSchema } from '../'
import type { Selectorable } from '../selector/Selectorable'
import type { CSchemaNeighborhood } from './CSchemaTraversal'
import type { SchemaWithSerialPath } from './FieldConstructor'

/** basically a schema at a specific postion in the tree */
export class CShape implements Selectorable<CShape> {
   constructor(
      public schema: CSchema,
      public zMountKey: string,
      public zParent: CShape | null,
   ) {}

   public get zPath(): string {
      return this.zParent ? `${this.zParent.zPath}->${this.zMountKey}` : this.zMountKey
   }

   public get zUid(): string {
      return this.schema.uid
   }

   public get zConfig() {
      return this.schema.config
   }

   public get zAncestors(): CShape[] {
      return this.zParent ? [this.zParent, ...this.zParent.zAncestors] : []
   }

   public get zDescendants(): CShape[] {
      const queue = this.zChildrenAll
      const result: CShape[] = []
      while (queue.length > 0) {
         const current = queue.shift()
         if (current) {
            result.push(current)
            queue.push(...current.zChildrenAll)
         }
      }
      return result
   }

   /** schema have no notion of `Active`, so we just consider all branches */
   public get zChildrenActive(): CShape[] {
      return this.zChildrenAll
   }

   public get zChildrenAll(): CShape[] {
      const chilren: CSchemaNeighborhood<string> = this.schema.children
      const edges: Record<string, SchemaWithSerialPath> = chilren.edges
      const result: CShape[] = Object.entries(edges).map(([key, value]) => {
         return new CShape(value.schema, key, this)
      })
      return result
   }

   public get zType(): CATALOG.AllFieldTypes {
      return this.schema.type
   }
}
