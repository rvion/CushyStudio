import type { Form } from '../../Form'
import type { ISpec } from '../../ISpec'
import type { IWidget, IWidgetMixins, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'

import { applyWidgetMixinV2 } from '../../Mixins'
import { registerWidgetClass } from '../WidgetUI.DI'
import { clampMod, mkEnglishSummary } from './_orbitUtils'
import { WidgetOrbitUI } from './WidgetOrbitUI'

export type OrbitData = {
    azimuth: number
    elevation: number
}

// CONFIG
export type Widget_orbit_config = WidgetConfigFields<{ default?: Partial<OrbitData> }, Widget_orbit_types>

// SERIAL
export type Widget_orbit_serial = WidgetSerialFields<{
    type: 'orbit'
    value: OrbitData
}>

// SERIAL FROM VALUE
export const Widget_orbit_fromValue = (value: Widget_orbit_value): Widget_orbit_serial => ({
    type: 'orbit',
    value: {
        azimuth: value.azimuth,
        elevation: value.elevation,
    },
})

// VALUE
export type Widget_orbit_value = {
    azimuth: number
    elevation: number
    englishSummary: string
}

// TYPES
export type Widget_orbit_types = {
    $Type: 'orbit'
    $Config: Widget_orbit_config
    $Serial: Widget_orbit_serial
    $Value: Widget_orbit_value
    $Widget: Widget_orbit
}

// STATE
export interface Widget_orbit extends Widget_orbit_types, IWidgetMixins {}
export class Widget_orbit implements IWidget<Widget_orbit_types> {
    DefaultHeaderUI = WidgetOrbitUI
    DefaultBodyUI = undefined
    readonly id: string
    get config() { return this.spec.config } // prettier-ignore
    type: 'orbit' = 'orbit'

    /** reset azimuth and elevation */
    reset = () => {
        this.serial.value.azimuth = this.config.default?.azimuth ?? 0
        this.serial.value.elevation = this.config.default?.elevation ?? 0
    }

    /** practical to add to your textual prompt */
    get englishSummary() {
        return mkEnglishSummary(
            //
            this.serial.value.azimuth,
            this.serial.value.elevation,
        )
    }

    get euler() {
        const radius = 5
        const azimuthRad = this.serial.value.azimuth * (Math.PI / 180)
        const elevationRad = this.serial.value.elevation * (Math.PI / 180)
        const x = radius * Math.cos(elevationRad) * Math.sin(azimuthRad)
        const y = radius * Math.cos(elevationRad) * Math.cos(azimuthRad)
        const z = radius * Math.sin(elevationRad)
        // const cameraPosition =[x,y,z] as const
        return { x: y, y: z, z: -x }
    }

    serial: Widget_orbit_serial

    constructor(
        //
        public readonly form: Form,
        public readonly parent: IWidget | null,
        public readonly spec: ISpec<Widget_orbit>,
        serial?: Widget_orbit_serial,
    ) {
        const config = spec.config
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            type: 'orbit',
            collapsed: config.startCollapsed,
            value: {
                azimuth: config.default?.azimuth ?? 0,
                elevation: config.default?.elevation ?? 0,
            },
            id: this.id,
        }

        /* 💊 BACKWARD COMPAT */
        /* 💊 */ const serialAny = this.serial as any
        /* 💊 */ if (serialAny.val && serialAny.value == null) serialAny.value = serialAny.val

        applyWidgetMixinV2(this)
        makeAutoObservable(this)
    }

    // x: Partial<number> = 0
    setForZero123 = (p: { azimuth_rad: number; elevation_rad: number }) => {
        this.serial.value.azimuth = clampMod(-90 + p.azimuth_rad * (180 / Math.PI), -180, 180)
        this.serial.value.elevation = clampMod(90 - p.elevation_rad * (180 / Math.PI), -180, 180) // (Math.PI / 4 - curr.getPolarAngle()) * (180 / Math.PI)
    }

    get value(): Widget_orbit_value {
        return {
            azimuth: this.serial.value.azimuth,
            elevation: this.serial.value.elevation,
            englishSummary: this.englishSummary,
        }
    }
}

// DI
registerWidgetClass<Widget_orbit>('orbit', Widget_orbit)
