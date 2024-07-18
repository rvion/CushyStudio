import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'
import type { FC } from 'react'

import { Field } from '../../model/Field'
import { registerFieldClass } from '../WidgetUI.DI'
import { clampMod, mkEnglishSummary } from './_orbitUtils'
import { WidgetOrbitUI } from './WidgetOrbitUI'

export type OrbitData = {
    azimuth: number
    elevation: number
}

// CONFIG
export type Field_orbit_config = FieldConfig<{ default?: Partial<OrbitData> }, Field_orbit_types>

// SERIAL
export type Field_orbit_serial = FieldSerial<{
    $: 'orbit'
    azimuth?: number
    elevation?: number
}>

// SERIAL FROM VALUE
export const Field_orbit_fromValue = (value: Field_orbit_value): Field_orbit_serial => ({
    $: 'orbit',
    azimuth: value.azimuth,
    elevation: value.elevation,
})

// VALUE
export type Field_orbit_value = {
    azimuth: number
    elevation: number
    englishSummary: string
}

// TYPES
export type Field_orbit_types = {
    $Type: 'orbit'
    $Config: Field_orbit_config
    $Serial: Field_orbit_serial
    $Value: Field_orbit_value
    $Field: Field_orbit
}

// STATE
export class Field_orbit extends Field<Field_orbit_types> {
    static readonly type: 'orbit' = 'orbit'
    DefaultHeaderUI: FC<{ field: Field_orbit }> = WidgetOrbitUI
    DefaultBodyUI: undefined = undefined

    get ownProblems(): Problem_Ext {
        return null
    }

    /** reset azimuth and elevation */
    // ⏸️ reset(): void {
    // ⏸️     delete this.serial.elevation
    // ⏸️     delete this.serial.azimuth
    // ⏸️ }

    /** practical to add to your textual prompt */
    get englishSummary(): string {
        return mkEnglishSummary(
            //
            this.azimuth,
            this.elevation,
        )
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

    constructor(
        //
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: BaseSchema<Field_orbit>,
        serial?: Field_orbit_serial,
    ) {
        super(repo, root, parent, schema)
        this.init(serial, {
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

    protected setOwnSerial(serial: Maybe<Field_orbit_serial>): void {
        this.serial.elevation = serial?.elevation ?? this.defaultElevation
        this.serial.azimuth = serial?.azimuth ?? this.defaultAzimuth
    }

    // x: Partial<number> = 0
    setForZero123(p: { azimuth_rad: number; elevation_rad: number }): void {
        this.runInValueTransaction(() => {
            this.serial.azimuth = clampMod(-90 + p.azimuth_rad * (180 / Math.PI), -180, 180)
            this.serial.elevation = clampMod(90 - p.elevation_rad * (180 / Math.PI), -180, 180)
        })
        // (Math.PI / 4 - curr.getPolarAngle()) * (180 / Math.PI)
    }

    // Value --------------------------------------------
    get value(): Field_orbit_value {
        return {
            azimuth: this.azimuth,
            elevation: this.elevation,
            englishSummary: this.englishSummary,
        }
    }

    set value(val: Field_orbit_value) {
        this.azimuth = val.azimuth
        this.elevation = val.elevation
    }

    get hasChanges(): boolean {
        if (this.azimuth !== this.defaultAzimuth) return true
        if (this.elevation !== this.defaultElevation) return true
        return false
    }

    // Azimuth --------------------------------------------
    get azimuth(): number {
        return this.serial.azimuth ?? this.defaultAzimuth
    }

    set azimuth(val: number) {
        if (this.azimuth === val) return
        this.runInValueTransaction(() => {
            this.serial.azimuth = val
        })
    }

    get defaultAzimuth(): number {
        return this.config.default?.azimuth ?? 0
    }

    // Elevation --------------------------------------------
    get elevation(): number {
        return this.serial.elevation ?? this.defaultElevation
    }

    set elevation(val: number) {
        if (this.elevation === val) return
        this.runInValueTransaction(() => {
            this.serial.elevation = val
        })
    }

    get defaultElevation(): number {
        return this.config.default?.elevation ?? 0
    }
}

// DI
registerFieldClass<Field_orbit>('orbit', Field_orbit)
