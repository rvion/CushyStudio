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
   ['::Type']: 'image'
   ['::OwnConfig']: Field_image_ownConfig
   ['::OwnSerial']: Field_image_ownSerial
   ['::Value']: Field_image_value
   ['::Unchecked']: Field_image_value | undefined
   ['::Field']: Field_image
   ['::Child']: never
}
export class Field_image extends Field {
   // #region static
   static readonly type: 'image' = 'image'
   static readonly unsetSerial: Field_image['::Serial'] = { $: 'image' }
   public static readonly patchedSerialPaths: readonly string[] = Object.freeze([
      'imageID',
      'imageHash',
      'size',
   ])
   static generateSerial(
      value: Maybe<Field_image['::Value']>,
      config: Field_image['::Config'],
   ): Field_image['::Serial'] {
      if (value == null && config.default == null) return this.unsetSerial
      return { $: 'image', imageID: value?.id ?? config.default?.id }
   }
   static migrateSerial(): undefined {}
   static codeForTypescriptValue(config: Field_image['::Config']): string {
      return `MediaImageL`
   }

   // #region constructor
   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: CSchema<Field_image>,
      initialMountKey: string,
      serial?: Field_image['::Serial'],
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)
   }

   // #region serial
   get zIsOwnSet(): boolean {
      return this.zSerial.imageID != null
   }

   protected zSetOwnSerial(next: Field_image['::Serial']): void {
      // apply default if unset + default in config
      const def = this.zConfig.default
      if (this.zSerial.imageID == null && def != null) {
         next = produce(next, (draft) => {
            draft.imageID = def.id
         })
      }

      this.zAssignNewSerial(next)
   }

   // #region UI
   DefaultHeaderUI: -1 = -1
   DefaultBodyUI: -1 = -1

   // #region UI/helpers
   get animateResize(): boolean {
      return false
   }

   // #region Validation
   get zOwnConfigSpecificProblems(): Problem_Ext {
      return null
   }

   get zOwnTypeSpecificProblems(): Problem_Ext {
      return null
   }

   // #region ...
   get defaultValue(): MediaImageL | undefined {
      return this.zConfig.default
   }

   get zHasChanges(): boolean {
      return this.zValue !== this.defaultValue
   }

   // #region value
   get zValue(): MediaImageL {
      return this.zValue_or_fail
   }

   set zValue(next: MediaImageL) {
      if (this.zSerial.imageID === next.id) return
      this.zRunInTransaction(() => {
         this.zPatchSerial((draft) => {
            draft.imageID = next.id
         })
      })
   }

   get zValue_or_zero(): MediaImageL {
      if (this.zSerial.imageID == null) return cushy.defaultImage
      return cushy.db.media_image.get(this.zSerial.imageID) ?? cushy.defaultImage
   }

   get zValue_or_fail(): MediaImageL {
      if (this.zSerial.imageID == null) throw new Error('Field_image.zValue_or_fail: not set')
      const image = cushy.db.media_image.get(this.zSerial.imageID)
      if (image == null) throw new Error('Field_image.zValue_or_fail: not found')
      return image
   }

   get zValue_unchecked(): MediaImageL | undefined {
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
