import type { Form } from '../../Form'
import type { IWidget, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { hash } from 'ohash'

import { WidgetDI } from '../WidgetUI.DI'
import { mkEnglishSummary } from './_orbitUtils'
import { WidgetOrbitUI } from './WidgetOrbitUI'

export type OrbitData = {
    azimuth: number
    elevation: number
}

// CONFIG
export type Widget_orbit_config = WidgetConfigFields<{
    default?: Partial<OrbitData>
}>

// SERIAL
export type Widget_orbit_serial = WidgetSerialFields<{
    type: 'orbit'
    active: true
    val: OrbitData
}>

// OUT
export type Widget_orbit_output = {
    azimuth: number
    elevation: number
    englishSummary: string
}

// TYPES
export type Widget_orbit_types = {
    $Type: 'orbit'
    $Input: Widget_orbit_config
    $Serial: Widget_orbit_serial
    $Output: Widget_orbit_output
    $Widget: Widget_orbit
}

// STATE
export interface Widget_orbit extends Widget_orbit_types {}
export class Widget_orbit implements IWidget<Widget_orbit_types> {
    HeaderUI = WidgetOrbitUI
    BodyUI = undefined
    get serialHash () { return hash(this.value) } // prettier-ignore
    id: string
    type: 'orbit' = 'orbit'

    /** reset azimuth and elevation */
    reset = () => {
        this.serial.val.azimuth = this.config.default?.azimuth ?? 0
        this.serial.val.elevation = this.config.default?.elevation ?? 0
    }

    /** practical to add to your textual prompt */
    get englishSummary() {
        return mkEnglishSummary(this.serial.val.azimuth, this.serial.val.elevation)
    }

    get euler() {
        const radius = 5
        const azimuthRad = this.serial.val.azimuth * (Math.PI / 180)
        const elevationRad = this.serial.val.elevation * (Math.PI / 180)
        const x = radius * Math.cos(elevationRad) * Math.sin(azimuthRad)
        const y = radius * Math.cos(elevationRad) * Math.cos(azimuthRad)
        const z = radius * Math.sin(elevationRad)
        // const cameraPosition =[x,y,z] as const
        return { x: y, y: z, z: -x }
    }

    serial: Widget_orbit_serial

    constructor(public form: Form<any>, public config: Widget_orbit_config, serial?: Widget_orbit_serial) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            type: 'orbit',
            collapsed: config.startCollapsed,
            active: true,
            val: {
                azimuth: config.default?.azimuth ?? 0,
                elevation: config.default?.elevation ?? 0,
            },
            id: this.id,
        }
        makeAutoObservable(this)
    }
    get value(): Widget_orbit_output {
        return {
            azimuth: this.serial.val.azimuth,
            elevation: this.serial.val.elevation,
            englishSummary: this.englishSummary,
        }
    }
}

// DI
WidgetDI.Widget_orbit = Widget_orbit
