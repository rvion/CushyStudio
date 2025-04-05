import type { CSchema } from '../../model/CSchema'
import type { CodegenOpts, FieldConstructor } from '../../model/FieldConstructor'
import type { Patch } from '../../model/Patch'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'
import type { CovariantFn } from '../../variance/BivariantHack'

import { computed } from 'mobx'

import { Field } from '../../model/Field'
import { registerFieldClass } from '../WidgetUI.DI'

// #region CONFIG TYPE
type Field_shared_ownConfig<F extends Field> = {
   /** schema is now mandatory so introspection properly works */
   schema: CSchema<F>

   /** and then you need a lambda tha will be used instead of calling create() */
   field: CovariantFn<[self: Field_shared<F>], Maybe<F>>
}

// #region SERIAL TYPE
type Field_shared_ownSerial = {
   $: 'shared'
   // NO VALUE HERE; otherwise, we would store the data twice
}

// #region VALUE TYPE
export type Field_shared_value<F extends Field = Field> = F['{value}']
export type Field_shared_unchecked<F extends Field = Field> = Maybe<F['{unchecked}']>

// #region Field
export interface Field_shared<F extends Field = Field> {
   '{type}': 'shared'
   '{ownConfig}': Field_shared_ownConfig<F>
   '{ownSerial}': Field_shared_ownSerial
   '{value}': Field_shared_value<F>
   '{setValue}': Field_shared_value<F>
   '{unchecked}': Field_shared_unchecked<F>
   '{child}': F
   '{opts}': unknown
   '{ownPatch}': Patch<'shared'>
}

// #region STATE
export class Field_shared<out F extends Field = Field> extends Field {
   // #region TYPE
   static readonly type: 'shared' = 'shared'
   private static readonly unsetSerial: Field_shared['{serial}'] = { $: 'shared' }
   static override migrateSerial(): undefined {}
   static codeForTypescriptValue = (config: Field_shared<Field>['{config}'], opts: CodegenOpts): string => {
      return `Z.Shared<${config.schema.codeForTypescriptValue(opts)}>`
   }
   static generateSerial(): Field_shared['{serial}'] {
      return Field_shared.unsetSerial
   }

   // #region CTOR
   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: CSchema<Field_shared<F>>,
      initialMountKey: string,
      serial?: Field_shared<F>['{serial}'],
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)
   }

   // #region UI
   protected zSetOwnSerial(_next: this['{serial}']): void {}

   get zIsOwnSet(): boolean {
      return this.child.zIsSet
   }

   get zHasChanges(): boolean {
      return this.child.zHasChanges
   }

   override get zActualWidgetToDisplay(): Field {
      return this.child.zActualWidgetToDisplay
   }

   @computed get childOrNull(): Maybe<F> {
      return this.zConfig.field(this)
   }

   @computed get child(): F {
      const child = this.childOrNull
      if (child == null) throw new Error('Field_shared: child is null')
      return child
   }

   get zOwnConfigSpecificProblems(): Problem_Ext {
      return null
   }

   get zOwnTypeSpecificProblems(): Problem_Ext {
      return this.child.zOwnTypeSpecificProblems
   }

   set zValue(val: Field_shared_value<F>) {
      this.child.zValue = val
   }

   get zValue(): Field_shared_value<F> {
      return this.child.zValue
   }

   get zValueOrZero(): Field_shared_value<F> {
      return this.child.zValueOrZero
   }

   get zValueUnchecked(): Field_shared_unchecked<F> {
      return this.childOrNull?.zValueUnchecked
   }

   override zIsValueEqual(other: Field): boolean {
      if (!(other instanceof Field_shared)) return false
      return this.child.zIsValueEqual(other.child)
   }

   public static readonly patchedSerialPaths: readonly string[] = Object.freeze([])
}

// DI
registerFieldClass('shared', Field_shared)
Field_shared satisfies FieldConstructor<Field_shared>
