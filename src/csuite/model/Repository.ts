import type { Field } from './Field'

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
   /**
    * @deprecated
    * unimplemented; probably worth adding back as non-observable weakmap
    */
   getFieldByID(promptID: any): Field {
      throw new Error('Method not implemented.')
   }
   /* 📌 STATS --------------------------------------------------------- */
   /** how many transactions have been executed on that repo */
   transactionCount: number = 0
   updateCount: number = 0
   createCount: number = 0
   deleteCount: number = 0

   fieldCount: number = 0
   documentCount: number = 0

   /* 📌 FULL-CLEAR ---------------------------------------------------- */
   /**
    * fully clear the entity-map + reset stats
    * @since 2024-07-08
    * @stability unstable
    */
   reset(): void {
      this.fieldCount = 0
      this.documentCount = 0
      // we must reset entities first, since reseting entities is done in a transaction
      // so it will increase the number of additions and deletions
      this.resetStats()
   }

   resetStats(): void {
      this.transactionCount = 0
      this.updateCount = 0
      this.createCount = 0
      this.deleteCount = 0
   }

   /* 📌 TEMP ---------------------------------------------------------- */
   private logsEnabled = false
   private logs: string[] = []
   startRecording(): void {
      this.logsEnabled = true
      this.logs.length = 0
   }

   debugLog(msg: string): void {
      if (!this.logsEnabled) return

      this.logs.push(msg)
   }

   endRecording(): string[] {
      this.logsEnabled = false
      return this.logs.slice()
   }

   endRecordingAndLog(): string[] {
      console.log(this.logs.join('\n'))
      const logs = this.logs.slice()
      this.logs.length = 0
      return logs
   }

   /* ------------------------------------------------------------------ */

   /**
    * un-register field
    * should ONLY be called by `field.dispose()`
    */
   _unregisterField(field: Field, tct: Transaction): void {
      this.fieldCount -= 1
      if (field.zRoot == field) this.documentCount -= 1

      // unregister field in `this._allWidgetsByType(<type>)`
      tct.trackAsDeleted(field)
   }

   /** only called when  a new field is created */
   _registerField(field: Field, tct: Transaction): void {
      this.fieldCount += 1
      if (field.zRoot == field) this.documentCount += 1

      // 🔴 creations ⁉️
      tct.trackAsCreated(field)
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
      try {
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
      } catch (err) {
         console.error(`[❌ TRANSACTION FAILED] cannot rollback; salvaging the mutation and proceeding.`)
         console.error(err)
         // 💬 2025-03-13 rvion:
         // this is critical, we must not let the transaction in a bad state.
         // because otherwise, every future transaction will be scoped under the failed
         // transaction, and we will NEVER call commit => we will NEVER run the onChange callbacks
         // and everything will be slightly broken in weird ways.
         //   VVVVVVVVVV
         this.tct = null
         throw err
      }
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
