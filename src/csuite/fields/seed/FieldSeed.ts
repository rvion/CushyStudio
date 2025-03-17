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
export type Field_seed_config = Field_seed['$config']
type Field_seed_ownConfig = {
   default?: number
   defaultMode?: SeedMode
   min?: number
   max?: number
   seeder?: Seeder
}

// #region Serial
export type Field_seed_serial = Field_seed['$serial']
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
   $type: 'seed'
   $ownConfig: Field_seed_ownConfig
   $ownSerial: Field_seed_ownSerial
   $value: Field_seed_value
   $setValue: Field_seed_value
   $unchecked: Field_seed_unchecked
   $child: never
   $opts: unknown
   $ownPatch: Patch<'seed'>
}

// STATE
export class Field_seed extends Field {
   // #region type
   static readonly type: 'seed' = 'seed'
   private static readonly unsetSerial: Field_seed_serial = { $: 'seed' }
   static override migrateSerial(): undefined {}
   static readonly codeForTypescriptValue = (config: Field_seed_config): string => 'Z.Seed'
   static generateSerial(
      value: Maybe<Field_seed['$value']>,
      config: Field_seed['$config'],
   ): Field_seed['$serial'] {
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
   protected setOwnSerial(next: Field_seed_serial): void {
      if (next.val == null) {
         const def = this.defaultValue
         if (def != null) next = produce(next, (draft) => void (draft.val = def))
      }
      if (next.mode == null) {
         const def = this.defaultMode
         if (def != null) next = produce(next, (draft) => void (draft.mode = def))
      }

      this.assignNewSerial(next)
   }

   // #region validation
   get ownConfigSpecificProblems(): Problem_Ext {
      return null
   }

   get ownTypeSpecificProblems(): Problem_Ext {
      return null
   }

   get isOwnSet(): boolean {
      return this.serial.val != null
   }

   // #region changes
   get hasChanges(): boolean {
      if (this.serial.mode !== this.defaultMode) return true
      if (this.serial.mode === 'fixed') return this.value !== this.defaultValue
      return false
   }

   // #region misc
   get defaultMode(): SeedMode {
      return this.config.defaultMode ?? 'randomize'
   }

   get defaultValue(): number | undefined {
      return this.config.default
   }

   setMode = (mode: SeedMode): void => {
      if (this.serial.mode === mode) return
      this.runInTransaction(() => this.patchSerial((draft) => void (draft.mode = mode)))
   }

   setToFixed = (val?: number): void => {
      this.runInTransaction(() => {
         this.patchSerial((draft) => {
            draft.mode = 'fixed'
            if (val != null) draft.val = val
         })
      })
   }

   setToRandomize(): void {
      if (this.serial.mode === 'randomize') return
      this.runInTransaction(() => this.patchSerial((draft) => void (draft.mode = 'randomize')))
   }

   // #region value
   get value(): Field_seed_value {
      return this.value_or_fail
      // const seeder = this.config.seeder ?? getGlobalSeeder()
      // const count = seeder.count
      // const mode = this.serial.mode ?? this.config.defaultMode ?? 'randomize'
      // return mode === 'randomize' //
      //     ? Math.floor(Math.random() * 9_999_999)
      //     : this.serial.val ?? this.config.default ?? 0
   }

   set value(val: number) {
      if (this.serial.mode === 'fixed' && this.serial.val === val) return
      // 🔴 a moitié faux
      this.runInTransaction(() => {
         this.patchSerial((draft) => void (draft.val = val))
      })
   }

   get value_or_fail(): number {
      const val = this.value_unchecked
      if (val == null) throw new Error('Field_seed.value_or_fail: not set')
      return val
   }

   get value_or_zero(): number {
      return this.value_unchecked ?? 0
   }

   get value_unchecked(): number | undefined {
      return this.computeValue()
   }

   override isValueEqual(other: Field): boolean {
      if (!(other instanceof Field_seed)) return false
      return this.value_unchecked === other.value_unchecked
   }

   private computeValue(): number | undefined {
      const seeder = this.config.seeder ?? getGlobalSeeder()
      const count = seeder.count
      const mode = this.serial.mode ?? this.config.defaultMode ?? 'randomize'
      return mode === 'randomize' //
         ? Math.floor(Math.random() * 9_999_999)
         : this.serial.val
   }

   // #region patches
   public static readonly patchedSerialPaths: readonly string[] = Object.freeze(['val', 'mode'])
}

registerFieldClass('seed', Field_seed)
Field_seed satisfies FieldConstructor<Field_seed>
