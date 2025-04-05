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
   default?: MediaImageL | MediaImageID
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

// #region STATE
export interface Field_image {
   '{type}': 'image'
   '{ownConfig}': Field_image_ownConfig
   '{ownSerial}': Field_image_ownSerial
   '{value}': MediaImageL
   '{setValue}': MediaImageL | MediaImageID
   '{unchecked}': MediaImageL | undefined
   '{field}': Field_image
   '{child}': never
}
export class Field_image extends Field {
   // #region static
   static readonly type: 'image' = 'image'
   public static readonly patchedSerialPaths: readonly string[] = Object.freeze([
      'imageID',
      'imageHash',
      'size',
   ])
   static readonly unsetSerial: Field_image['{serial}'] = { $: 'image' }
   static getIdFrom(imgOrId: MediaImageL | MediaImageID): MediaImageID {
      if (typeof imgOrId === 'object') return imgOrId.id
      if (typeof imgOrId === 'string') return imgOrId
      throw new Error('Field_image: getIdFrom: invalid type')
   }
   static generateSerial(
      setValue: Maybe<Field_image['{setValue}']>,
      config: Field_image['{config}'],
   ): Field_image['{serial}'] {
      if (setValue == null && config.default == null) return this.unsetSerial
      if (setValue != null) return { $: 'image', imageID: this.getIdFrom(setValue) }
      if (config.default != null) return { $: 'image', imageID: this.getIdFrom(config.default) }
      return this.unsetSerial
   }
   static migrateSerial(): undefined {}
   static codeForTypescriptValue(config: Field_image['{config}']): string {
      return `MediaImageL`
   }

   // #region constructor
   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: CSchema<Field_image>,
      initialMountKey: string,
      serial?: Field_image['{serial}'],
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)
   }

   // #region serial
   get zIsOwnSet(): boolean {
      return this.zSerial.imageID != null
   }

   protected zSetOwnSerial(next: Field_image['{serial}']): void {
      // apply default if unset + default in config
      const def = this.zConfig.default
      if (this.zSerial.imageID == null && def != null) {
         next = produce(next, (draft) => {
            draft.imageID = Field_image.getIdFrom(def)
         })
      }

      this.zAssignNewSerial(next)
   }

   // #region Validation
   get zOwnConfigSpecificProblems(): Problem_Ext { return null } // prettier-ignore
   get zOwnTypeSpecificProblems(): Problem_Ext { return null } // prettier-ignore

   // #region ...
   get defaultValue(): MediaImageID | undefined {
      const def = this.zConfig.default
      if (def == null) return undefined
      if (typeof def === 'object') return def.id
      if (typeof def === 'string') return def
      throw new Error('Field_image: defaultValue: invalid type')
   }

   get zHasChanges(): boolean {
      return this.zValue.id !== this.defaultValue
   }

   // #region value
   set zValue(next: MediaImageL) {
      if (this.zSerial.imageID === next.id) return
      this.zRunInTransaction(() => {
         this.zPatchSerial((draft) => {
            draft.imageID = next.id
         })
      })
   }

   get zValueOrZero(): MediaImageL {
      if (this.zSerial.imageID == null) return cushy.defaultImage
      return cushy.db.media_image.get(this.zSerial.imageID) ?? cushy.defaultImage
   }

   get zValue(): MediaImageL {
      if (this.zSerial.imageID == null) throw new Error('Field_image.zValue: not set')
      const image = cushy.db.media_image.get(this.zSerial.imageID)
      if (image == null) throw new Error('Field_image.zValue: not found')
      return image
   }

   get zValueUnchecked(): MediaImageL | undefined {
      if (this.zSerial.imageID == null) return
      const image = cushy.db.media_image.get(this.zSerial.imageID)
      if (image == null) return
      return image
   }

   public zIsValueEqual(other: Field): boolean {
      if (other === this) return true
      if (!(other instanceof Field_image)) return false
      return this.zSerial.imageID === this.zSerial.imageID
   }

   // #region UI/preview
   /** size of the preview */
   get size(): number {
      return this.zSerial.size ?? this._defaultPreviewSize
   }

   set size(val: number) {
      this.zRunInTransaction(() => {
         this.zPatchSerial((serial) => {
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
