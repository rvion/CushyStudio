import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'
import type { FC } from 'react'

import { Field } from '../../model/Field'
import { registerFieldClass } from '../WidgetUI.DI'
import { WidgetMardownUI } from './WidgetMarkdownUI'

// #region $Config
export type Field_markdown_config = FieldConfig<
   {
      markdown: string | ((self: Field_markdown) => string)
      inHeader?: boolean
   },
   Field_markdown_types
>

// #region $Serial
export type Field_markdown_serial = FieldSerial<{
   $: 'markdown'
}>

// #region $Value
export type Field_markdown_value = { $: 'markdown' }
export type Field_markdown_unchecked = Field_markdown_value

// #region $Types
export type Field_markdown_types = {
   $Type: 'markdown'
   $Config: Field_markdown_config
   $Serial: Field_markdown_serial
   $Value: Field_markdown_value
   $Unchecked: Field_markdown_unchecked
   $Field: Field_markdown
   $Child: never
   $Reflect: Field_markdown_types
}

// #region STATE TYPE
export class Field_markdown extends Field<Field_markdown_types> {
   // #region TYPE
   static readonly type: 'markdown' = 'markdown'
   static readonly emptySerial: Field_markdown_serial = { $: 'markdown' }
   static codegenValueType(config: Field_markdown_config): string {
      return `undefined`
   }
   static migrateSerial(): undefined {}

   // #region CTOR
   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: BaseSchema<Field_markdown>,
      initialMountKey: string,
      serial?: Field_markdown_serial,
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)
   }
   // #region UI
   get DefaultHeaderUI(): FC<{ field: Field_markdown }> | undefined {
      if (this.config.inHeader) return WidgetMardownUI
      return undefined
   }

   get DefaultBodyUI(): FC<{ field: Field_markdown }> | undefined {
      if (this.config.inHeader) return undefined
      return WidgetMardownUI
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
}

// DI
registerFieldClass('markdown', Field_markdown)
