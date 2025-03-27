import type { Field } from './Field'
import type { Repository } from './Repository'

export type TransactionSummary1 = {
   created: string[]
   updated: string[]
   deleted: string[]
}

export type TransactionSummary2 = TransactionSummary2Item[]
export type TransactionSummary2Item = {
   path: string
   type: 'create' | 'update' | 'delete'
}

export class Transaction {
   tower: Field[] = []

   constructor(
      public repo: Repository, // 🔴 Transaction mode is not used yet // public mode: TransactionMode,
   ) {}

   get summary1(): TransactionSummary1 {
      return {
         created: [...this.createdFields.values()].map((f) => f.zPath),
         updated: [...this.updatedFields.values()].map((f) => f.zPath),
         deleted: [...this.deletedFields.values()].map((f) => f.zPath),
      }
   }

   private _mkTransactionSummary2Item = (x: TransactionSummary2Item): TransactionSummary2Item => x
   get summary2(): TransactionSummary2 {
      return [
         ...[...this.createdFields.values()].map((f) =>
            this._mkTransactionSummary2Item({ path: f.zPath, type: 'create' }),
         ),
         ...[...this.updatedFields.values()].map((f) =>
            this._mkTransactionSummary2Item({ path: f.zPath, type: 'update' }),
         ),
         ...[...this.deletedFields.values()].map((f) =>
            this._mkTransactionSummary2Item({ path: f.zPath, type: 'delete' }),
         ),
      ]
   }

   createdFields: Set<Field> = new Set()
   updatedFields: Set<Field> = new Set()
   deletedFields: Set<Field> = new Set()

   trackAsCreated(field: Field): void {
      // console.log(`[🤠] 🟢`, field.path)
      if (this.createdFields.has(field)) return
      if (this.updatedFields.has(field)) throw new Error("❌ you're trying to mark as 'Created' a field that is already updated (so created before)") // prettier-ignore
      if (this.deletedFields.has(field)) throw new Error("❌ you're trying to mark as 'Created' a field that is already deleted") // prettier-ignore
      this.createdFields.add(field)
      // NO NEED TO BUBBLING HERE !
   }
   trackAsUpdated(field: Field): void {
      // console.log(`[🤠] 👛`, field.path)
      if (this.updatedFields.has(field)) return
      if (this.createdFields.has(field)) return
      if (this.deletedFields.has(field)) throw new Error("❌ you're trying to mark as 'Updated' a field that is already deleted") // prettier-ignore

      this.updatedFields.add(field)
      // NO NEED TO BUBBLING HERE !
      // if (field.parent) this.trackAsUpdated(field.parent)
   }
   trackAsDeleted(field: Field): void {
      // console.log(`[🤠] ❌`, field.path)
      if (this.deletedFields.has(field)) return
      if (this.createdFields.has(field)) this.createdFields.delete(field)
      if (this.updatedFields.has(field)) this.updatedFields.delete(field)
      this.deletedFields.add(field)
      // NO NEED TO BUBBLING HERE !
   }

   commit(): void {
      // bump transaction
      this.repo.transactionCount++
      this.repo.createCount += this.createdFields.size
      this.repo.updateCount += this.updatedFields.size
      this.repo.deleteCount += this.deletedFields.size

      // #region Create
      // compute all nodes from leaves that need to call effects
      // call them in order, non recursively.
      const createdFieldList = Array.from(this.createdFields.values())
         .map((field) => ({ field, depth: field.zTrueDepth }))
         .sort((a, b) => b.depth - a.depth)

      for (const { field } of createdFieldList) {
         this.repo.debugLog(`🟢 ${`create`.padEnd(10)} ${field.zPath}`)
         field.zConfig.onInit?.(field)
      }

      // #region Update
      // compute all nodes from leaves that need to call effects
      // call them in order, non recursively.
      const updatedFieldList = Array.from(this.updatedFields.values())
         .map((field) => ({ field, depth: field.zTrueDepth }))
         .sort((a, b) => b.depth - a.depth)

      for (const { field } of updatedFieldList) {
         this.repo.debugLog(`👛 ${`update`.padEnd(10)} ${field.zPath}`)
         field.z_applySerialUpdateEffects()
      }

      for (const { field } of updatedFieldList) {
         this.repo.debugLog(`💙 ${`publish`.padEnd(10)} ${field.zPath}`)
         field.zRunPublications()
      }

      // #region Delete
      const deletedFieldList = Array.from(this.deletedFields.values())
         .map((field) => ({ field, depth: field.zTrueDepth }))
         .sort((a, b) => b.depth - a.depth)
      for (const { field } of deletedFieldList) {
         this.repo.debugLog(`❌ ${`delete`.padEnd(10)} ${field.zPath}`)
         // field.INTERNAL_applyOnDelete() // TODO
      }
   }
}
