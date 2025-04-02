import type { CSchema } from '../../model/CSchema'
import type { FieldConstructor } from '../../model/FieldConstructor'
import type { Patch } from '../../model/Patch'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'

import { produce } from 'immer'
import { computed } from 'mobx'

import { Field } from '../../model/Field'
import { bang } from '../../utils/bang'
import { parseFloatNoRoundingErr } from '../../utils/parseFloatNoRoundingErr'
import { registerFieldClass } from '../WidgetUI.DI'
import {
   type AspectRatio,
   aspectRatioMap,
   type CushySize,
   type CushySizeByRatio,
   type ModelType,
   type SDModelType,
} from './WidgetSizeTypes'

type SizeAble = {
   width: number
   height: number
}

// CONFIG
export type Field_size_config = Field_size['::Config']
type Field_size_ownConfig = {
   default?: CushySizeByRatio
   min?: number
   max?: number
   step?: number
}

// SERIAL
export type Field_size_serial = Field_size['::Serial']
type Field_size_ownSerial = {
   width?: number
   height?: number
   modelType?: SDModelType
   aspectRatio?: AspectRatio
}

// SERIAL FROM VALUE
export const Field_size_fromValue = (val: Field_size_value): Field_size_serial => ({
   ...val,
})

// VALUE
export type Field_size_value = CushySize // prettier-ignore
export type Field_size_unchecked = Field_size_serial

// TYPES
export interface Field_size {
   ['::Type']: 'size'
   ['::OwnConfig']: Field_size_ownConfig
   ['::OwnSerial']: Field_size_ownSerial
   ['::Value']: Field_size_value
   ['::Setvalue']: Field_size_value
   ['::Unchecked']: Field_size_unchecked
   ['::Child']: never
   ['::Opts']: unknown
   ['::OwnPatch']: Patch<'size'>
}

// STATE
export class Field_size extends Field {
   static readonly type: 'size' = 'size'
   static override migrateSerial(serial: object): void {}
   private static readonly unsetSerial: Field_size_serial = { $: 'size' }
   static readonly codeForTypescriptValue = (config: Field_size_config): string => 'Z.CushySize'
   get zIsOwnSet(): boolean {
      const ser = this.zSerial
      return (
         ser.width != null && //
         ser.height != null &&
         ser.aspectRatio != null &&
         ser.modelType != null
      )
   }

