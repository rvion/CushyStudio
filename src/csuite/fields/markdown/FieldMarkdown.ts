import type { CSchema } from '../../model/CSchema'
import type { FieldConstructor } from '../../model/FieldConstructor'
import type { Patch } from '../../model/Patch'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'

import { Field } from '../../model/Field'
import { registerFieldClass } from '../WidgetUI.DI'

// #region CONFIG TYPE
export type Field_markdown_config = Field_markdown['Ҩconfig']
type Field_markdown_ownConfig = {
   markdown: string | ((self: Field_markdown) => string)
   inHeader?: boolean
}

// #region SERIAL TYPE
export type Field_markdown_serial = Field_markdown['Ҩserial']
type Field_markdown_ownSerial = { $: 'markdown' }

// #region VALUE TYPE
export type Field_markdown_value = { $: 'markdown' }
export type Field_markdown_unchecked = Field_markdown_value

// #region STATE TYPE
export interface Field_markdown {
   ['Ҩtype']: 'markdown'
   ['ҨownConfig']: Field_markdown_ownConfig
   ['ҨownSerial']: Field_markdown_ownSerial
   ['Ҩvalue']: Field_markdown_value
   ['Ҩsetvalue']: Field_markdown_value
   ['Ҩunchecked']: Field_markdown_unchecked
   ['Ҩchild']: never
   ['Ҩopts']: unknown
   ['ҨownPatch']: Patch<'markdown'>
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
   protected ϟsetOwnSerial(_next: Field_markdown_serial): void {}

   // #region VALIDATION
   get ϟownConfigSpecificProblems(): Problem_Ext {
      return null
   }

   get ϟownTypeSpecificProblems(): Problem_Ext {
      return null
   }

   get ϟisOwnSet(): boolean {
      return true
   }

   // #region MISC
   get markdown(): string {
      const md = this.ϟconfig.markdown
      if (typeof md === 'string') return md
      return md(this)
   }

   // #region value
   /** do nothing, see coment on the hasChange getter */
   set ϟvalue(_: Field_markdown_value) {}

   get ϟvalue(): Field_markdown_value {
      return this.ϟserial
   }

   /**
    * always return false, because the text isn't part of the serial, it's part of the config
    * markdown fields have NO value
    */
   get ϟhasChanges(): boolean {
      return false
   }
   // the whole markdown field is legacy
   // this is why most of the attributes make no sense.
   get ϟvalue_or_fail(): Field_markdown_value {
      return this.ϟserial
   }
   get ϟvalue_or_zero(): Field_markdown_value {
      return this.ϟserial
   }
   get ϟvalue_unchecked(): Field_markdown_unchecked {
      return this.ϟserial
   }

   override ϟisValueEqual(other: Field): boolean {
      if (!(other instanceof Field_markdown)) return false

      return true
   }

   // #region PATCH
   public static readonly patchedSerialPaths: readonly string[] = Object.freeze([])
}

// DI
registerFieldClass('markdown', Field_markdown)
Field_markdown satisfies FieldConstructor<Field_markdown>
