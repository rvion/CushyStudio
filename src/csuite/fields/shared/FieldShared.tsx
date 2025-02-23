import type { CSchema } from '../../model/CSchema'
import type { CodegenOpts } from '../../model/FieldConstructor'
import type { Patch } from '../../model/Patch'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'

import { Field } from '../../model/Field'
import { registerFieldClass } from '../WidgetUI.DI'

// #region CONFIG TYPE
type Field_shared_ownConfig<F extends Field> = { field: F }

// #region SERIAL TYPE
type Field_shared_ownSerial = {
   $: 'shared'
   // NO VALUE HERE; otherwise, we would store the data twice
}

// #region VALUE TYPE
export type Field_shared_value<F extends Field = Field> = F['$value']
export type Field_shared_unchecked<F extends Field = Field> = F['$unchecked']

// #region Field
export interface Field_shared<F extends Field = Field> {
   $type: 'shared'
   $ownConfig: Field_shared_ownConfig<F>
   $ownSerial: Field_shared_ownSerial
   $value: Field_shared_value<F>
   $setValue: Field_shared_value<F>
   $unchecked: Field_shared_unchecked<F>
   $child: F
   $opts: unknown
   $ownPatch: Patch<'shared'>
}

// #region STATE
export class Field_shared<out F extends Field = Field> extends Field {
   // #region TYPE
   static readonly type: 'shared' = 'shared'
   static readonly emptySerial: Field_shared['$serial'] = { $: 'shared' }
   static override migrateSerial(): undefined {}
   static codeForTypescriptValue = (config: Field_shared<Field>['$config'], opts: CodegenOpts): string => {
      return `Z.Shared<${config.field.schema.codeForTypescriptValue(opts)}>`
   }

   // #region CTOR
   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: CSchema<Field_shared<F>>,
      initialMountKey: string,
      serial?: Field_shared<F>['$serial'],
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)
   }

   // #region UI
   protected setOwnSerial(_next: this['$serial']): void {}

   get isOwnSet(): boolean {
      return this.child.isSet
   }

   get hasChanges(): boolean {
      return this.child.hasChanges
   }

   override get actualWidgetToDisplay(): Field {
      return this.child.actualWidgetToDisplay
   }

   get child(): F {
      return this.config.field
   }

   get ownConfigSpecificProblems(): Problem_Ext {
      return null
   }

   get ownTypeSpecificProblems(): Problem_Ext {
      return this.child.ownTypeSpecificProblems
   }

   get value(): Field_shared_value<F> {
      return this.child.value
   }

   set value(val: Field_shared_value<F>) {
      this.child.value = val
   }

   get value_or_fail(): Field_shared_value<F> {
      return this.child.value_or_fail
   }

   get value_or_zero(): Field_shared_value<F> {
      return this.child.value_or_zero
   }

   get value_unchecked(): Field_shared_unchecked<F> {
      return this.child.value_unchecked
   }

   override isValueEqual(other: Field): boolean {
      if (!(other instanceof Field_shared)) return false
      return this.child.isValueEqual(other.child)
   }

   public override readonly patchedSerialPaths: string[] = []
}

// DI
registerFieldClass('shared', Field_shared)