   static generateSerial(
      value: Maybe<Field_size['::Value']>,
      config: Field_size['::Config'],
   ): Field_size['::Serial'] {
      if (value == null && config.default == null) return this.unsetSerial

      const selectedVal = value ?? config.default
      return {
         $: 'size',
         width: selectedVal?.width,
         height: selectedVal?.height,
         aspectRatio: selectedVal?.aspectRatio,
         modelType: selectedVal?.modelType,
      }
   }

   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: CSchema<Field_size>,
      initialMountKey: string,
      serial?: Field_size_serial,
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)
   }

   get aspectRatio_or_zero(): AspectRatio {
      return this.zSerial.aspectRatio ?? '1:1'
   }

   get modelType_or_zero(): SDModelType {
      return this.zSerial.modelType ?? 'SD1.5 512'
   }

   get width_or_zero(): number {
      return this.zSerial.width ?? parseInt(this.modelType_or_zero.split(' ')[1]!)
   }

   get height_or_zero(): number {
      return this.zSerial.height ?? parseInt(this.modelType_or_zero.split(' ')[1]!)
   }

   protected zSetOwnSerial(next: Field_size_serial): void {
      // 1. MAKE SERIAL CANONICAL
      if (
         next.width == null || //
         next.height == null ||
         next.aspectRatio == null ||
         next.modelType == null
      ) {
         const def = this.zConfig.default
         if (def != null) {
            next = produce(next, (draft) => {
               draft.aspectRatio = next.aspectRatio ?? def.aspectRatio
               draft.modelType = next.modelType ?? def.modelType
               draft.width = next.width ?? def.width
               draft.height = next.height ?? def.height
            })
         }
      }

      // 2. ASSIGN SERIAL
      this.zAssignNewSerial(next)

      // 3. RECONCILE CHILDREN
      // (primitive field; no children)
   }

   get zOwnConfigSpecificProblems(): Problem_Ext {
      return null
   }

   get zOwnTypeSpecificProblems(): Problem_Ext {
      return null
   }

   @computed get defaultValue(): Field_size_value {
      const config = this.zSchema.config
      const aspectRatio: AspectRatio = config.default?.aspectRatio ?? '1:1'
      const modelType: SDModelType = config.default?.modelType ?? 'SD1.5 512'
      const width = config.default?.width ?? parseInt(modelType.split(' ')[1]!)
      const height = config.default?.height ?? parseInt(modelType.split(' ')[1]!)
      return { $: 'size', aspectRatio, modelType, height, width }
   }

   get zHasChanges(): boolean {
      const def = this.defaultValue
      if (this.zSerial.width !== def.width) return true
      if (this.zSerial.height !== def.height) return true
      if (this.zSerial.aspectRatio !== def.aspectRatio) return true
      return false
   }

   override zReset(): void {
      this.zValue = this.defaultValue
   }

   /** crash if unset */
   get width(): number {
      return bang(this.zSerial.width)
   }

   /** crash if unset */
   get height(): number {
      return bang(this.zSerial.height)
   }

   set width(next: number) {
      if (next === this.zSerial.width) return
      this.zRunInTransaction(() => void this.zPatchSerial((draft) => void (draft.width = next)))
   }

   set height(next: number) {
      if (next === this.zSerial.height) return
      this.zRunInTransaction(() => void this.zPatchSerial((draft) => void (draft.height = next)))
   }

   setWidth(width: number): void {
      this.width = width
      this.wasHeightAdjustedLast = false
      if (this.isAspectRatioLocked) {
         this.updateHeightBasedOnAspectRatio()
      }
   }

   setHeight(height: number): void {
      this.height = height
      this.wasHeightAdjustedLast = true
      if (this.isAspectRatioLocked) {
         this.updateWidthBasedOnAspectRatio()
      }
   }

   get zValue(): Field_size_value {
      return this.zValue_or_fail
   }

   set zValue(val: Field_size_value) {
      // ugly code;
      if (
         val.width === this.zSerial.width && //
         val.height === this.zSerial.height &&
         val.aspectRatio === this.zSerial.aspectRatio
      ) {
         return
      }
      this.zRunInTransaction(() => {
         this.zPatchSerial((draft) => {
            Object.assign(draft, val)
         })
      })
   }

   get zValue_or_fail(): Field_size_value {
      const serial = this.zValue_unchecked
      if (!this.zIsOwnSet) throw new Error('Field_size.zValue_or_fail: field not set')
      return {
         $: 'size',
         aspectRatio: bang(serial.aspectRatio),
         modelType: bang(serial.modelType),
         height: bang(serial.height),
         width: bang(serial.width),
      }
   }

   get zValue_or_zero(): Field_size_value {
      return {
         $: 'size',
         aspectRatio: this.aspectRatio_or_zero,
         modelType: this.modelType_or_zero,
         height: this.height_or_zero,
         width: this.width_or_zero,
      }
   }

   get zValue_unchecked(): Field_size_unchecked {
      return this.zSerial
   }

   override zIsValueEqual(other: Field): boolean {
      if (!(other instanceof Field_size)) return false

      return this.zSerial.height === other.zSerial.height && this.zSerial.width === other.zSerial.width
   }

   public static readonly patchedSerialPaths: readonly string[] = Object.freeze([
      'width',
      'height',
      'aspectRatio',
      'modelType',
   ])

   private idealSizeforModelType(model: ModelType | string): SizeAble {
      if (model === 'xl') return { width: 1024, height: 1024 }
      if (model === '2.0') return { width: 768, height: 768 }
      if (model === '2.1') return { width: 768, height: 768 }
      if (model === '1.5') return { width: 512, height: 512 }
      if (model === '1.4') return { width: 512, height: 512 }
      return { width: this.width, height: this.height }
   }

   /** flip width and height */
   flip(): void {
      if (this.width === this.height) return
      this.zRunInTransaction(() => {
         const prevWidth = this.width
         this.width = this.height
         this.height = prevWidth
      })
   }

   desiredModelType: ModelType = '1.5'
   desiredAspectRatio: AspectRatio = '1:1'
   isAspectRatioLocked: boolean = false
   wasHeightAdjustedLast: boolean = true

   private toAspectRatio(realAspectRatio: number): AspectRatio {
      const ratio = parseFloatNoRoundingErr(realAspectRatio, 2)
      if (ratio === parseFloatNoRoundingErr(1 / 1, 2)) return '1:1'
      if (ratio === parseFloatNoRoundingErr(16 / 9, 2)) return '16:9'
      if (ratio === parseFloatNoRoundingErr(4 / 3, 2)) return '4:3'
      if (ratio === parseFloatNoRoundingErr(16 / 15, 2)) return '16:15'
      if (ratio === parseFloatNoRoundingErr(17 / 15, 2)) return '17:15'
      if (ratio === parseFloatNoRoundingErr(17 / 14, 2)) return '17:14'
      if (ratio === parseFloatNoRoundingErr(9 / 7, 2)) return '9:7'
      if (ratio === parseFloatNoRoundingErr(18 / 13, 2)) return '18:13'
      if (ratio === parseFloatNoRoundingErr(19 / 13, 2)) return '19:13'
      if (ratio === parseFloatNoRoundingErr(5 / 3, 2)) return '5:3'
      if (ratio === parseFloatNoRoundingErr(7 / 4, 2)) return '7:4'
      if (ratio === parseFloatNoRoundingErr(21 / 11, 2)) return '21:11'
      if (ratio === parseFloatNoRoundingErr(2 / 1, 2)) return '2:1'
      return '1:1'
   }

   get realAspectRatio(): number {
      return this.width / this.height
   }

   setModelType(modelType: ModelType): void {
      this.desiredModelType = modelType
      // const currentAspect = this.width / this.height
      const itgt = this.idealSizeforModelType(modelType)
      const diagPrev = Math.sqrt(this.width ** 2 + this.height ** 2)
      const diagNext = Math.sqrt(itgt.width ** 2 + itgt.height ** 2)
      const factor = diagNext / diagPrev
      console.log({ modelType, idealTarget: itgt, avg: diagPrev, avg2: diagNext, factor })
      this.width = Math.round(this.width * factor)
      this.height = Math.round(this.height * factor)
      console.log(`final is w=${this.width} x h=${this.height}`)
      console.log(`fixed avg is ${Math.sqrt(this.width ** 2 + this.height ** 2)}`)
   }

   setAspectRatio(aspectRatio: AspectRatio): void {
      this.desiredAspectRatio = aspectRatio
      const definedHeight = aspectRatioMap[this.desiredAspectRatio]?.height
      const definedWidth = aspectRatioMap[this.desiredAspectRatio]?.width
      if (definedHeight && definedWidth) {
         this.height = definedHeight
         this.width = definedWidth
      }
      // if (this.isAspectRatioLocked) {
      else if (this.wasHeightAdjustedLast) {
         this.updateWidthBasedOnAspectRatio()
      } else {
         this.updateHeightBasedOnAspectRatio()
      }
      // }
   }

   private updateHeightBasedOnAspectRatio(): void {
      const [widthRatio, heightRatio] = this.desiredAspectRatio.split(':').map(Number)
      this.height = Math.round(this.width * (heightRatio! / widthRatio!))
   }

   private updateWidthBasedOnAspectRatio(): void {
      const [widthRatio, heightRatio] = this.desiredAspectRatio.split(':').map(Number)
      this.width = Math.round(this.height * (widthRatio! / heightRatio!))
   }
}

// DI
registerFieldClass('size', Field_size)
Field_size satisfies FieldConstructor<Field_size>
