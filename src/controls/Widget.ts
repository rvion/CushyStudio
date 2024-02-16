/**
 * this file is an attempt to centralize core widget definition in a single
 * file so it's easy to add any widget in the future
 */
import type { SimplifiedLoraDef } from 'src/presets/SimplifiedLoraDef'
import type { ItemDataType } from 'src/rsuite/RsuiteTypes'
import type { FormBuilder } from './FormBuilder'
import type { IWidget_OLD, WidgetConfigFields, WidgetSerialFields, WidgetTypeHelpers_OLD } from './IWidget'

import type { Widget_bool } from './widgets/bool/WidgetBool'
import type { Widget_choices } from './widgets/choices/WidgetChoices'
import type { Widget_color } from './widgets/color/WidgetColor'
import type { Widget_custom } from './widgets/custom/WidgetCustom'
import type { Widget_enum } from './widgets/enum/WidgetEnum'
import type { Widget_group } from './widgets/group/WidgetGroup'
import type { Widget_image } from './widgets/image/WidgetImage'
import type { Widget_list } from './widgets/list/WidgetList'
import type { Widget_listExt } from './widgets/listExt/WidgetListExt'
import type { Widget_number } from './widgets/number/WidgetNumber'
import type { Widget_optional } from './widgets/optional/WidgetOptional'
import type { Widget_orbit } from './widgets/orbit/WidgetOrbit'
import type { Widget_prompt } from './widgets/prompt/WidgetPrompt'
import type { Widget_size } from './widgets/size/WidgetSize'
import type { Widget_string } from './widgets/string/WidgetString'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { bang } from 'src/utils/misc/bang'

import { hash } from 'ohash'
import { WidgetDI } from './widgets/WidgetUI.DI'


// Widget is a closed union for added type safety
export type Widget =
    | Widget_optional<any>
    | Widget_color
    | Widget_string
    | Widget_prompt
    | Widget_orbit
    | Widget_prompt
    | Widget_seed
    | Widget_number
    | Widget_bool
    | Widget_inlineRun
    | Widget_markdown
    | Widget_custom<any>
    | Widget_size
    | Widget_matrix
    | Widget_loras
    | Widget_image
    | Widget_selectMany<any>
    | Widget_selectOne<any>
    | Widget_list<any>
    | Widget_listExt<any>
    | Widget_group<any>
    | Widget_choices<any>
    | Widget_enum<any>


// 🅿️ markdown ==============================================================================
export type Widget_markdown_config = WidgetConfigFields<{ markdown: string | ((formRoot:Widget_group<any>) => string); }>
export type Widget_markdown_serial = WidgetSerialFields<{ type: 'markdown', active: true }>
export type Widget_markdown_state  = WidgetSerialFields<{ type: 'markdown', active: true }>
export type Widget_markdown_output = { type: 'markdown', active: true }
export interface Widget_markdown extends WidgetTypeHelpers_OLD<'markdown', Widget_markdown_config, Widget_markdown_serial, Widget_markdown_state, Widget_markdown_output> {}
export class Widget_markdown implements IWidget_OLD<'markdown', Widget_markdown_config, Widget_markdown_serial, Widget_markdown_state, Widget_markdown_output> {
    isVerticalByDefault = true
    isCollapsible = true
    id: string
    type: 'markdown' = 'markdown'
    serial: Widget_markdown_state
    get serialHash () { return this.id }

    get markdown() :string{
        const md= this.config.markdown
        if (typeof md === 'string') return md
        return md(this.form._ROOT)
    }

    constructor(
        public form: FormBuilder,
        public config: Widget_markdown_config,
        serial?: Widget_markdown_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? { type:'markdown', collapsed: config.startCollapsed, active: true, id: this.id }
        makeAutoObservable(this)
    }

    get value(): Widget_markdown_output { return this.serial }
}



