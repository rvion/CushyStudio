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
export type Field_seed_config = Field_seed['Ҩconfig']
type Field_seed_ownConfig = {
   default?: number
   defaultMode?: SeedMode
   min?: number
   max?: number
   seeder?: Seeder
}

// #region Serial
export type Field_seed_serial = Field_seed['Ҩserial']
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
   ['Ҩtype']: 'seed'
   ['ҨownConfig']: Field_seed_ownConfig
   ['ҨownSerial']: Field_seed_ownSerial
   ['Ҩvalue']: Field_seed_value
   ['Ҩsetvalue']: Field_seed_value
   ['Ҩunchecked']: Field_seed_unchecked
   ['Ҩchild']: never
   ['Ҩopts']: unknown
   ['ҨownPatch']: Patch<'seed'>
}

// STATE
export class Field_seed extends Field {
   // #region type
   static readonly type: 'seed' = 'seed'
   private static readonly unsetSerial: Field_seed_serial = { $: 'seed' }
   static override migrateSerial(): undefined {}
   static readonly codeForTypescriptValue = (config: Field_seed_config): string => 'Z.Seed'
   static generateSerial(
      value: Maybe<Field_seed['Ҩvalue']>,
      config: Field_seed['Ҩconfig'],
   ): Field_seed['Ҩserial'] {
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
   protected ϟsetOwnSerial(next: Field_seed_serial): void {
      if (next.val == null) {
         const def = this.defaultValue
         if (def != null) next = produce(next, (draft) => void (draft.val = def))
      }
      if (next.mode == null) {
         const def = this.defaultMode
         if (def != null) next = produce(next, (draft) => void (draft.mode = def))
      }

      this.ϟassignNewSerial(next)
   }

   // #region validation
   get ϟownConfigSpecificProblems(): Problem_Ext {
      return null
   }

   get ϟownTypeSpecificProblems(): Problem_Ext {
      return null
   }

   get ϟisOwnSet(): boolean {
      return this.ϟserial.val != null
   }

   // #region changes
   get ϟhasChanges(): boolean {
      if (this.ϟserial.mode !== this.defaultMode) return true
      if (this.ϟserial.mode === 'fixed') return this.ϟvalue !== this.defaultValue
      return false
   }

   // #region misc
   get defaultMode(): SeedMode {
      return this.ϟconfig.defaultMode ?? 'randomize'
   }

   get defaultValue(): number | undefined {
      return this.ϟconfig.default
   }

   setMode = (mode: SeedMode): void => {
      if (this.ϟserial.mode === mode) return
      this.ϟrunInTransaction(() => this.ϟpatchSerial((draft) => void (draft.mode = mode)))
   }

   setToFixed = (val?: number): void => {
      this.ϟrunInTransaction(() => {
         this.ϟpatchSerial((draft) => {
            draft.mode = 'fixed'
            if (val != null) draft.val = val
         })
      })
   }

   setToRandomize(): void {
      if (this.ϟserial.mode === 'randomize') return
      this.ϟrunInTransaction(() => this.ϟpatchSerial((draft) => void (draft.mode = 'randomize')))
   }

   // #region value
   get ϟvalue(): Field_seed_value {
      return this.ϟvalue_or_fail
      // const seeder = this.config.seeder ?? getGlobalSeeder()
      // const count = seeder.count
      // const mode = this.serial.mode ?? this.config.defaultMode ?? 'randomize'
      // return mode === 'randomize' //
      //     ? Math.floor(Math.random() * 9_999_999)
      //     : this.serial.val ?? this.config.default ?? 0
   }

   set ϟvalue(val: number) {
      if (this.ϟserial.mode === 'fixed' && this.ϟserial.val === val) return
      // 🔴 a moitié faux
      this.ϟrunInTransaction(() => {
         this.ϟpatchSerial((draft) => void (draft.val = val))
      })
   }

   get ϟvalue_or_fail(): number {
      const val = this.ϟvalue_unchecked
      if (val == null) throw new Error('Field_seed.value_or_fail: not set')
      return val
   }

   get ϟvalue_or_zero(): number {
      return this.ϟvalue_unchecked ?? 0
   }

   get ϟvalue_unchecked(): number | undefined {
      return this.computeValue()
   }

   override ϟisValueEqual(other: Field): boolean {
      if (!(other instanceof Field_seed)) return false
      return this.ϟvalue_unchecked === other.ϟvalue_unchecked
   }

   private computeValue(): number | undefined {
      const seeder = this.ϟconfig.seeder ?? getGlobalSeeder()
      const count = seeder.count
      const mode = this.ϟserial.mode ?? this.ϟconfig.defaultMode ?? 'randomize'
      return mode === 'randomize' //
         ? Math.floor(Math.random() * 9_999_999)
         : this.ϟserial.val
   }

   // #region patches
   public static readonly patchedSerialPaths: readonly string[] = Object.freeze(['val', 'mode'])
}

registerFieldClass('seed', Field_seed)
Field_seed satisfies FieldConstructor<Field_seed>
