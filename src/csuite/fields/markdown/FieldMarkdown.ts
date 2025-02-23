import type { CSchema } from '../../model/CSchema'
import type { Patch } from '../../model/Patch'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'

import { Field } from '../../model/Field'
import { registerFieldClass } from '../WidgetUI.DI'

// #region CONFIG TYPE
export type Field_markdown_config = Field_markdown['$config']
type Field_markdown_ownConfig = {
   markdown: string | ((self: Field_markdown) => string)
   inHeader?: boolean
}

// #region SERIAL TYPE
export type Field_markdown_serial = Field_markdown['$serial']
type Field_markdown_ownSerial = { $: 'markdown' }

// #region VALUE TYPE
export type Field_markdown_value = { $: 'markdown' }
export type Field_markdown_unchecked = Field_markdown_value

// #region Field
export interface Field_markdown {
   $type: 'markdown'
   $ownConfig: Field_markdown_ownConfig
   $ownSerial: Field_markdown_ownSerial
   $value: Field_markdown_value
   $setValue: Field_markdown_value
   $unchecked: Field_markdown_unchecked
   $child: never
   $opts: unknown
   $ownPatch: Patch<'markdown'>
}

// #region STATE TYPE
export class Field_markdown extends Field {
   // #region TYPE
   static readonly type: 'markdown' = 'markdown'
   static readonly emptySerial: Field_markdown_serial = { $: 'markdown' }
   static override migrateSerial(): undefined {}
   static readonly codeForTypescriptValue = (config: Field_markdown_config): string => 'Markdown'

   // #region CTOR
   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: CSchema<Field_markdown>,
      initialMountKey: string,
      serial?: Field_markdown_serial,
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)
   }

   // #region SERIAL
   protected setOwnSerial(_next: Field_markdown_serial): void {}

   // #region VALIDATION
   get ownConfigSpecificProblems(): Problem_Ext {
      return null
   }

   get ownTypeSpecificProblems(): Problem_Ext {
      return null
   }

   get isOwnSet(): boolean {
      return true
   }

   // #region MISC
   get markdown(): string {
      const md = this.config.markdown
      if (typeof md === 'string') return md
      return md(this)
   }

   // #region value
   /** do nothing, see coment on the hasChange getter */
   set value(_: Field_markdown_value) {}

   get value(): Field_markdown_value {
      return this.serial
   }

   /**
    * always return false, because the text isn't part of the serial, it's part of the config
    * markdown fields have NO value
    */
   get hasChanges(): boolean {
      return false
   }
   // the whole markdown field is legacy
   // this is why most of the attributes make no sense.
   get value_or_fail(): Field_markdown_value {
      return this.serial
   }
   get value_or_zero(): Field_markdown_value {
      return this.serial
   }
   get value_unchecked(): Field_markdown_unchecked {
      return this.serial
   }

   override isValueEqual(other: Field): boolean {
      if (!(other instanceof Field_markdown)) return false

      return true
   }

   // #region PATCH
   public override readonly patchedSerialPaths: string[] = []
}

// DI
registerFieldClass('markdown', Field_markdown)
