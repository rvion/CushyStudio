import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
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
export type Field_orbit_config = FieldConfig<
    {
        default?: Partial<OrbitData>
    },
    Field_orbit_types
>

// #region Serial
export type Field_orbit_serial = FieldSerial<{
    $: 'orbit'
    azimuth?: number
    elevation?: number
}>

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

// #region Types
export type Field_orbit_types = {
    $Type: 'orbit'
    $Config: Field_orbit_config
    $Serial: Field_orbit_serial
    $Value: Field_orbit_value
    $Unchecked: Field_orbit_unchecked
    $Field: Field_orbit
    $Child: never
    $Reflect: Field_orbit_types
}

// STATE
export class Field_orbit extends Field<Field_orbit_types> {
    // #region types
    static readonly type: 'orbit' = 'orbit'
    static readonly emptySerial: Field_orbit_serial = { $: 'orbit' }
    static migrateSerial(): undefined {}
    static codegenValueType(config: Field_orbit_config): string {
        return `number`
    }

    // #region Ctor
    constructor(
        //
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: BaseSchema<Field_orbit>,
        initialMountKey: string,
        serial?: Field_orbit_serial,
    ) {
        super(repo, root, parent, schema, initialMountKey, serial)
        this.init(serial, {
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

    // #region Serial
    get isOwnSet(): boolean {
        if (this.serial.azimuth == null) return false
        if (this.serial.elevation == null) return false
        return true
    }

    protected setOwnSerial(next: Field_orbit_serial): void {
        // assign default
        if (this.serial.azimuth == null) {
            const def = this.config.default
            if (def != null) {
                next = produce(next, (draft) => {
                    draft.azimuth ??= def.azimuth ?? 0
                    draft.elevation ??= def.elevation ?? 0
                })
            }
        }

        this.assignNewSerial(next)
    }

    // #region UI
    DefaultHeaderUI: FC<{ field: Field_orbit }> = WidgetOrbitUI
    DefaultBodyUI: undefined = undefined

    // #region Validation
    get ownTypeSpecificProblems(): Problem_Ext {
        return null
    }
    get ownConfigSpecificProblems(): Problem_Ext {
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
        this.runInValueTransaction(() => {
            this.serial.azimuth = clampMod(-90 + p.azimuth_rad * (180 / Math.PI), -180, 180)
            this.serial.elevation = clampMod(90 - p.elevation_rad * (180 / Math.PI), -180, 180)
        })
        // (Math.PI / 4 - curr.getPolarAngle()) * (180 / Math.PI)
    }

    // #region Changes
    get hasChanges(): boolean {
        if (this.azimuth !== this.defaultAzimuth) return true
        if (this.elevation !== this.defaultElevation) return true
        return false
    }

    // #region Value
    get value(): Field_orbit_value {
        return this.value_or_fail
    }

    set value(val: Field_orbit_value) {
        this.azimuth = val.azimuth
        this.elevation = val.elevation
    }

    get value_or_fail(): Field_orbit_value {
        const azimuth = this.azimuth_or_fail
        const elevation = this.elevation_or_fail
        const englishSummary = mkEnglishSummary(azimuth, elevation)
        return { azimuth, elevation, englishSummary }
    }

    get value_or_zero(): Field_orbit_value {
        const azimuth = this.azimuth_or_zero
        const elevation = this.elevation_or_zero
        const englishSummary = mkEnglishSummary(azimuth, elevation)
        return { azimuth, elevation, englishSummary }
    }

    get value_unchecked(): Field_orbit_unchecked {
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
        this.runInValueTransaction(() => {
            this.patchSerial((draft) => {
                draft.azimuth = val
            })
        })
    }

    get azimuth_or_fail(): number {
        return bang(this.serial.azimuth)
    }

    get azimuth_or_zero(): number {
        return this.serial.azimuth ?? 0
    }

    get azimuth_unchecked(): number | undefined {
        return this.serial.azimuth
    }

    get defaultAzimuth(): number | undefined {
        return this.config.default?.azimuth
    }

    // #region Elevation
    get elevation(): number {
        return this.elevation_or_fail
    }

    set elevation(val: number) {
        if (this.elevation === val) return
        this.runInValueTransaction(() => {
            this.patchSerial((draft) => {
                draft.elevation = val
            })
        })
    }

    get elevation_or_fail(): number {
        return bang(this.serial.elevation)
    }

    get elevation_or_zero(): number {
        return this.serial.elevation ?? 0
    }

    get elevation_unchecked(): number | undefined {
        return this.serial.elevation
    }

    get defaultElevation(): number | undefined {
        return this.config.default?.elevation
    }
}

// #region DI
registerFieldClass<Field_orbit>('orbit', Field_orbit)