// 🅿️ seed ==============================================================================
export type Widget_seed_config  = WidgetConfigFields<{ default?: number; defaultMode?: 'randomize' | 'fixed' | 'last', min?: number; max?: number }>
export type Widget_seed_serial = Widget_seed_state
export type Widget_seed_state  = WidgetSerialFields<{ type:'seed', active: true; val: number, mode: 'randomize' | 'fixed' | 'last' }>
export type Widget_seed_output = number
export interface Widget_seed extends WidgetTypeHelpers_OLD<'seed', Widget_seed_config, Widget_seed_serial, Widget_seed_state, Widget_seed_output> {}
export class Widget_seed implements IWidget_OLD<'seed', Widget_seed_config, Widget_seed_serial, Widget_seed_state, Widget_seed_output> {
    readonly isVerticalByDefault = false
    readonly isCollapsible = false
    readonly id: string
    readonly type: 'seed' = 'seed'
    readonly serial: Widget_seed_state
    get serialHash () {
        if (this.serial.mode === 'randomize') return hash(this.serial.mode)
        return hash(this.value)
    }
    constructor(
        public form: FormBuilder,
        public config: Widget_seed_config,
        serial?: Widget_seed_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            type: 'seed',
            id: this.id,
            active: true,
            val: config.default ?? 0,
            mode: config.defaultMode ?? 'randomize'
        }
        makeAutoObservable(this)
    }
    get value(): Widget_seed_output {
        const count = this.form._cache.count
        return this.serial.mode ==='randomize'
            ? Math.floor(Math.random()* 9_999_999)
            : this.serial.val
    }
}


// 🅿️ inlineRun ==============================================================================
export type Widget_inlineRun_config  = WidgetConfigFields<{text?: string, kind?: `primary`|`special`|`warning`}>
export type Widget_inlineRun_serial = Widget_inlineRun_state
export type Widget_inlineRun_state  = WidgetSerialFields<{ type:'inlineRun', active: true; val: boolean }>
export type Widget_inlineRun_output = boolean
export interface Widget_inlineRun extends WidgetTypeHelpers_OLD<'inlineRun', Widget_inlineRun_config, Widget_inlineRun_serial, Widget_inlineRun_state, Widget_inlineRun_output> {}
export class Widget_inlineRun implements IWidget_OLD<'inlineRun', Widget_inlineRun_config, Widget_inlineRun_serial, Widget_inlineRun_state, Widget_inlineRun_output> {
    get serialHash () { return hash(this.value) }
    readonly isVerticalByDefault = false
    readonly isCollapsible = false
    readonly id: string
    readonly type: 'inlineRun' = 'inlineRun'
    readonly serial: Widget_inlineRun_state
    constructor(
        public form: FormBuilder,
        public config: Widget_inlineRun_config,
        serial?: Widget_inlineRun_serial,
    ) {
        if(config.text){
            config.label = config.label ?? ` `;
        }

        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? { type: 'inlineRun', collapsed: config.startCollapsed, id: this.id, active: true, val: false, }
        makeAutoObservable(this)
    }
    get value(): Widget_inlineRun_output { return this.serial.active ? this.serial.val : false}
}



// 🅿️ matrix ==============================================================================
export type Widget_matrix_cell = {
    x: number
    y: number
    row: string
    col: string
    value: boolean
}
export type Widget_matrix_config = WidgetConfigFields<{ default?: { row: string; col: string }[]; rows: string[]; cols: string[] }>
export type Widget_matrix_serial = WidgetSerialFields<{ type: 'matrix', active: true; selected: Widget_matrix_cell[] }>
export type Widget_matrix_output = Widget_matrix_cell[]
export interface Widget_matrix extends WidgetTypeHelpers_OLD<'matrix', Widget_matrix_config, Widget_matrix_serial, 0, Widget_matrix_output> {}
export class Widget_matrix implements IWidget_OLD<'matrix', Widget_matrix_config, Widget_matrix_serial, 0, Widget_matrix_output> {
    get serialHash () { return hash(this.value) }
    readonly isVerticalByDefault = true
    readonly isCollapsible = true
    readonly id: string
    readonly type: 'matrix' = 'matrix'
    readonly serial: Widget_matrix_serial

    rows: string[]
    cols: string[]

