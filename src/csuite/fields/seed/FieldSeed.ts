import type { CSchema } from '../../model/CSchema'
import type { FieldConstructor } from '../../model/FieldConstructor'
import type { Patch } from '../../model/Patch'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'

import { produce } from 'immer'

import { Field } from '../../model/Field'
import { registerFieldClass } from '../WidgetUI.DI'
import { getGlobalSeeder, type Seeder } from './Seeder'

type SeedMode = 'randomize' | 'fixed' | 'last'

// #region Config
export type Field_seed_config = Field_seed['::Config']
type Field_seed_ownConfig = {
   default?: number
   defaultMode?: SeedMode
   min?: number
   max?: number
   seeder?: Seeder
}

// #region Serial
export type Field_seed_serial = Field_seed['::Serial']
type Field_seed_ownSerial = {
   $: 'seed'
   val?: number
   mode?: SeedMode
}

// #region Value
export type Field_seed_value = number
export type Field_seed_unchecked = Field_seed_value | undefined

// #region Types
export interface Field_seed {
   '::Type': 'seed'
   '::OwnConfig': Field_seed_ownConfig
   '::OwnSerial': Field_seed_ownSerial
   '::Value': Field_seed_value
   '::Setvalue': Field_seed_value
   '::Unchecked': Field_seed_unchecked
   '::Child': never
   '::Opts': unknown
   '::OwnPatch': Patch<'seed'>
}

// STATE
export class Field_seed extends Field {
   // #region type
   static readonly type: 'seed' = 'seed'
   private static readonly unsetSerial: Field_seed_serial = { $: 'seed' }
   static override migrateSerial(): undefined {}
   static readonly codeForTypescriptValue = (config: Field_seed_config): string => 'Z.Seed'
   static generateSerial(
      value: Maybe<Field_seed['::Value']>,
      config: Field_seed['::Config'],
   ): Field_seed['::Serial'] {
      if (value == null) return this.unsetSerial

      return {
         $: 'seed',
         val: value,
      }
   }

   // #region Ctor
   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: CSchema<Field_seed>,
      initialMountKey: string,
      serial?: Field_seed_serial,
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)
   }

   // #region setOwnSerial
   protected zSetOwnSerial(next: Field_seed_serial): void {
      if (next.val == null) {
         const def = this.defaultValue
         if (def != null) next = produce(next, (draft) => void (draft.val = def))
      }
      if (next.mode == null) {
         const def = this.defaultMode
         if (def != null) next = produce(next, (draft) => void (draft.mode = def))
      }

      this.zAssignNewSerial(next)
   }

   // #region validation
   get zOwnConfigSpecificProblems(): Problem_Ext {
      return null
   }

   get zOwnTypeSpecificProblems(): Problem_Ext {
      return null
   }

   get zIsOwnSet(): boolean {
      return this.zSerial.val != null
   }

   // #region changes
   get zHasChanges(): boolean {
      if (this.zSerial.mode !== this.defaultMode) return true
      if (this.zSerial.mode === 'fixed') return this.zValue !== this.defaultValue
      return false
   }

   // #region misc
   get defaultMode(): SeedMode {
      return this.zConfig.defaultMode ?? 'randomize'
   }

   get defaultValue(): number | undefined {
      return this.zConfig.default
   }

   setMode = (mode: SeedMode): void => {
      if (this.zSerial.mode === mode) return
      this.zRunInTransaction(() => this.zPatchSerial((draft) => void (draft.mode = mode)))
   }

   setToFixed = (val?: number): void => {
      this.zRunInTransaction(() => {
         this.zPatchSerial((draft) => {
            draft.mode = 'fixed'
            if (val != null) draft.val = val
         })
      })
   }

   setToRandomize(): void {
      if (this.zSerial.mode === 'randomize') return
      this.zRunInTransaction(() => this.zPatchSerial((draft) => void (draft.mode = 'randomize')))
   }

   // #region value
   get zValue(): Field_seed_value {
      return this.zValue_or_fail
   }

   set zValue(val: number) {
      if (this.zSerial.mode === 'fixed' && this.zSerial.val === val) return
      // 🔴 a moitié faux
      this.zRunInTransaction(() => {
         this.zPatchSerial((draft) => void (draft.val = val))
      })
   }

   get zValue_or_fail(): number {
      const val = this.zValue_unchecked
      if (val == null) throw new Error('Field_seed.zValue_or_fail: not set')
      return val
   }

   get zValue_or_zero(): number {
      return this.zValue_unchecked ?? 0
   }

   get zValue_unchecked(): number | undefined {
      return this.computeValue()
   }

   override zIsValueEqual(other: Field): boolean {
      if (!(other instanceof Field_seed)) return false
      return this.zValue_unchecked === other.zValue_unchecked
   }

   private computeValue(): number | undefined {
      const seeder = this.zConfig.seeder ?? getGlobalSeeder()
      const count = seeder.count
      const mode = this.zSerial.mode ?? this.zConfig.defaultMode ?? 'randomize'
      return mode === 'randomize' //
         ? Math.floor(Math.random() * 9_999_999)
         : this.zSerial.val
   }

   // #region patches
   public static readonly patchedSerialPaths: readonly string[] = Object.freeze(['val', 'mode'])
}

registerFieldClass('seed', Field_seed)
Field_seed satisfies FieldConstructor<Field_seed>
