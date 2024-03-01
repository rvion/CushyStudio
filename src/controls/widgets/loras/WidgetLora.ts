import type { Form } from '../../Form'
import type { IWidget, WidgetConfigFields, WidgetSerialFields } from 'src/controls/IWidget'
import type { SimplifiedLoraDef } from 'src/presets/SimplifiedLoraDef'
import type { ItemDataType } from 'src/rsuite/RsuiteTypes'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { hash } from 'ohash'

import { WidgetDI } from '../WidgetUI.DI'
import { WidgetLorasUI } from './WidgetLorasUI'

// CONFIG
export type Widget_loras_config = WidgetConfigFields<{ default?: SimplifiedLoraDef[] }>

// SERIAL
export type Widget_loras_serial = WidgetSerialFields<{ type: 'loras'; active: true; loras: SimplifiedLoraDef[] }>

// OUT
export type Widget_loras_output = SimplifiedLoraDef[]

// TYPES
export type Widget_loras_types = {
    $Type: 'loras'
    $Input: Widget_loras_config
    $Serial: Widget_loras_serial
    $Output: Widget_loras_output
    $Widget: Widget_loras
}

// STATE
export interface Widget_loras extends Widget_loras_types {}
export class Widget_loras implements IWidget<Widget_loras_types> {
    HeaderUI = WidgetLorasUI
    BodyUI = undefined
    get serialHash(): string {
        return hash(this.value)
    }
    id: string
    type: 'loras' = 'loras'
    serial: Widget_loras_serial
    constructor(public form: Form<any>, public config: Widget_loras_config, serial?: Widget_loras_serial) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            type: 'loras',
            collapsed: config.startCollapsed,
            id: this.id,
            active: true,
            loras: config.default ?? [],
        }
        this.allLoras = cushy.schema.getLoras()
        for (const lora of this.allLoras) {
            if (lora === 'None') continue
            this._insertLora(lora)
        }
        for (const v of this.serial.loras) this.selectedLoras.set(v.name, v)
        makeAutoObservable(this)
    }
    get value(): Widget_loras_output {
        return this.serial.loras
    }
    allLoras: string[]
    selectedLoras = new Map<string, SimplifiedLoraDef>()
    FOLDER: ItemDataType[] = []
    private _insertLora = (rawPath: string) => {
        const path = rawPath.replace(/\\/g, '/')
        const segments = path.split('/')
        let folder = this.FOLDER
        for (let i = 0; i < segments.length - 1; i++) {
            const segment = segments[i]
            const found = folder.find((x) => x.label === segment)
            if (found == null) {
                const value = segments.slice(0, i + 1).join('\\')
                const node = { label: segment, value: value, children: [] }
                folder.push(node)
                folder = node.children
            } else {
                folder = found.children!
            }
        }
        folder.push({ label: segments[segments.length - 1], value: rawPath })
    }
}

// DI
WidgetDI.Widget_loras = Widget_loras
