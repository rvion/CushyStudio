import type { CSchema } from '../../model/CSchema'
import type { FieldConstructor } from '../../model/FieldConstructor'
import type { Patch } from '../../model/Patch'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'

import { Field } from '../../model/Field'
import { registerFieldClass } from '../WidgetUI.DI'

// #region CONFIG TYPE
export type Field_markdown_config = Field_markdown['{config}']
type Field_markdown_ownConfig = {
   markdown: string | ((self: Field_markdown) => string)
   inHeader?: boolean
}

// #region SERIAL TYPE
export type Field_markdown_serial = Field_markdown['{serial}']
type Field_markdown_ownSerial = { $: 'markdown' }

// #region VALUE TYPE
export type Field_markdown_value = { $: 'markdown' }
export type Field_markdown_unchecked = Field_markdown_value

// #region STATE TYPE
export interface Field_markdown {
   '{type}': 'markdown'
   '{ownConfig}': Field_markdown_ownConfig
   '{ownSerial}': Field_markdown_ownSerial
   '{value}': Field_markdown_value
   '{setValue}': Field_markdown_value
   '{unchecked}': Field_markdown_unchecked
   '{child}': never
   '{opts}': unknown
   '{ownPatch}': Patch<'markdown'>
}
export class Field_markdown extends Field {
   // #region TYPE
   static readonly type: 'markdown' = 'markdown'
   private static readonly unsetSerial: Field_markdown_serial = { $: 'markdown' }
   static override migrateSerial(): undefined {}
   static readonly codeForTypescriptValue = (config: Field_markdown_config): string => 'Markdown'

   static generateSerial(): Field_markdown_serial {
      return Field_markdown.unsetSerial
   }

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
   protected zSetOwnSerial(_next: Field_markdown_serial): void {}

   // #region VALIDATION
   get zOwnConfigSpecificProblems(): Problem_Ext {
      return null
   }

   get zOwnTypeSpecificProblems(): Problem_Ext {
      return null
   }

   get zIsOwnSet(): boolean {
      return true
   }

   // #region MISC
   get markdown(): string {
      const md = this.zConfig.markdown
      if (typeof md === 'string') return md
      return md(this)
   }

   // #region value
   /** do nothing, see coment on the hasChange getter */
   set zValue(_: Field_markdown_value) {}

   get zValue(): Field_markdown_value {
      return this.zSerial
   }

   /**
    * always return false, because the text isn't part of the serial, it's part of the config
    * markdown fields have NO value
    */
   get zHasChanges(): boolean {
      return false
   }
   get zValueOrZero(): Field_markdown_value {
      return this.zSerial
   }
   get zValueUnchecked(): Field_markdown_unchecked {
      return this.zSerial
   }

   override zIsValueEqual(other: Field): boolean {
      if (!(other instanceof Field_markdown)) return false

      return true
   }

   // #region PATCH
   public static readonly patchedSerialPaths: readonly string[] = Object.freeze([])
}

// DI
registerFieldClass('markdown', Field_markdown)
Field_markdown satisfies FieldConstructor<Field_markdown>
