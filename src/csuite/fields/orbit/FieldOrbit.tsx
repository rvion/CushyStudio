import type { CSchema } from '../../model/CSchema'
import type { FieldConstructor } from '../../model/FieldConstructor'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'
import type { FC } from 'react'

import { produce } from 'immer'

import { Field } from '../../model/Field'
import { bang } from '../../utils/bang'
import { registerFieldClass } from '../WidgetUI.DI'
import { clampMod, mkEnglishSummary } from './_orbitUtils'
import { WidgetOrbitUI } from './WidgetOrbitUI'

export type OrbitData = {
   azimuth: number
   elevation: number
}

// #region Config
export type Field_orbit_ownConfig = {
   default?: Partial<OrbitData>
}

// #region Serial
export type Field_orbit_ownSerial = {
   $: 'orbit'
   azimuth?: number
   elevation?: number
}

// #region Value
export type Field_orbit_value = {
   azimuth: number
   elevation: number
   englishSummary: string
}

export type Field_orbit_unchecked = {
   azimuth?: number
   elevation?: number
   englishSummary?: string
}

// STATE
export interface Field_orbit {
   '{type}': 'orbit'
   '{ownConfig}': Field_orbit_ownConfig
   '{ownSerial}': Field_orbit_ownSerial
   '{value}': Field_orbit_value
   '{setValue}': Field_orbit_value
   '{unchecked}': Field_orbit_unchecked
   '{field}': Field_orbit
   '{child}': never
}
// todo: remove
export class Field_orbit extends Field {
   // #region types
   static readonly type: 'orbit' = 'orbit'
   static migrateSerial(): undefined {}
   static readonly patchedSerialPaths: readonly string[] = Object.freeze(['azimuth', 'elevation'])

   static readonly unsetSerial: Field_orbit['{serial}'] = { $: 'orbit' }
   static generateSerial(
      setValue: Maybe<Field_orbit['{setValue}']>,
      config: Field_orbit['{config}'],
   ): Field_orbit['{serial}'] {
      if (setValue == null && config.default == null) return this.unsetSerial
      const selectedVal = setValue ?? config.default
      const azimuth = selectedVal?.azimuth
      const elevation = selectedVal?.elevation
      return { $: 'orbit', azimuth, elevation }
   }
   static codeForTypescriptValue(config: Field_orbit['{config}']): string {
      return `number`
   }

