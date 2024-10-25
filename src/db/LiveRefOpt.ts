import type { BaseInst } from './BaseInst'
import type { LiveTable } from './LiveTable'
import type { TableName } from './TYPES.gen'

export class LiveRefOpt<
   //
   out Owner extends BaseInst<any>,
   out L extends BaseInst<any>,
> {
   /**
    * here, key is typed as string
    * for dumb variance reasons, so we can type
    *            VVV        VVV
    * LiveRefOpt<out Owner, out L>
    * */
   private key: string
   constructor(
      //
      public owner: Owner,
      key: keyof Owner['data'],
      public tableName: TableName,
   ) {
      this.key = key as any as string
   }

   get table(): LiveTable<any, any> {
      return cushy.db[this.tableName] as LiveTable<any, any>
   }

   get id(): Maybe<L['id']> {
      return (this.owner.data as any)[this.key]
   }

   /** unsafe version of item, that crashes if item not found */
   get itemOrCrash(): L {
      const db = this.owner.db
      if (this.id == null) throw new Error(`❌ LiveRefOpt.itemOrCrash: no id`)
      return this.table.getOrThrow(this.id)
   }

   get item(): Maybe<L> {
      const db = this.owner.db
      return this.table.get(this.id)
   }

   /** debuging string for pretty printing */
   get debugStr(): string {
      return `LiveRefOpt: ${this.owner.table.name}->${this.table.name}(${this.id})`
   }
}
