import type { Field } from './Field'
import type { FieldId } from './FieldId'

import { runInAction } from 'mobx'

import { bang } from '../utils/bang'
import { Transaction } from './Transaction'

/**
 * you need one, and only one (singleton) per project
 * allow to inject the proper form config for your specific project.
 * to avoid problem with hot-reload, export an instance from a module directly and use it from there.
 *
 * 🔶 this class is not observable as of 2025-02-07
 */
export class Repository {
   /* STORE ------------------------------------------------------------ */
   /** all root fields (previously called entities) */
   readonly allDocuments: Map<FieldId, Field> = new Map()
   get documentCount(): number {
      return this.allDocuments.size
   }

   /** all fiels, root or not */
   allFields: Map<FieldId, Field> = new Map()
   get fieldCount(): number {
      return this.allFields.size
   }

   /** all fields by given type */
   allFieldsByType: Map<string, Map<string, Field>> = new Map()

   getEntityByID(entityId: FieldId): Maybe<Field> {
      return this.allDocuments.get(entityId)
   }

   getFieldByID(fieldId: FieldId): Maybe<Field> {
      return this.allFields.get(fieldId)
   }

   /* 📌 STATS --------------------------------------------------------- */
   /** how many transactions have been executed on that repo */
   transactionCount: number = 0
   updateCount: number = 0
   createCount: number = 0
   deleteCount: number = 0

   /* 📌 FULL-CLEAR ---------------------------------------------------- */
   /**
    * fully clear the entity-map + reset stats
    * @since 2024-07-08
    * @stability unstable
    */
   reset(): void {
      // we must reset entities first, since reseting entities is done in a transaction
      // so it will increase the number of additions and deletions
      this.resetEntities()
      this.resetStats()
   }

   resetStats(): void {
      this.transactionCount = 0
      this.updateCount = 0
      this.createCount = 0
      this.deleteCount = 0
   }
   resetEntities(): void {
      this.runInTransaction(() => {
         for (const root of this.allDocuments.values()) {
            root.disposeTree()
         }
      })
      if (this.allFields.size !== 0) {
         throw new Error(
            `[❌] INVARIANT VIOLATION: allFields should be empty but it's ${this.allFields.size} (${[
               ...this.allFields.values(),
            ].map((i) => [i.type, i.summary])})`,
         )
      }
      if (this.allDocuments.size !== 0)
         throw new Error(
            `[❌] INVARIANT VIOLATION: allRoots should be empty but it's ${this.allDocuments.size} (${[
               ...this.allDocuments.values(),
            ].map((i) => [i.type, i.summary])})`,
         )
   }

   /* 📌 TEMP ---------------------------------------------------------- */
   private logs: string[] = []
   startRecording(): void {
      this.logs.splice(0, this.logs.length)
   }

   debugLog(msg: string): void {
      this.logs.push(msg)
   }

   endRecording(): string[] {
      // console.log(this.logs.join('\n'))
      return this.logs.slice()
   }

   endRecordingAndLog(): string[] {
      console.log(this.logs.join('\n'))
      return this.logs.slice()
   }

   /* ------------------------------------------------------------------ */
   /**
    * return all currently instanciated widgets
    * field of a given input type
    */
   getWidgetsByType = <W extends Field = Field>(type: string): W[] => {
      const typeStore = this.allFieldsByType.get(type)
      if (!typeStore) return []
      return Array.from(typeStore.values()) as W[]
   }

   /**
    * un-register field
    * should ONLY be called by `field.dispose()`
    */
   _unregisterField(field: Field, tct: Transaction): void {
      // unregister field in `this._allWidgets`
      this.allFields.delete(field._uid)
      this.allDocuments.delete(field._uid)

      // unregister field in `this._allWidgetsByType(<type>)`
      tct.trackAsDeleted(field)

      const typeStore = this.allFieldsByType.get(field.type)
      if (typeStore) typeStore.delete(field._uid)
   }

   /** only called when  a new field is created */
   _registerField(field: Field, tct: Transaction): void {
      // creations
      if (this.allFields.has(field._uid)) {
         throw new Error(`[🔴] INVARIANT VIOLATION: field already registered: ${field._uid}`)
      }

      // 🔴 creations ⁉️
      tct.trackAsCreated(field)

      if (field.root == field) {
         this.allDocuments.set(field._uid, field)
      }

      // register field in `this._allWidgets
      this.allFields.set(field._uid, field)

      // register field in `this._allWidgetsByType(<type>)
      const prev = this.allFieldsByType.get(field.type)
      if (prev == null) {
         this.allFieldsByType.set(field.type, new Map([[field._uid, field]]))
      } else {
         prev.set(field._uid, field)
      }
   }

   tct: Maybe<Transaction> = null

   runInTransaction<A>(
      /** serial mutation to run */
      fn: (tct: Transaction) => A,

      /**
       * field the mutation is scoped to
       * it is expected the mutation will only touch this field and its children
       * it can't touch anything upward in the tree
       *
       * 🪖 WHY ????? PAST ME; WHY DID YOU CAME TO THE SAME LIMITATION AS MOBX STATE TREE?
       * 🪖 DOCUMENT THIS SHIT NEXT TIME
       */
      // field: Field,
   ): A {
      return runInAction(() => {
         const isRoot = this.tct == null
         const tct = (this.tct ??= new Transaction(this /* tctMode */))
         const OUT = fn(tct)

         // ONLY COMMIT THE ROOT TRANSACTION
         if (isRoot) {
            // for now, we execute the commit callbacks outside of the transaction
            // we may consider swapping the order of the next two lines if need be.
            this.tct = null
            tct.commit() // <-- apply the callback once every update is done, OUTSIDE of the transaction
            this.lastTransaction = tct
         }
         return OUT
      })
   }

   /**
    * last known transactions;
    * added to help with testing
    */
   lastTransaction: Maybe<Transaction> = null

   get tracked(): RepositoryStats {
      return {
         //
         documentCount: this.documentCount,
         fieldCount: this.fieldCount,
         transactionCount: this.transactionCount,
         //
         createCount: this.createCount,
         updateCount: this.updateCount,
         deleteCount: this.deleteCount,
      }
   }
}

export type RepositoryStats = {
   transactionCount: number
   updateCount: number
   createCount: number
   deleteCount: number
   documentCount: number
   fieldCount: number
}

// REPOSITORY DI -------------------------------------------------------------------------
let globalRepository: Maybe<Repository> = null

export function getGlobalRepository(): Repository {
   globalRepository = globalRepository ||= new Repository()
   return bang(globalRepository)
}