   // #region Ctor
   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: CSchema<Field_orbit>,
      initialMountKey: string,
      serial?: Field_orbit['{serial}'],
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)
   }

   // #region Serial
   get zIsOwnSet(): boolean {
      if (this.zSerial.azimuth == null) return false
      if (this.zSerial.elevation == null) return false
      return true
   }

   protected zSetOwnSerial(next: Field_orbit['{serial}']): void {
      // assign default
      if (this.zSerial.azimuth == null) {
         const def = this.zConfig.default
         if (def != null) {
            next = produce(next, (draft) => {
               draft.azimuth ??= def.azimuth ?? 0
               draft.elevation ??= def.elevation ?? 0
            })
         }
      }

      this.zAssignNewSerial(next)
   }

   // #region UI
   DefaultHeaderUI: FC<{ field: Field_orbit }> = WidgetOrbitUI
   DefaultBodyUI: undefined = undefined

   // #region Validation
   get zOwnTypeSpecificProblems(): Problem_Ext {
      return null
   }
   get zOwnConfigSpecificProblems(): Problem_Ext {
      return null
   }

   /** reset azimuth and elevation */
   // ⏸️ reset(): void {
   // ⏸️     delete this.serial.elevation
   // ⏸️     delete this.serial.azimuth
   // ⏸️ }

   /** practical to add to your textual prompt */
   get englishSummary(): string {
      return mkEnglishSummary(this.azimuth, this.elevation)
   }

   /** euler position; e.g. for camera rendering */
   get euler(): { x: number; y: number; z: number } {
      const radius = 5
      const azimuthRad = this.azimuth * (Math.PI / 180)
      const elevationRad = this.elevation * (Math.PI / 180)
      const x = radius * Math.cos(elevationRad) * Math.sin(azimuthRad)
      const y = radius * Math.cos(elevationRad) * Math.cos(azimuthRad)
      const z = radius * Math.sin(elevationRad)
      // const cameraPosition =[x,y,z] as const
      return { x: y, y: z, z: -x }
   }

   /** zero123 has a different referential; */
   setForZero123(p: {
      //
      azimuth_rad: number
      elevation_rad: number
   }): void {
      this.zRunInTransaction(() => {
         this.zSerial.azimuth = clampMod(-90 + p.azimuth_rad * (180 / Math.PI), -180, 180)
         this.zSerial.elevation = clampMod(90 - p.elevation_rad * (180 / Math.PI), -180, 180)
      })
      // (Math.PI / 4 - curr.getPolarAngle()) * (180 / Math.PI)
   }

   // #region Changes
   get zHasChanges(): boolean {
      if (this.azimuth !== this.defaultAzimuth) return true
      if (this.elevation !== this.defaultElevation) return true
      return false
   }

   override zIsValueEqual(other: Field): boolean {
      if (!(other instanceof Field_orbit)) return false
      return (
         this.zSerial.azimuth === other.zSerial.azimuth && //
         this.zSerial.elevation === other.zSerial.elevation
      )
   }

   // #region Value
   set zValue(val: Field_orbit_value) {
      this.azimuth = val.azimuth
      this.elevation = val.elevation
   }

   get zValue(): Field_orbit_value {
      const azimuth = this.azimuth_or_fail
      const elevation = this.elevation_or_fail
      const englishSummary = mkEnglishSummary(azimuth, elevation)
      return { azimuth, elevation, englishSummary }
   }

   get zValueOrZero(): Field_orbit_value {
      const azimuth = this.azimuth_or_zero
      const elevation = this.elevation_or_zero
      const englishSummary = mkEnglishSummary(azimuth, elevation)
      return { azimuth, elevation, englishSummary }
   }

   get zValueUnchecked(): Field_orbit_unchecked {
      const azimuth = this.azimuth_unchecked
      const elevation = this.elevation_unchecked
      const englishSummary =
         azimuth != null && elevation != null //
            ? mkEnglishSummary(azimuth, elevation)
            : undefined
      return {
         azimuth,
         elevation,
         englishSummary,
      }
   }

   // #region Azimuth
   get azimuth(): number {
      return this.azimuth_or_fail
   }

   set azimuth(val: number) {
      if (this.azimuth === val) return
      this.zRunInTransaction(() => {
         this.zPatchSerial((draft) => {
            draft.azimuth = val
         })
      })
   }

   get azimuth_or_fail(): number {
      return bang(this.zSerial.azimuth)
   }

   get azimuth_or_zero(): number {
      return this.zSerial.azimuth ?? 0
   }

   get azimuth_unchecked(): number | undefined {
      return this.zSerial.azimuth
   }

   get defaultAzimuth(): number | undefined {
      return this.zConfig.default?.azimuth
   }

   // #region Elevation
   get elevation(): number {
      return this.elevation_or_fail
   }

   set elevation(val: number) {
      if (this.elevation === val) return
      this.zRunInTransaction(() => {
         this.zPatchSerial((draft) => {
            draft.elevation = val
         })
      })
   }

   get elevation_or_fail(): number {
      return bang(this.zSerial.elevation)
   }

   get elevation_or_zero(): number {
      return this.zSerial.elevation ?? 0
   }

   get elevation_unchecked(): number | undefined {
      return this.zSerial.elevation
   }

   get defaultElevation(): number | undefined {
      return this.zConfig.default?.elevation
   }
}

// #region DI
registerFieldClass('orbit', Field_orbit)
Field_orbit satisfies FieldConstructor<Field_orbit>
