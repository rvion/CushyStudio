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
   ['Ҩtype']: 'orbit'
   ['ҨownConfig']: Field_orbit_ownConfig
   ['ҨownSerial']: Field_orbit_ownSerial
   ['Ҩvalue']: Field_orbit_value
   ['Ҩunchecked']: Field_orbit_unchecked
   Ҩfield: Field_orbit
   ['Ҩchild']: never
}
export class Field_orbit extends Field {
   // #region types
   static readonly type: 'orbit' = 'orbit'
   static readonly unsetSerial: Field_orbit['Ҩserial'] = { $: 'orbit' }
   static migrateSerial(): undefined {}
   public static readonly patchedSerialPaths: readonly string[] = Object.freeze(['azimuth', 'elevation'])
   static generateSerial(
      value: Maybe<Field_orbit['Ҩvalue']>,
      config: Field_orbit['Ҩconfig'],
   ): Field_orbit['Ҩserial'] {
      if (value == null && config.default == null) return this.unsetSerial
      const selectedVal = value ?? config.default
      return {
         $: 'orbit',
         azimuth: selectedVal?.azimuth,
         elevation: selectedVal?.elevation,
      }
   }
   static codeForTypescriptValue(config: Field_orbit['Ҩconfig']): string {
      return `number`
   }

   // #region Ctor
   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: CSchema<Field_orbit>,
      initialMountKey: string,
      serial?: Field_orbit['Ҩserial'],
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)
   }

   // #region Serial
   get ϟisOwnSet(): boolean {
      if (this.ϟserial.azimuth == null) return false
      if (this.ϟserial.elevation == null) return false
      return true
   }

   protected ϟsetOwnSerial(next: Field_orbit['Ҩserial']): void {
      // assign default
      if (this.ϟserial.azimuth == null) {
         const def = this.ϟconfig.default
         if (def != null) {
            next = produce(next, (draft) => {
               draft.azimuth ??= def.azimuth ?? 0
               draft.elevation ??= def.elevation ?? 0
            })
         }
      }

      this.ϟassignNewSerial(next)
   }

   // #region UI
   DefaultHeaderUI: FC<{ field: Field_orbit }> = WidgetOrbitUI
   DefaultBodyUI: undefined = undefined

   // #region Validation
   get ϟownTypeSpecificProblems(): Problem_Ext {
      return null
   }
   get ϟownConfigSpecificProblems(): Problem_Ext {
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
      this.ϟrunInTransaction(() => {
         this.ϟserial.azimuth = clampMod(-90 + p.azimuth_rad * (180 / Math.PI), -180, 180)
         this.ϟserial.elevation = clampMod(90 - p.elevation_rad * (180 / Math.PI), -180, 180)
      })
      // (Math.PI / 4 - curr.getPolarAngle()) * (180 / Math.PI)
   }

   // #region Changes
   get ϟhasChanges(): boolean {
      if (this.azimuth !== this.defaultAzimuth) return true
      if (this.elevation !== this.defaultElevation) return true
      return false
   }

   override ϟisValueEqual(other: Field): boolean {
      if (!(other instanceof Field_orbit)) return false
      return (
         this.ϟserial.azimuth === other.ϟserial.azimuth && //
         this.ϟserial.elevation === other.ϟserial.elevation
      )
   }

   // #region Value
   get ϟvalue(): Field_orbit_value {
      return this.ϟvalue_or_fail
   }

   set ϟvalue(val: Field_orbit_value) {
      this.azimuth = val.azimuth
      this.elevation = val.elevation
   }

   get ϟvalue_or_fail(): Field_orbit_value {
      const azimuth = this.azimuth_or_fail
      const elevation = this.elevation_or_fail
      const englishSummary = mkEnglishSummary(azimuth, elevation)
      return { azimuth, elevation, englishSummary }
   }

   get ϟvalue_or_zero(): Field_orbit_value {
      const azimuth = this.azimuth_or_zero
      const elevation = this.elevation_or_zero
      const englishSummary = mkEnglishSummary(azimuth, elevation)
      return { azimuth, elevation, englishSummary }
   }

   get ϟvalue_unchecked(): Field_orbit_unchecked {
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
      this.ϟrunInTransaction(() => {
         this.ϟpatchSerial((draft) => {
            draft.azimuth = val
         })
      })
   }

   get azimuth_or_fail(): number {
      return bang(this.ϟserial.azimuth)
   }

   get azimuth_or_zero(): number {
      return this.ϟserial.azimuth ?? 0
   }

   get azimuth_unchecked(): number | undefined {
      return this.ϟserial.azimuth
   }

   get defaultAzimuth(): number | undefined {
      return this.ϟconfig.default?.azimuth
   }

   // #region Elevation
   get elevation(): number {
      return this.elevation_or_fail
   }

   set elevation(val: number) {
      if (this.elevation === val) return
      this.ϟrunInTransaction(() => {
         this.ϟpatchSerial((draft) => {
            draft.elevation = val
         })
      })
   }

   get elevation_or_fail(): number {
      return bang(this.ϟserial.elevation)
   }

   get elevation_or_zero(): number {
      return this.ϟserial.elevation ?? 0
   }

   get elevation_unchecked(): number | undefined {
      return this.ϟserial.elevation
   }

   get defaultElevation(): number | undefined {
      return this.ϟconfig.default?.elevation
   }
}

// #region DI
registerFieldClass('orbit', Field_orbit)
Field_orbit satisfies FieldConstructor<Field_orbit>
