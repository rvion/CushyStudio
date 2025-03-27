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
   ['Ҩtype']: 'image'
   ['ҨownConfig']: Field_image_ownConfig
   ['ҨownSerial']: Field_image_ownSerial
   ['Ҩvalue']: Field_image_value
   ['Ҩunchecked']: Field_image_value | undefined
   Ҩfield: Field_image
   ['Ҩchild']: never
}
export class Field_image extends Field {
   // #region static
   static readonly type: 'image' = 'image'
   static readonly unsetSerial: Field_image['Ҩserial'] = { $: 'image' }
   public static readonly patchedSerialPaths: readonly string[] = Object.freeze([
      'imageID',
      'imageHash',
      'size',
   ])
   static generateSerial(
      value: Maybe<Field_image['Ҩvalue']>,
      config: Field_image['Ҩconfig'],
   ): Field_image['Ҩserial'] {
      if (value == null && config.default == null) return this.unsetSerial
      return { $: 'image', imageID: value?.id ?? config.default?.id }
   }
   static migrateSerial(): undefined {}
   static codeForTypescriptValue(config: Field_image['Ҩconfig']): string {
      return `MediaImageL`
   }

   // #region constructor
   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: CSchema<Field_image>,
      initialMountKey: string,
      serial?: Field_image['Ҩserial'],
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)
   }

   // #region serial
   get ϟisOwnSet(): boolean {
      return this.ϟserial.imageID != null
   }

   protected ϟsetOwnSerial(next: Field_image['Ҩserial']): void {
      // apply default if unset + default in config
      const def = this.ϟconfig.default
      if (this.ϟserial.imageID == null && def != null) {
         next = produce(next, (draft) => {
            draft.imageID = def.id
         })
      }

      this.ϟassignNewSerial(next)
   }

   // #region UI
   DefaultHeaderUI: -1 = -1
   DefaultBodyUI: -1 = -1

   // #region UI/helpers
   get animateResize(): boolean {
      return false
   }

   // #region Validation
   get ϟownConfigSpecificProblems(): Problem_Ext {
      return null
   }

   get ϟownTypeSpecificProblems(): Problem_Ext {
      return null
   }

   // #region ...
   get defaultValue(): MediaImageL | undefined {
      return this.ϟconfig.default
   }

   get ϟhasChanges(): boolean {
      return this.ϟvalue !== this.defaultValue
   }

   // #region value
   get ϟvalue(): MediaImageL {
      return this.ϟvalue_or_fail
   }

   set ϟvalue(next: MediaImageL) {
      if (this.ϟserial.imageID === next.id) return
      this.ϟrunInTransaction(() => {
         this.ϟpatchSerial((draft) => {
            draft.imageID = next.id
         })
      })
   }

   get ϟvalue_or_zero(): MediaImageL {
      if (this.ϟserial.imageID == null) return cushy.defaultImage
      return cushy.db.media_image.get(this.ϟserial.imageID) ?? cushy.defaultImage
   }

   get ϟvalue_or_fail(): MediaImageL {
      if (this.ϟserial.imageID == null) throw new Error('Field_image.value_or_fail: not set')
      const image = cushy.db.media_image.get(this.ϟserial.imageID)
      if (image == null) throw new Error('Field_image.value_or_fail: not found')
      return image
   }

   get ϟvalue_unchecked(): MediaImageL | undefined {
      if (this.ϟserial.imageID == null) return
      const image = cushy.db.media_image.get(this.ϟserial.imageID)
      if (image == null) return
      return image
   }

   public ϟisValueEqual(other: Field): boolean {
      if (other === this) return true
      if (!(other instanceof Field_image)) return false
      return this.ϟserial.imageID === this.ϟserial.imageID
   }

   // #region UI/preview
   /** size of the preview */
   get size(): number {
      return this.ϟserial.size ?? this._defaultPreviewSize
   }

   set size(val: number) {
      this.ϟrunInTransaction(() => {
         this.ϟpatchSerial((serial) => {
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