    constructor(
        public form: FormBuilder,
        public config: Widget_matrix_config,
        serial?: Widget_matrix_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? { type:'matrix', collapsed: config.startCollapsed, id: this.id, active: true, selected: [] }

        const rows = config.rows
        const cols = config.cols

        // init all cells to false
        for (const [rowIx, row] of rows.entries()) {
            for (const [colIx, col] of cols.entries()) {
                this.store.set(this.key(row, col), { x: rowIx, y: colIx, col, row, value: false })
            }
        }
        // apply default value
        const values = this.serial.selected
        if (values)
            for (const v of values) {
                this.store.set(this.key(rows[v.x], cols[v.y]), v)
            }
        this.rows = config.rows
        this.cols = config.cols
        // make observable
        makeAutoObservable(this)
    }
    get value(): Widget_matrix_output {
        // if (!this.state.active) return undefined
        return this.serial.selected
    }

    private sep = ' &&& '
    private store = new Map<string, Widget_matrix_cell>()
    private key = (row: string, col: string) => `${row}${this.sep}${col}`
    get allCells() { return Array.from(this.store.values()) } // prettier-ignore
    UPDATE = () => (this.serial.selected = this.RESULT)
    get RESULT() {
        return this.allCells.filter((v) => v.value)
    }

    get firstValue() {
        return this.allCells[0]?.value ?? false
    }

    setAll = (value: boolean) => {
        for (const v of this.allCells) v.value = value
        this.UPDATE()
        // this.p.set(this.values)
    }

    setRow = (row: string, val: boolean) => {
        for (const v of this.cols) {
            const cell = this.get(row, v)
            cell.value = val
        }
        this.UPDATE()
    }

    setCol = (col: string, val: boolean) => {
        for (const r of this.rows) {
            const cell = this.get(r, col)
            cell.value = val
        }
        this.UPDATE()
    }

    get = (row: string, col: string): Widget_matrix_cell => {
        return bang(this.store.get(this.key(row, col)))
    }

    set = (row: string, col: string, value: boolean) => {
        const cell = this.get(row, col)
        cell.value = value
        this.UPDATE()
    }
}

