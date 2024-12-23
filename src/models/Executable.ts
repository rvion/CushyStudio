import type { App, AppRef, CustomView, CustomViewRef } from '../cards/App'
import type { AppMetadata } from '../cards/AppManifest'
import type { CushyScriptL } from './CushyScript'

import { basename } from 'pathe'

import { asCushyAppID } from '../db/TYPES.gen'

export class LoadedCustomView<T = any> {
   constructor(
      public script: CushyScriptL,
      public ix: number,
      public def: CustomView<T>,
   ) {}

   get id(): CushyViewID {
      return (this.script.relPath + ':' + this.ix) as CushyViewID
   }

   get ref(): CustomViewRef<any> {
      return {
         id: this.id,
         /** this is a virtual property; only here so app refs can carry the type-level form information. */
         $PARAMS: 0,
      }
   }
}

export class Executable {
   constructor(
      public script: CushyScriptL,
      public ix: number,
      public def: App<any>,
   ) {}

   get ui() {
      return this.def.ui
   }

   get run() {
      return this.def.run
   }

   get canStartFromImage(): boolean {
      return this.def.canStartFromImage ?? false
   }

   get metadata(): Maybe<AppMetadata> {
      return this.def.metadata
   }

   get name(): string {
      return this.def.metadata?.name ?? basename(this.script.relPath)
   }

   get tags(): string[] {
      return this.def.metadata?.tags ?? []
   }

   get description(): Maybe<string> {
      return this.def.metadata?.description
   }

   get illustration(): Maybe<string> {
      return this.def.metadata?.illustration
   }

   get appID(): CushyAppID {
      return asCushyAppID(this.script.relPath + ':' + this.ix)
   }

   get ref(): AppRef<any> {
      return {
         id: this.appID,
         /** this is a virtual property; only here so app refs can carry the type-level form information. */
         $FIELDS: 0,
      }
   }
}
