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
export type Field_shared_value<F extends Field = Field> = F['Ҩvalue']
export type Field_shared_unchecked<F extends Field = Field> = Maybe<F['Ҩunchecked']>

// #region Field
export interface Field_shared<F extends Field = Field> {
   ['Ҩtype']: 'shared'
   ['ҨownConfig']: Field_shared_ownConfig<F>
   ['ҨownSerial']: Field_shared_ownSerial
   ['Ҩvalue']: Field_shared_value<F>
   ['Ҩsetvalue']: Field_shared_value<F>
   ['Ҩunchecked']: Field_shared_unchecked<F>
   ['Ҩchild']: F
   ['Ҩopts']: unknown
   ['ҨownPatch']: Patch<'shared'>
}

// #region STATE
export class Field_shared<out F extends Field = Field> extends Field {
   // #region TYPE
   static readonly type: 'shared' = 'shared'
   private static readonly unsetSerial: Field_shared['Ҩserial'] = { $: 'shared' }
   static override migrateSerial(): undefined {}
   static codeForTypescriptValue = (config: Field_shared<Field>['Ҩconfig'], opts: CodegenOpts): string => {
      return `Z.Shared<${config.schema.codeForTypescriptValue(opts)}>`
   }
   static generateSerial(): Field_shared['Ҩserial'] {
      return Field_shared.unsetSerial
   }

   // #region CTOR
   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: CSchema<Field_shared<F>>,
      initialMountKey: string,
      serial?: Field_shared<F>['Ҩserial'],
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)
   }

   // #region UI
   protected ϟsetOwnSerial(_next: this['Ҩserial']): void {}

   get ϟisOwnSet(): boolean {
      return this.child.ϟisSet
   }

   get ϟhasChanges(): boolean {
      return this.child.ϟhasChanges
   }

   override get ϟactualWidgetToDisplay(): Field {
      return this.child.ϟactualWidgetToDisplay
   }

   @computed get childOrNull(): Maybe<F> {
      return this.ϟconfig.field(this)
   }

   @computed get child(): F {
      const child = this.childOrNull
      if (child == null) throw new Error('Field_shared: child is null')
      return child
   }

   get ϟownConfigSpecificProblems(): Problem_Ext {
      return null
   }

   get ϟownTypeSpecificProblems(): Problem_Ext {
      return this.child.ϟownTypeSpecificProblems
   }

   get ϟvalue(): Field_shared_value<F> {
      return this.child.ϟvalue
   }

   set ϟvalue(val: Field_shared_value<F>) {
      this.child.ϟvalue = val
   }

   get ϟvalue_or_fail(): Field_shared_value<F> {
      return this.child.ϟvalue_or_fail
   }

   get ϟvalue_or_zero(): Field_shared_value<F> {
      return this.child.ϟvalue_or_zero
   }

   get ϟvalue_unchecked(): Field_shared_unchecked<F> {
      return this.childOrNull?.ϟvalue_unchecked
   }

   override ϟisValueEqual(other: Field): boolean {
      if (!(other instanceof Field_shared)) return false
      return this.child.ϟisValueEqual(other.child)
   }

   public static readonly patchedSerialPaths: readonly string[] = Object.freeze([])
}

// DI
registerFieldClass('shared', Field_shared)
Field_shared satisfies FieldConstructor<Field_shared>