// 🅿️ loras ==============================================================================
export type Widget_loras_config  = WidgetConfigFields<{ default?: SimplifiedLoraDef[] }>
export type Widget_loras_serial = WidgetSerialFields<{ type: 'loras', active: true; loras: SimplifiedLoraDef[] }>
export type Widget_loras_output = SimplifiedLoraDef[]
export interface Widget_loras extends WidgetTypeHelpers_OLD<'loras', Widget_loras_config, Widget_loras_serial, any, Widget_loras_output> {}
export class Widget_loras implements IWidget_OLD<'loras', Widget_loras_config, Widget_loras_serial, any, Widget_loras_output> {
    get serialHash () { return hash(this.value) }
    isVerticalByDefault = true
    isCollapsible = true
    id: string
    type: 'loras' = 'loras'
    serial: Widget_loras_serial
    constructor(
        public form: FormBuilder,
        public config: Widget_loras_config,
        serial?: Widget_loras_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? { type: 'loras', collapsed: config.startCollapsed, id: this.id, active: true, loras: config.default ?? [] }
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

// 🅿️ selectOne ==============================================================================
export type BaseSelectEntry = { id: string, label?: string }
export type Widget_selectOne_config <T extends BaseSelectEntry>  = WidgetConfigFields<{
    default?: T;
    choices: T[] | ((formRoot:Widget_group<any>) => T[]),
    appearance?: 'select' | 'tab'
}>
export type Widget_selectOne_serial<T extends BaseSelectEntry> = Widget_selectOne_state<T>
export type Widget_selectOne_state <T extends BaseSelectEntry>  = WidgetSerialFields<{ type:'selectOne', query: string; val: T }>
export type Widget_selectOne_output<T extends BaseSelectEntry> = T
export interface Widget_selectOne<T>  extends WidgetTypeHelpers_OLD<'selectOne', Widget_selectOne_config<T>, Widget_selectOne_serial<T>, Widget_selectOne_state<T>, Widget_selectOne_output<T>> {}
export class Widget_selectOne<T extends BaseSelectEntry> implements IWidget_OLD<'selectOne', Widget_selectOne_config<T>, Widget_selectOne_serial<T>, Widget_selectOne_state<T>, Widget_selectOne_output<T>> {
    get serialHash () { return hash(this.value) }
    readonly isVerticalByDefault = false
    readonly isCollapsible = false
    readonly id: string
    readonly type: 'selectOne' = 'selectOne'
    readonly serial: Widget_selectOne_state<T>

    get errors():Maybe<string>{
        if (this.serial.val==null) return 'no value selected'
        const selected = this.choices.find(c => c.id===this.serial.val.id)
        if (selected==null) return 'selected value not in choices'
        return
    }

    get choices():T[]{
        const _choices = this.config.choices
        if (typeof _choices === 'function'){
            if (this.form._ROOT==null)return []
            return _choices(this.form._ROOT)
        }
        return  _choices
    }
    constructor(
        public form: FormBuilder,
        public config: Widget_selectOne_config<T>,
        serial?: Widget_selectOne_serial<T>,
    ) {
        this.id = serial?.id ?? nanoid()
        const choices = this.choices
        this.serial = serial ?? {
            type: 'selectOne',
            collapsed: config.startCollapsed,
            id: this.id,
            query: '',
            val: config.default ?? choices[0],
        }
        if (this.serial.val == null && Array.isArray(this.config.choices)) this.serial.val = choices[0]
        makeAutoObservable(this)
    }
    get value(): Widget_selectOne_output<T> { return this.serial.val }
}


// 🅿️ selectMany ==============================================================================
export type Widget_selectMany_config<T extends BaseSelectEntry>  = WidgetConfigFields<{ default?: T[]; choices: T[] | ((formRoot:Maybe<Widget_group<any>>) => T[]) }>
export type Widget_selectMany_serial<T extends BaseSelectEntry> = WidgetSerialFields<{ type: 'selectMany', query: string; values: T[] }>
export type Widget_selectMany_output<T extends BaseSelectEntry> = T[]
export interface Widget_selectMany<T extends BaseSelectEntry> extends WidgetTypeHelpers_OLD<'selectMany', Widget_selectMany_config<T>, Widget_selectMany_serial<T>, 0, Widget_selectMany_output<T>> {}
export class Widget_selectMany<T extends BaseSelectEntry> implements IWidget_OLD<'selectMany', Widget_selectMany_config<T>, Widget_selectMany_serial<T>, 0, Widget_selectMany_output<T>> {
    get serialHash () { return hash(this.value) }
    readonly isVerticalByDefault = false
    readonly isCollapsible = false
    readonly id: string
    readonly type: 'selectMany' = 'selectMany'
    readonly serial: Widget_selectMany_serial<T>

    get choices():T[]{
        const _choices = this.config.choices
        return typeof _choices === 'function' //
            ? _choices(this.form._ROOT)
            : _choices
    }
    constructor(
        public form: FormBuilder,
        public config: Widget_selectMany_config<T>,
        serial?: Widget_selectMany_serial<T>,
    ) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            type: 'selectMany',
            collapsed: config.startCollapsed,
            id: this.id,
            query: '',
            values: config.default ?? [],
        }
        makeAutoObservable(this)
    }

    removeItem = (item: T): void => {
        if (this.serial.values==null) {this.serial.values = []; return} // just in case
        this.serial.values = this.serial.values.filter((v) => v.id !== item.id) // filter just in case of duplicate
    }

    addItem = (item: T): void => {
        if (this.serial.values==null) {this.serial.values = [item]; return} // just in case
        const i = this.serial.values.indexOf(item)
        if (i < 0) this.serial.values.push(item)
    }

    toggleItem = (item: T): void => {
        if (this.serial.values==null) {this.serial.values = [item]; return} // just in case
        const i = this.serial.values.indexOf(item)
        if (i < 0) this.serial.values.push(item)
        else this.serial.values = this.serial.values.filter((v) => v.id !== item.id) // filter just in case of duplicate
    }

    get value(): Widget_selectMany_output<T> {
        return this.serial.values
    }
}


WidgetDI.Widget_seed               = Widget_seed
WidgetDI.Widget_inlineRun          = Widget_inlineRun
WidgetDI.Widget_markdown           = Widget_markdown
WidgetDI.Widget_matrix             = Widget_matrix
WidgetDI.Widget_loras              = Widget_loras
WidgetDI.Widget_selectMany         = Widget_selectMany
WidgetDI.Widget_selectOne          = Widget_selectOne
