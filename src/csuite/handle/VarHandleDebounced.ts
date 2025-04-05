import type { VarHandle } from './VarHandle'
import type { IReactionDisposer } from 'mobx'
import type { DependencyList } from 'react'

import { useEffect, useMemo } from 'react'

import { action, makeAutoObservable, reaction } from 'mobx'

export type SimultaneousConflictResolutionStrategy = 'follow' | 'lead'
export type DebounceParams = {
   /** delay (in miliseconds) to debounce (0 or null to disable) */
   delay: number
   /**
    * in case of a pending debounced change, what should we do
    * what if another component change the same variable while we have a debounced change pending
    *   - 'follow' => discard our pending change, and revert liveValue to the new real value
    *   - 'lead' => continue as expected: wait for our debounce period to end, and update the value
    */
   onConflict?: SimultaneousConflictResolutionStrategy
   /**
    * when debouncing is enabled, VarHandleDebounced stores an internal state
    * this tells us when this internal state should be discarded
    * typical usage: a form re-used to edit a different entity
    * the field should probably take the item id to be reset between item changes
    */
   deps: DependencyList
}

const voidFn = (): void => {}

export const useDebounced = <HANDLE extends VarHandle<any>>(
   handle: HANDLE,
   debounceParams?: Maybe<DebounceParams>,
): HANDLE & { hasPendingChanges: () => boolean } => {
   if (debounceParams == null) {
      // just here to have the same number of hooks in the two branches
      useMemo(voidFn, [])
      useEffect(voidFn, [])
      return { ...handle, hasPendingChanges: (): boolean => false }
   }
   const deps = debounceParams.deps
   const derivedHandle = useMemo(() => {
      const x = new VarHandleDebounced(handle, debounceParams)
      return {
         ...handle,
         get: x.get,
         set: x.set,
         setNull: x.setNull,
         hasPendingChanges: (): boolean => x.hasPendingChanges,
      }
   }, deps)
   useEffect(() => derivedHandle.disposer ?? undefined, [derivedHandle])
   return derivedHandle
}

class VarHandleDebounced<X> implements VarHandle<X> {
   disposer: Maybe<IReactionDisposer>
   timeout: Maybe<number> = null
   hasPendingChanges: boolean = false
   // useCleanup = () => useEffect(() => this.disposer ?? undefined, [this])

   get isNullable(): boolean { return Boolean(this.p.setNull) } // prettier-ignore

   private liveValue: Maybe<X>

   public delay: number
   public onConflict: SimultaneousConflictResolutionStrategy
   constructor(
      public p: VarHandle<X>,
      debounceParams: DebounceParams,
   ) {
      this.setNull =
         this.p.setNull == null //
            ? undefined
            : this._setNull_UNSAFE.bind(this)
      this.delay = debounceParams.delay
      this.onConflict = debounceParams.onConflict ?? 'follow'

      // if (this.p.debounce) {
      this.liveValue = p.get()
      if (this.liveValue == null && !this.isNullable) {
         this.liveValue = p.default
      }
      this.watchRemoteValue()
      makeAutoObservable(this)
   }

   get = (): Maybe<X> => {
      return this.liveValue
   }

   setNull: (() => void) | undefined

   private _setNull_UNSAFE(): void {
      if (this.timeout != null) clearTimeout(this.timeout)
      this.liveValue = null
      this.hasPendingChanges = true
      this.timeout = window.setTimeout(() => {
         this.p.setNull?.()
         this.timeout = null
         this.hasPendingChanges = false
      }, this.delay)
   }

   set = (nextVal: X): void => {
      if (this.timeout != null) clearTimeout(this.timeout)
      this.liveValue = nextVal
      this.hasPendingChanges = true
      this.timeout = window.setTimeout(
         action(() => {
            this.p.set(nextVal)
            this.timeout = null
            this.hasPendingChanges = false
         }),
         this.delay,
      )
   }

   watchRemoteValue = (): void => {
      this.disposer = reaction(
         (): Maybe<X> => this.p.get(),
         (val: Maybe<X>) => {
            if (this.timeout != null) {
               if (this.onConflict === 'lead') {
                  console.log('🔶 discarding remote change because conflict resolution set to "lead"')
                  return
               } else {
                  clearTimeout(this.timeout)
               }
            }
            this.liveValue = val
            this.hasPendingChanges = false
         },
      )
   }
}
