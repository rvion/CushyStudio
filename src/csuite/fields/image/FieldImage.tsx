import type { SQLWhere } from '../../../db/SQLWhere'
import type { MediaImageT } from '../../../db/TYPES.gen'
import type { MediaImageL } from '../../../models/MediaImage'
import type { CSchema } from '../../model/CSchema'
import type { FieldConstructor } from '../../model/FieldConstructor'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'

import { produce } from 'immer'

import { Field } from '../../model/Field'
import { registerFieldClass } from '../WidgetUI.DI'

// #region Config
export type Field_image_ownConfig = {
   default?: MediaImageL
   suggestionWhere?: SQLWhere<MediaImageT>
   assetSuggested?: RelativePath | RelativePath[]
}

// #region Serial
export type Field_image_ownSerial = {
   $: 'image'

   imageID?: Maybe<MediaImageID>

   /** for form expiration */
   imageHash?: string

   /**
    * Height of the resizable frame's content,
    * the width is aspect ratio locked.
    */
   size?: number
}

// #region Value
export type Field_image_value = MediaImageL

// #region STATE
export interface Field_image {
   ['…type']: 'image'
   ['…ownConfig']: Field_image_ownConfig
   ['…ownSerial']: Field_image_ownSerial
   ['…value']: Field_image_value
   ['…unchecked']: Field_image_value | undefined
   $field: Field_image
   ['…child']: never
}
export class Field_image extends Field {
   // #region static
   static readonly type: 'image' = 'image'
   static readonly unsetSerial: Field_image['…serial'] = { $: 'image' }
   public static readonly patchedSerialPaths: readonly string[] = Object.freeze([
      'imageID',
      'imageHash',
      'size',
   ])
   static generateSerial(
      value: Maybe<Field_image['…value']>,
      config: Field_image['…config'],
   ): Field_image['…serial'] {
      if (value == null && config.default == null) return this.unsetSerial
      return { $: 'image', imageID: value?.id ?? config.default?.id }
   }
   static migrateSerial(): undefined {}
   static codeForTypescriptValue(config: Field_image['…config']): string {
      return `MediaImageL`
   }

   // #region constructor
   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: CSchema<Field_image>,
      initialMountKey: string,
      serial?: Field_image['…serial'],
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)
   }

   // #region serial
   get isOwnSet(): boolean {
      return this.serial.imageID != null
   }

   protected setOwnSerial(next: Field_image['…serial']): void {
      // apply default if unset + default in config
      const def = this.config.default
      if (this.serial.imageID == null && def != null) {
         next = produce(next, (draft) => {
            draft.imageID = def.id
         })
      }

      this.ܮassignNewSerial(next)
   }

   // #region UI
   DefaultHeaderUI: -1 = -1
   DefaultBodyUI: -1 = -1

   // #region UI/helpers
   get animateResize(): boolean {
      return false
   }

   // #region Validation
   get ownConfigSpecificProblems(): Problem_Ext {
      return null
   }

   get ownTypeSpecificProblems(): Problem_Ext {
      return null
   }

   // #region ...
   get defaultValue(): MediaImageL | undefined {
      return this.config.default
   }

   get hasChanges(): boolean {
      return this.value !== this.defaultValue
   }

   // #region value
   get value(): MediaImageL {
      return this.value_or_fail
   }

   set value(next: MediaImageL) {
      if (this.serial.imageID === next.id) return
      this.ܮrunInTransaction(() => {
         this.patchSerial((draft) => {
            draft.imageID = next.id
         })
      })
   }

   get value_or_zero(): MediaImageL {
      if (this.serial.imageID == null) return cushy.defaultImage
      return cushy.db.media_image.get(this.serial.imageID) ?? cushy.defaultImage
   }

   get value_or_fail(): MediaImageL {
      if (this.serial.imageID == null) throw new Error('Field_image.value_or_fail: not set')
      const image = cushy.db.media_image.get(this.serial.imageID)
      if (image == null) throw new Error('Field_image.value_or_fail: not found')
      return image
   }

   get value_unchecked(): MediaImageL | undefined {
      if (this.serial.imageID == null) return
      const image = cushy.db.media_image.get(this.serial.imageID)
      if (image == null) return
      return image
   }

   public isValueEqual(other: Field): boolean {
      if (other === this) return true
      if (!(other instanceof Field_image)) return false
      return this.serial.imageID === this.serial.imageID
   }

   // #region UI/preview
   /** size of the preview */
   get size(): number {
      return this.serial.size ?? this._defaultPreviewSize
   }

   set size(val: number) {
      this.ܮrunInTransaction(() => {
         this.patchSerial((serial) => {
            if (val === this._defaultPreviewSize) delete serial.size
            else serial.size = val
         })
      })
   }

   private get _defaultPreviewSize(): number {
      return 128
   }
}

// DI
registerFieldClass('image', Field_image)
Field_image satisfies FieldConstructor<Field_image>
