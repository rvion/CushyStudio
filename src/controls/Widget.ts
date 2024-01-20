/**
 * this file is an attempt to centralize core widget definition in a single
 * file so it's easy to add any widget in the future
 */
import type { SQLWhere } from 'src/db/SQLWhere'
import type { MediaImageT } from 'src/db/TYPES.gen'
import type { ComfySchemaL } from 'src/models/Schema'
import type { SimplifiedLoraDef } from 'src/presets/SimplifiedLoraDef'
import type { ItemDataType } from 'src/rsuite/RsuiteTypes'
import type { CleanedEnumResult } from 'src/types/EnumUtils'
import type { WidgetPromptOutput } from 'src/widgets/prompter/WidgetPromptUI'
import type { PossibleSerializedNodes } from 'src/widgets/prompter/plugins/PossibleSerializedNodes'
import type { FormBuilder } from './FormBuilder'
import type { IWidget_OLD, WidgetConfigFields, WidgetSerialFields, WidgetTypeHelpers_OLD } from './IWidget'
import type { AspectRatio, CushySize, CushySizeByRatio, ImageAnswer, ImageAnswerForm, SDModelType } from './misc/InfoAnswer'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { FC } from 'react'
import { runWithGlobalForm } from 'src/models/_ctx2'
import { bang } from 'src/utils/misc/bang'
import { EnumDefault, extractDefaultValue } from './EnumDefault'
import { Widget_group } from './widgets/WidgetIGroupUI'
import { WidgetDI } from './widgets/WidgetUI.DI'
import { Widget_bool } from './widgets2/WidgetBool'
import { Widget_choices } from './widgets2/WidgetChoices'
import { Widget_color } from './widgets2/WidgetColor'
import { Widget_number } from './widgets2/WidgetNumber'
import { Widget_str } from './widgets2/WidgetString'
import { Widget_optional } from './widgets2/WidgetOptional'

// Widget is a closed union for added type safety
export type Widget =
    | Widget_optional<any>
    | Widget_color
    | Widget_str<any>
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
    | Widget_enumOpt<any>
    /* 🗑️ */ | Widget_promptOpt
    /* 🗑️ */ | Widget_imageOpt

// 🅿️ orbit ==============================================================================
const inRange = (val: number, min:number,max:number, margin:number=0) => {
    return val >= (min-margin) && val <= (max+margin)

}
const mkEnglishSummary = (
    /** in deg; from -180 to 180 */
    azimuth:number,
    /** in deg, from -90 to 90 */
    elevation: number
):string => {
    const words:string[] =[]
    // const azimuth = this.state.val.azimuth
    // faces: front, back, left, right
    const margin = 20

    if (inRange(elevation,-90,-80,margin)) words.push('from-below')
    else if (inRange(elevation,80,90,0)) words.push('from-above')
    else {
        if (inRange(elevation,-80,-45,0)) words.push('low')
        else if (inRange(elevation,45,80,0)) words.push('high')

        if (inRange(azimuth,-180,-135,margin)) words.push('back')
        else if (inRange(azimuth,135,180,margin)) words.push('back')
        else if (inRange(azimuth,-45,45,margin)) words.push('front')
        else {
            if (inRange(azimuth,-135,-45,margin)) words.push('righ-side') // 'right')
            else if (inRange(azimuth,45,135,margin)) words.push('left-side') // left')
        }

    }

    return `${words.join('-')} view`
}
export type OrbitData = {
    azimuth: number;
    elevation: number;
}
export type Widget_orbit_config  = WidgetConfigFields<{ default?: Partial<OrbitData> }>
export type Widget_orbit_serial = WidgetSerialFields<{ type: 'orbit', active: true; val: OrbitData }>
export type Widget_orbit_state  = WidgetSerialFields<{ type: 'orbit', active: true; val: OrbitData }>
export type Widget_orbit_output = OrbitData & {
    englishSummary: string;
}
export interface Widget_orbit extends WidgetTypeHelpers_OLD<'orbit', Widget_orbit_config, Widget_orbit_serial, Widget_orbit_state, Widget_orbit_output> {}
export class Widget_orbit implements IWidget_OLD<'orbit', Widget_orbit_config, Widget_orbit_serial, Widget_orbit_state, Widget_orbit_output> {
    isVerticalByDefault = true
    isCollapsible = false
    id: string
    type: 'orbit' = 'orbit'
    state: Widget_orbit_state
    reset = () => {
        this.state.val.azimuth = this.config.default?.azimuth ?? 0
        this.state.val.elevation = this.config.default?.elevation ?? 0
    }

    get englishSummary(){
        return  mkEnglishSummary(this.state.val.azimuth, this.state.val.elevation)
    }
    get euler(){
        const radius = 5
        const azimuthRad = this.state.val.azimuth * (Math.PI / 180)
        const elevationRad = this.state.val.elevation * (Math.PI / 180)
        const x =radius * Math.cos(elevationRad) * Math.sin(azimuthRad)
        const y =radius * Math.cos(elevationRad) * Math.cos(azimuthRad)
        const z = radius * Math.sin(elevationRad)
        // const cameraPosition =[x,y,z] as const
        return {x:y,y:z,z:-x}
    }
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public config: Widget_orbit_config,
        serial?: Widget_orbit_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.state = serial ?? {
            type:'orbit',
            collapsed: config.startCollapsed,
            active: true,
            val: {
                azimuth: config.default?.azimuth ?? 0,
                elevation: config.default?.elevation ?? 0,
            },
            id: this.id
        }
        makeAutoObservable(this)
    }
    get serial(): Widget_orbit_serial { return this.state }
    get result(): Widget_orbit_output { return {
        azimuth: this.state.val.azimuth,
        elevation: this.state.val.elevation,
        englishSummary: this.englishSummary,
    }}
}

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
    state: Widget_markdown_state

    get markdown() :string{
        const md= this.config.markdown
        if (typeof md === 'string') return md
        return md(this.builder._ROOT)
    }

    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public config: Widget_markdown_config,
        serial?: Widget_markdown_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.state = serial ?? { type:'markdown', collapsed: config.startCollapsed, active: true, id: this.id }
        makeAutoObservable(this)
    }
    get serial(): Widget_markdown_serial { return this.state }
    get result(): Widget_markdown_output { return this.state }
}

// 🅿️ custom ==============================================================================
export type CustomWidgetProps<T> = { widget: Widget_custom<T>; extra: import('./widgets/WidgetCustomUI').UIKit }
export type Widget_custom_config  <T> = WidgetConfigFields<{ defaultValue: () => T; Component: FC<CustomWidgetProps<T>>}>
export type Widget_custom_serial<T> = WidgetSerialFields<{ type: 'custom'; active: true; value: T }>
export type Widget_custom_state <T> = WidgetSerialFields<{ type: 'custom'; active: true; value: T }>
export type Widget_custom_output<T> = T
export interface Widget_custom<T> extends WidgetTypeHelpers_OLD<'custom', Widget_custom_config<T>, Widget_custom_serial<T>, Widget_custom_state<T>, Widget_custom_output<T>> {}
export class Widget_custom<T> implements IWidget_OLD<'custom', Widget_custom_config<T>, Widget_custom_serial<T>, Widget_custom_state<T>, Widget_custom_output<T>> {
    isVerticalByDefault = true
    isCollapsible = true
    id: string
    type: 'custom' = 'custom'
    state: Widget_custom_state<T>
    Component: Widget_custom_config<T>['Component']
    st = () => this.schema.st
    reset = () => (this.state.value = this.config.defaultValue())
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public config: Widget_custom_config<T>,
        serial?: Widget_custom_serial<T>,
    ) {
        this.id = serial?.id ?? nanoid()
        this.Component = config.Component
        this.state = serial ?? {
            type: 'custom',
            active: true,
            id: this.id,
            value: this.config.defaultValue(),
        }

        makeAutoObservable(this, { Component: false })
    }

    /** never mutate this field manually, only access to .state */
    get serial(): Widget_custom_serial<T> { return this.state }

    /** never mutate this field manually, only access to .state */
    get result(): Widget_custom_output<T> { return this.state.value }
}



// 🅿️ prompt ==============================================================================
export type Widget_prompt_config  = WidgetConfigFields<{ default?: string | WidgetPromptOutput }>
export type Widget_prompt_serial = Widget_prompt_state
export type Widget_prompt_state  = WidgetSerialFields<{ type: 'prompt'; active: true; /*text: string;*/ tokens: PossibleSerializedNodes[] }>
export type Widget_prompt_output = { type: 'prompt'; active: true; /*text: string;*/ tokens: PossibleSerializedNodes[] }
export interface Widget_prompt extends WidgetTypeHelpers_OLD<'prompt', Widget_prompt_config, Widget_prompt_serial, Widget_prompt_state, Widget_prompt_output> {}
export class Widget_prompt implements IWidget_OLD<'prompt', Widget_prompt_config, Widget_prompt_serial, Widget_prompt_state, Widget_prompt_output> {
    isVerticalByDefault = true
    isCollapsible = true
    id: string
    type: 'prompt' = 'prompt'
    state: Widget_prompt_state

    // getText = () => {
    //     const tokens = entry.item.tokens

    // }
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public config: Widget_prompt_config,
        serial?: Widget_prompt_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        if (serial) {
            this.state = serial
        } else {
            this.state = {
                type:'prompt',
                collapsed: config.startCollapsed,
                id: this.id,
                active: true,
                tokens: []
            }
            const def = config.default
            if (def != null) {
                if (typeof def === 'string') {
                    this.state.tokens = [{ type: 'text', text: def }]
                }else {
                    this.state.tokens = def.tokens
                }
            }
        }
        makeAutoObservable(this)
    }
    get serial(): Widget_prompt_serial { return this.state } // prettier-ignore
    get result(): Widget_prompt_output {
        JSON.stringify(this.state) // 🔶 force deep observation
        return this.state
    }
}

// 🅿️ promptOpt ==============================================================================
export type Widget_promptOpt_config  = WidgetConfigFields<{ default?: string | WidgetPromptOutput }>
export type Widget_promptOpt_serial = Widget_promptOpt_state // { type: 'promptOpt'; active: boolean; /* text: string;*/ tokens: PossibleSerializedNodes[] }
export type Widget_promptOpt_state  = WidgetSerialFields<{ type: 'promptOpt'; active: boolean; /* text: string;*/ tokens: PossibleSerializedNodes[] }>
export type Widget_promptOpt_output = Maybe<WidgetPromptOutput>
export interface Widget_promptOpt extends WidgetTypeHelpers_OLD<'promptOpt', Widget_promptOpt_config, Widget_promptOpt_serial, Widget_promptOpt_state, Widget_promptOpt_output> {}
export class Widget_promptOpt implements IWidget_OLD<'promptOpt', Widget_promptOpt_config, Widget_promptOpt_serial, Widget_promptOpt_state, Widget_promptOpt_output> {
    readonly isVerticalByDefault = true
    readonly isCollapsible = true
    readonly id: string
    readonly type: 'promptOpt' = 'promptOpt'
    state: Widget_promptOpt_state
    constructor(
        public readonly builder: FormBuilder,
        public readonly schema: ComfySchemaL,
        public readonly config: Widget_promptOpt_config,
        serial?: Widget_promptOpt_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        if (serial) {
            this.state = serial
        } else {
            this.state = {
                type:'promptOpt',
                collapsed: config.startCollapsed,
                id: this.id,
                active: false,
                tokens: []
            }
            const def = config.default
            if (def != null) {
                if (typeof def === 'string') {
                    this.state.active = true
                    this.state.tokens = [{ type: 'text', text: def }]
                }else {
                    this.state.tokens = def.tokens
                }
            }
        }
        makeAutoObservable(this)
    }
    get serial(): Widget_promptOpt_serial { return this.state }
    get result(): Widget_promptOpt_output {
        if (this.state.active === false) return undefined
        return this.state
    }
}

// 🅿️ seed ==============================================================================
export type Widget_seed_config  = WidgetConfigFields<{ default?: number; defaultMode?: 'randomize' | 'fixed' | 'last', min?: number; max?: number }>
export type Widget_seed_serial = Widget_seed_state
export type Widget_seed_state  = WidgetSerialFields<{ type:'seed', active: true; val: number, mode: 'randomize' | 'fixed' | 'last' }>
export type Widget_seed_output = number
export interface Widget_seed extends WidgetTypeHelpers_OLD<'seed', Widget_seed_config, Widget_seed_serial, Widget_seed_state, Widget_seed_output> {}
export class Widget_seed implements IWidget_OLD<'seed', Widget_seed_config, Widget_seed_serial, Widget_seed_state, Widget_seed_output> {
    isVerticalByDefault = false
    isCollapsible = false
    id: string
    type: 'seed' = 'seed'
    state: Widget_seed_state
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public config: Widget_seed_config,
        serial?: Widget_seed_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.state = serial ?? {
            type: 'seed',
            id: this.id,
            active: true,
            val: config.default ?? 0,
            mode: config.defaultMode ?? 'randomize'
        }
        makeAutoObservable(this)
    }
    get serial(): Widget_seed_serial { return this.state }
    get result(): Widget_seed_output {
        const count = this.builder._cache.count
        return this.state.mode ==='randomize'
            ? Math.floor(Math.random()* 9_999_999)
            : this.state.val
    }
}


// 🅿️ inlineRun ==============================================================================
export type Widget_inlineRun_config  = WidgetConfigFields<{text?: string, kind?: `primary`|`special`|`warning`}>
export type Widget_inlineRun_serial = Widget_inlineRun_state
export type Widget_inlineRun_state  = WidgetSerialFields<{ type:'inlineRun', active: true; val: boolean }>
export type Widget_inlineRun_output = boolean
export interface Widget_inlineRun extends WidgetTypeHelpers_OLD<'inlineRun', Widget_inlineRun_config, Widget_inlineRun_serial, Widget_inlineRun_state, Widget_inlineRun_output> {}
export class Widget_inlineRun implements IWidget_OLD<'inlineRun', Widget_inlineRun_config, Widget_inlineRun_serial, Widget_inlineRun_state, Widget_inlineRun_output> {
    isVerticalByDefault = false
    isCollapsible = false
    id: string
    type: 'inlineRun' = 'inlineRun'
    state: Widget_inlineRun_state
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public config: Widget_inlineRun_config,
        serial?: Widget_inlineRun_serial,
    ) {
        if(config.text){
            config.label = config.label ?? ` `;
        }

        this.id = serial?.id ?? nanoid()
        this.state = serial ?? { type: 'inlineRun', collapsed: config.startCollapsed, id: this.id, active: true, val: false, }
        makeAutoObservable(this)
    }
    get serial(): Widget_inlineRun_serial { return this.state }
    get result(): Widget_inlineRun_output { return this.state.active ? this.state.val : false}
}


// 🅿️ size ==============================================================================
export type Widget_size_config  = WidgetConfigFields<{
    default?: CushySizeByRatio
    min?: number
    max?: number
    step?: number
}>
export type Widget_size_serial = Widget_size_state
export type Widget_size_state  = WidgetSerialFields<CushySize>
export type Widget_size_output = CushySize
export interface Widget_size extends WidgetTypeHelpers_OLD<'size', Widget_size_config, Widget_size_serial, Widget_size_state, Widget_size_output> {}
export class Widget_size implements IWidget_OLD<'size', Widget_size_config, Widget_size_serial, Widget_size_state, Widget_size_output> {
    isVerticalByDefault = true
    isCollapsible = true
    id: string
    type: 'size' = 'size'
    state: Widget_size_state
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public config: Widget_size_config,
        serial?: Widget_size_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        if (serial) {
            this.state = serial
        } else {
            const aspectRatio: AspectRatio = config.default?.aspectRatio ?? '1:1'
            const modelType: SDModelType = config.default?.modelType ?? 'SD1.5 512'
            const width = 512 // 🔴
            const height = 512 // 🔴
            this.state = {
                type: 'size',
                id: this.id,
                aspectRatio,
                modelType,
                height,
                width,
            }
        }
        makeAutoObservable(this)
    }
    get serial(): Widget_size_serial { return this.state }
    get result(): Widget_size_output {
        return this.state
    }
}

// 🅿️ matrix ==============================================================================
export type Widget_matrix_cell = {
    x: number
    y: number
    row: string
    col: string
    value: boolean
}
export type Widget_matrix_config  = WidgetConfigFields<{ default?: { row: string; col: string }[]; rows: string[]; cols: string[] }>
export type Widget_matrix_serial = Widget_matrix_state
export type Widget_matrix_state  = WidgetSerialFields<{ type: 'matrix', active: true; selected: Widget_matrix_cell[] }>
export type Widget_matrix_output = Widget_matrix_cell[]
export interface Widget_matrix extends WidgetTypeHelpers_OLD<'matrix', Widget_matrix_config, Widget_matrix_serial, Widget_matrix_state, Widget_matrix_output> {}
export class Widget_matrix implements IWidget_OLD<'matrix', Widget_matrix_config, Widget_matrix_serial, Widget_matrix_state, Widget_matrix_output> {
    isVerticalByDefault = true
    isCollapsible = true
    id: string
    type: 'matrix' = 'matrix'
    state: Widget_matrix_state
    rows: string[]
    cols: string[]
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public config: Widget_matrix_config,
        serial?: Widget_matrix_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.state = serial ?? { type:'matrix', collapsed: config.startCollapsed, id: this.id, active: true, selected: [] }
        const rows = config.rows
        const cols = config.cols
        // init all cells to false
        for (const [rowIx, row] of rows.entries()) {
            for (const [colIx, col] of cols.entries()) {
                this.store.set(this.key(row, col), { x: rowIx, y: colIx, col, row, value: false })
            }
        }
        // apply default value
        const values = this.state.selected
        if (values)
            for (const v of values) {
                this.store.set(this.key(rows[v.x], cols[v.y]), v)
            }
        this.rows = config.rows
        this.cols = config.cols
        // make observable
        makeAutoObservable(this)
    }
    get serial(): Widget_matrix_serial { return this.state }
    get result(): Widget_matrix_output {
        // if (!this.state.active) return undefined
        return this.state.selected
    }

    // (((((((((((((((((((((((((((((
    private sep = ' &&& '
    private store = new Map<string, Widget_matrix_cell>()
    private key = (row: string, col: string) => `${row}${this.sep}${col}`
    get allCells() { return Array.from(this.store.values()) } // prettier-ignore
    UPDATE = () => (this.state.selected = this.RESULT)
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
    // )))))))))))))))))))))))))))))
}

// 🅿️ loras ==============================================================================
export type Widget_loras_config  = WidgetConfigFields<{ default?: SimplifiedLoraDef[] }>
export type Widget_loras_serial = Widget_loras_state
export type Widget_loras_state  = WidgetSerialFields<{ type: 'loras', active: true; loras: SimplifiedLoraDef[] }>
export type Widget_loras_output = SimplifiedLoraDef[]
export interface Widget_loras extends WidgetTypeHelpers_OLD<'loras', Widget_loras_config, Widget_loras_serial, Widget_loras_state, Widget_loras_output> {}
export class Widget_loras implements IWidget_OLD<'loras', Widget_loras_config, Widget_loras_serial, Widget_loras_state, Widget_loras_output> {
    isVerticalByDefault = true
    isCollapsible = true
    id: string
    type: 'loras' = 'loras'
    state: Widget_loras_state
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public config: Widget_loras_config,
        serial?: Widget_loras_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.state = serial ?? { type: 'loras', collapsed: config.startCollapsed, id: this.id, active: true, loras: config.default ?? [] }
        this.allLoras = schema.getLoras()
        for (const lora of this.allLoras) {
            if (lora === 'None') continue
            this._insertLora(lora)
        }
        for (const v of this.state.loras) this.selectedLoras.set(v.name, v)
        makeAutoObservable(this)
    }
    get serial(): Widget_loras_serial { return this.state }
    get result(): Widget_loras_output {
        return this.state.loras
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

// 🅿️ image ==============================================================================
export type Widget_image_config  = WidgetConfigFields<{
    defaultActive?: boolean
    suggestionWhere?: SQLWhere<MediaImageT>
    assetSuggested?: RelativePath
}>
export type Widget_image_serial = Widget_image_state
export type Widget_image_state  = WidgetSerialFields<ImageAnswerForm<'image', true>>
export type Widget_image_output = ImageAnswer
export interface Widget_image extends WidgetTypeHelpers_OLD<'image', Widget_image_config, Widget_image_serial, Widget_image_state, Widget_image_output> {}
export class Widget_image implements IWidget_OLD<'image', Widget_image_config, Widget_image_serial, Widget_image_state, Widget_image_output> {
    isVerticalByDefault = true
    isCollapsible = true
    id: string
    type: 'image' = 'image'
    state: Widget_image_state
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public config: Widget_image_config,
        serial?: Widget_image_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.state = serial ?? {
            type: 'image',
            id: this.id,
            active: true,
            imageID: this.schema.st.defaultImage.id,
        }
        makeAutoObservable(this)
    }
    get serial(): Widget_image_serial { return this.state }
    get result(): Widget_image_output {
        return { imageID: this.state.imageID ?? this.schema.st.defaultImage.id }
    }
}

// 🅿️ imageOpt ==============================================================================
export type Widget_imageOpt_config  = Widget_image_config // same as image
export type Widget_imageOpt_serial = Widget_imageOpt_state
export type Widget_imageOpt_state  = WidgetSerialFields<ImageAnswerForm<'imageOpt', boolean>>
export type Widget_imageOpt_output = Maybe<ImageAnswer>
export interface Widget_imageOpt extends WidgetTypeHelpers_OLD<'imageOpt', Widget_imageOpt_config, Widget_imageOpt_serial, Widget_imageOpt_state, Widget_imageOpt_output> {}
export class Widget_imageOpt implements IWidget_OLD<'imageOpt', Widget_imageOpt_config, Widget_imageOpt_serial, Widget_imageOpt_state, Widget_imageOpt_output> {
    readonly isVerticalByDefault = false
    readonly isCollapsible = false
    readonly id: string
    readonly type: 'imageOpt' = 'imageOpt'
    state: Widget_imageOpt_state
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public config: Widget_imageOpt_config,
        serial?: Widget_imageOpt_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.state = serial ?? {
            type: 'imageOpt',
            collapsed: config.startCollapsed,
            id: this.id,
            active: config.defaultActive ?? false,
            imageID: this.schema.st.defaultImage.id,
        }
        makeAutoObservable(this)
    }
    get serial(): Widget_imageOpt_serial { return this.state }
    get result(): Widget_imageOpt_output {
        return { imageID: this.state.imageID ?? this.schema.st.defaultImage.id }

    }
}

// 🅿️ selectOne ==============================================================================
export type BaseSelectEntry = { id: string, label?: string }
export type Widget_selectOne_config <T extends BaseSelectEntry>  = WidgetConfigFields<{ default?: T; choices: T[] | ((formRoot:Maybe<Widget_group<any>>) => T[]) }>
export type Widget_selectOne_serial<T extends BaseSelectEntry> = Widget_selectOne_state<T>
export type Widget_selectOne_state <T extends BaseSelectEntry>  = WidgetSerialFields<{ type:'selectOne', query: string; val: T }>
export type Widget_selectOne_output<T extends BaseSelectEntry> = T
export interface Widget_selectOne<T>  extends WidgetTypeHelpers_OLD<'selectOne', Widget_selectOne_config<T>, Widget_selectOne_serial<T>, Widget_selectOne_state<T>, Widget_selectOne_output<T>> {}
export class Widget_selectOne<T extends BaseSelectEntry> implements IWidget_OLD<'selectOne', Widget_selectOne_config<T>, Widget_selectOne_serial<T>, Widget_selectOne_state<T>, Widget_selectOne_output<T>> {
    isVerticalByDefault = false
    isCollapsible = false
    id: string
    type: 'selectOne' = 'selectOne'
    state: Widget_selectOne_state<T>

    get choices():T[]{
        const _choices = this.config.choices
        return typeof _choices === 'function' //
            ? _choices(this.builder._ROOT)
            : _choices
    }
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public config: Widget_selectOne_config<T>,
        serial?: Widget_selectOne_serial<T>,
    ) {
        this.id = serial?.id ?? nanoid()
        const choices = this.choices
        this.state = serial ?? {
            type: 'selectOne',
            collapsed: config.startCollapsed,
            id: this.id,
            query: '',
            val: config.default ?? choices[0],
        }
        makeAutoObservable(this)
    }
    get serial(): Widget_selectOne_serial<T> { return this.state }
    get result(): Widget_selectOne_output<T> { return this.state.val }
}


// 🅿️ selectMany ==============================================================================
export type Widget_selectMany_config<T extends BaseSelectEntry>  = WidgetConfigFields<{ default?: T[]; choices: T[] | ((formRoot:Maybe<Widget_group<any>>) => T[]) }>
export type Widget_selectMany_serial<T extends BaseSelectEntry> = Widget_selectMany_state<T>
export type Widget_selectMany_state<T extends BaseSelectEntry>  = WidgetSerialFields<{ type: 'selectMany', query: string; values: T[] }>
export type Widget_selectMany_output<T extends BaseSelectEntry> = T[]
export interface Widget_selectMany<T extends BaseSelectEntry> extends WidgetTypeHelpers_OLD<'selectMany', Widget_selectMany_config<T>, Widget_selectMany_serial<T>, Widget_selectMany_state<T>, Widget_selectMany_output<T>> {}
export class Widget_selectMany<T extends BaseSelectEntry> implements IWidget_OLD<'selectMany', Widget_selectMany_config<T>, Widget_selectMany_serial<T>, Widget_selectMany_state<T>, Widget_selectMany_output<T>> {
    isVerticalByDefault = false
    isCollapsible = false
    id: string
    type: 'selectMany' = 'selectMany'
    state: Widget_selectMany_state<T>
    get choices():T[]{
        const _choices = this.config.choices
        return typeof _choices === 'function' //
            ? _choices(this.builder._ROOT)
            : _choices
    }
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public config: Widget_selectMany_config<T>,
        serial?: Widget_selectMany_serial<T>,
    ) {
        this.id = serial?.id ?? nanoid()
        if (serial) {
            this.state = {
                type: 'selectMany',
                collapsed: serial.collapsed,
                id: this.id,
                query: serial.query,
                values: serial.values,
            }
        } else {
            this.state = {
                type: 'selectMany',
                collapsed: config.startCollapsed,
                id: this.id,
                query: '', values: config.default ?? [], }
        }
        makeAutoObservable(this)
    }

    removeItem = (item: T): void => {
        if (this.state.values==null) {this.state.values = []; return} // just in case
        this.state.values = this.state.values.filter((v) => v.id !== item.id) // filter just in case of duplicate
    }
    addItem = (item: T): void => {
        if (this.state.values==null) {this.state.values = [item]; return} // just in case
        const i = this.state.values.indexOf(item)
        if (i < 0) this.state.values.push(item)
    }
    toggleItem = (item: T): void => {
        if (this.state.values==null) {this.state.values = [item]; return} // just in case
        const i = this.state.values.indexOf(item)
        if (i < 0) this.state.values.push(item)
        else this.state.values = this.state.values.filter((v) => v.id !== item.id) // filter just in case of duplicate
    }
    get serial(): Widget_selectMany_serial<T> {
        return this.state //{ type: 'selectMany', id: this.id, query: this.state.query, values: values_ }
    }
    get result(): Widget_selectMany_output<T> {
        return this.state.values
    }
}


// 🅿️ list ==============================================================================
export type Widget_list_config<T extends Widget>  = WidgetConfigFields<{
    element: (ix:number) => T,
    min?: number,
    max?:number,
    defaultLength?:number
}>
export type Widget_list_serial<T extends Widget> = WidgetSerialFields<{ type: 'list', active: true; items_: T['$Serial'][] }>
export type Widget_list_state<T extends Widget>  = WidgetSerialFields<{ type: 'list', active: true; items: T[] }>
export type Widget_list_output<T extends Widget> = T['$Output'][]
export interface Widget_list<T extends Widget> extends WidgetTypeHelpers_OLD<'list', Widget_list_config<T>, Widget_list_serial<T>, Widget_list_state<T>, Widget_list_output<T>> {}
export class Widget_list<T extends Widget> implements IWidget_OLD<'list', Widget_list_config<T>, Widget_list_serial<T>, Widget_list_state<T>, Widget_list_output<T>> {
    isVerticalByDefault = true
    isCollapsible = true
    id: string
    type: 'list' = 'list'
    state: Widget_list_state<T>
    private _reference: T

    get items(): T[] { return this.state.items }
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public config: Widget_list_config<T>,
        serial?: Widget_list_serial<T>,
    ) {
        this.id = serial?.id ?? nanoid()
        this._reference = runWithGlobalForm(this.builder, () => config.element(0))
        if (serial) {
            const items = serial.items_.map((sub_) => builder._HYDRATE(sub_.type, this._reference.config, sub_)) // 🔴 handler filter if wrong type
            this.state = { type: 'list', id: this.id, active: serial.active, items }
        } else {
            const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)
            const defaultLen = clamp(config.defaultLength ?? 0, config.min ?? 0, config.max ?? 10)
            const items = defaultLen
                ? runWithGlobalForm(this.builder, () => new Array(defaultLen).fill(0).map((_,ix) => config.element(ix)))
                : []
            this.state = {
                type: 'list',
                id: this.id,
                active: true,
                items: items,
            }
        }
        makeAutoObservable(this)
    }
    removemAllItems = () => this.state.items = this.state.items.slice(0, this.config.min ?? 0)
    collapseAllItems = () => this.state.items.forEach((i) => i.serial.collapsed = true)
    expandAllItems = () => this.state.items.forEach((i) => i.serial.collapsed = false)
    removeItem = (item: T) => {
        const i = this.state.items.indexOf(item)
        if (i >= 0) this.state.items.splice(i, 1)
    }
    moveItem = (oldIndex: number, newIndex: number) => {
        const favs = this.state.items
        if (favs == null) return
        favs.splice(newIndex, 0, favs.splice(oldIndex, 1)[0])
    }
    get serial(): Widget_list_serial<T> {
        const items_ = this.state.items.map((i) => i.serial)
        return { type: 'list', id: this.id, active: this.state.active, items_ }
    }
    get result(): Widget_list_output<T> { return this.state.items.map((i) => i.result) }
    addItem() {
        // const _ref = this._reference
        // const newItem = this.builder.HYDRATE(_ref.type, _ref.input)
        this.state.items.push(this.config.element(this.state.items.length))
    }
}


// 🅿️ listExt ==============================================================================
export type RootExt = {
    // size
    width: number,
    height: number,
    depth?: number

    // color
    fill?: string;
}

export type ItemExt = {
    // pos
    x: number;
    y: number;
    z: number;
    // size
    width: number;
    height: number;
    depth: number;

    // scale
    scaleX?:number;
    scaleY?:number;
    scaleZ?:number;

    // color
    fill?: string;

    // rotation
    rotation?: number;

    // interraction
    isSelected?: boolean;
    isDragging?: boolean;
    isResizing?: boolean;
}
const itemExtDefaults : ItemExt = {x: 50, y: 50, z: 0, width: 50, height: 50, depth: 0 }

type WithExt <T extends Widget> = { item:  T } & ItemExt
type WithPartialExt <T extends Widget> = { item:  T } & Partial<ItemExt>

export type Widget_listExt_config<T extends Widget>  = WidgetConfigFields<{
    mode?: 'regional' | 'timeline',
    /** default: 100 */
    width: number,
    /** default: 100 */
    height: number,
    element: (size: {ix:number, width:number, height:number}) => WithPartialExt<T>,
    min?: number,
    max?:number,
    defaultLength?:number
}>
export type Widget_listExt_serial<T extends Widget> = WidgetSerialFields<{ type: 'listExt', active: true; items_: ({item_: T['$Serial']} & ItemExt)[] } & RootExt>
export type Widget_listExt_state <T extends Widget> = WidgetSerialFields<{ type: 'listExt', active: true; items:  ({item:  T           } & ItemExt)[] } & RootExt>
export type Widget_listExt_output<T extends Widget> = RootExt & { items: (ItemExt & {item: T['$Output'] })[] }
export interface Widget_listExt  <T extends Widget> extends     WidgetTypeHelpers_OLD<'listExt', Widget_listExt_config<T>, Widget_listExt_serial<T>, Widget_listExt_state<T>, Widget_listExt_output<T>> {}
export class Widget_listExt      <T extends Widget> implements IWidget_OLD<'listExt', Widget_listExt_config<T>, Widget_listExt_serial<T>, Widget_listExt_state<T>, Widget_listExt_output<T>> {
    isVerticalByDefault = true
    isCollapsible = true
    id: string
    type: 'listExt' = 'listExt'
    state: Widget_listExt_state<T>
    private _reference: T

    get items(): WithExt<T>[] { return this.state.items }
    // INIT -----------------------------------------------------------------------------
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public config: Widget_listExt_config<T>,
        serial?: Widget_listExt_serial<T>,
    ) {
        this.id = serial?.id ?? nanoid()
        this._reference = runWithGlobalForm(this.builder, () => config.element({width:100, height:100, ix: 0}).item)
        if (serial) {
            const items:  WithExt<T>[] = serial.items_.map(({item_, ...ext}) => {
                const item:T = builder._HYDRATE(item_.type, this._reference.config, item_)
                return {item, ...ext}
            })
            this.state = { type: 'listExt', id: this.id, active: serial.active, items, width: serial.width, height: serial.height }
        } else {
            const w = config.width ?? 100
            const h = config.height ?? 100
            const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)
            const defaultLen = clamp(config.defaultLength ?? 0, config.min ?? 0, config.max ?? 10)
            const items: WithExt<T>[] = defaultLen
                ? new Array(defaultLen).fill(0).map((_,ix) => {
                    const partial: WithPartialExt<T> = config.element({width: w, height: h, ix})
                    const out : WithExt<T> = Object.assign({}, itemExtDefaults, partial)
                    return out
                })
                : []
            this.state = { type: 'listExt', id: this.id, active: true, items: items, width: w, height: h, }
        }
        makeAutoObservable(this)
    }

    // METHODS -----------------------------------------------------------------------------
    addItem() {
        const newItemPartial = runWithGlobalForm(this.builder, () => this.config.element({width: this.state.width, height: this.state.height, ix: this.state.items.length}))
        const newItem: WithExt<T> = { ...itemExtDefaults, ...newItemPartial}
        this.state.items.push(newItem)
    }
    removemAllItems = () => this.state.items = this.state.items.slice(0, this.config.min ?? 0)
    collapseAllItems = () => this.state.items.forEach((i) => i.item.serial.collapsed = true)
    expandAllItems = () => this.state.items.forEach((i) => i.item.serial.collapsed = false)
    removeItem = (item: WithExt<T>) => {
        const i = this.state.items.indexOf(item) // 🔴 dangerous, ref equality fast but error prone
        if (i >= 0) this.state.items.splice(i, 1)
    }

    // SERIAL & RESULT ----------------------------------------------------------------------
    get serial(): Widget_listExt_serial<T> {
        const items_ = this.state.items.map((i) => {
            const { item, ...rest } = i
            return {item_: i.item.serial, ...rest }
        })
        return { type: 'listExt', id: this.id, active: this.state.active, items_, width: this.state.width, height: this.state.height }
    }
    get result(): Widget_listExt_output<T> {
        const items = this.state.items.map((i) => ({...i, item: i.item.result }))
        return {
            items: items,
            width: this.state.width,
            height: this.state.width,
        }
    }
}

// 🅿️ enum ==============================================================================
export type Widget_enum_config<T extends KnownEnumNames>  = WidgetConfigFields<{ default?: Requirable[T] | EnumDefault<T>; enumName: T }>
export type Widget_enum_serial<T extends KnownEnumNames> = Widget_enum_state<T>
export type Widget_enum_state<T extends KnownEnumNames>  = WidgetSerialFields<{ type: 'enum', active: true; val: Requirable[T] }>
export type Widget_enum_output<T extends KnownEnumNames> = Requirable[T]
export interface Widget_enum<T extends KnownEnumNames> extends WidgetTypeHelpers_OLD<'enum', Widget_enum_config<T>, Widget_enum_serial<T>, Widget_enum_state<T>, Widget_enum_output<T>> {}
export class Widget_enum<T extends KnownEnumNames> implements IWidget_OLD<'enum', Widget_enum_config<T>, Widget_enum_serial<T>, Widget_enum_state<T>, Widget_enum_output<T>> {
    isVerticalByDefault = false
    isCollapsible = false
    id: string
    type: 'enum' = 'enum'
    state: Widget_enum_state<T>
    get possibleValues() {return  this.schema.knownEnumsByName.get(this.config.enumName)?.values ?? []}
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public config: Widget_enum_config<T>,
        serial?: Widget_enum_serial<T>,
    ) {
        this.id = serial?.id ?? nanoid()
        this.state = serial ?? {
            type: 'enum',
            id: this.id,
            active: true,
            val: extractDefaultValue(config) ?? (this.possibleValues[0] as any)
        }
        makeAutoObservable(this)
    }
    get status(): CleanedEnumResult<any> { return this.schema.st.fixEnumValue(this.state.val as any, this.config.enumName, false) } // prettier-ignore
    get serial(): Widget_enum_serial<T> { return this.state }
    get result(): Widget_enum_output<T> { return this.status.finalValue }
}

// 🅿️ enumOpt ==============================================================================
export type Widget_enumOpt_config<T extends KnownEnumNames>  = WidgetConfigFields<{ default?: Requirable[T]; enumName: T }>
export type Widget_enumOpt_serial<T extends KnownEnumNames> = Widget_enumOpt_state<T>
export type Widget_enumOpt_state<T extends KnownEnumNames>  = WidgetSerialFields<{ type: 'enumOpt', active: boolean; val: Requirable[T] }>
export type Widget_enumOpt_output<T extends KnownEnumNames> = Maybe<Requirable[T]>
export interface Widget_enumOpt<T extends KnownEnumNames> extends WidgetTypeHelpers_OLD<'enumOpt', Widget_enumOpt_config<T>, Widget_enumOpt_serial<T>, Widget_enumOpt_state<T>, Widget_enumOpt_output<T>> {}
export class Widget_enumOpt<T extends KnownEnumNames> implements IWidget_OLD<'enumOpt', Widget_enumOpt_config<T>, Widget_enumOpt_serial<T>, Widget_enumOpt_state<T>, Widget_enumOpt_output<T>> {
    isVerticalByDefault = false
    isCollapsible = false
    id: string
    type: 'enumOpt' = 'enumOpt'
    state: Widget_enumOpt_state<T>
    get possibleValues() {return  this.schema.knownEnumsByName.get(this.config.enumName)?.values ?? []}
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public config: Widget_enumOpt_config<T>,
        serial?: Widget_enumOpt_serial<T>,
    ) {
        this.id = serial?.id ?? nanoid()
        this.state = serial ?? {
            type: 'enumOpt',
            id: this.id,
            active: config.default != null,
            val: config.default ?? (this.possibleValues[0] as any) /* 🔴 */,
        }
        makeAutoObservable(this)
    }
    get status(): CleanedEnumResult<any> { return this.schema.st.fixEnumValue(this.state.val as any, this.config.enumName, true) } // prettier-ignore
    get serial(): Widget_enumOpt_serial<T> { return this.state }
    get result(): Widget_enumOpt_output<T> {
        if (!this.state.active) return undefined
        return this.status.finalValue
    }
}



WidgetDI.Widget_str                = Widget_str
WidgetDI.Widget_prompt             = Widget_prompt
WidgetDI.Widget_promptOpt          = Widget_promptOpt
WidgetDI.Widget_seed               = Widget_seed

WidgetDI.Widget_bool               = Widget_bool
WidgetDI.Widget_inlineRun          = Widget_inlineRun
WidgetDI.Widget_markdown           = Widget_markdown
WidgetDI.Widget_custom             = Widget_custom
WidgetDI.Widget_size               = Widget_size
WidgetDI.Widget_matrix             = Widget_matrix
WidgetDI.Widget_loras              = Widget_loras
WidgetDI.Widget_image              = Widget_image
WidgetDI.Widget_imageOpt           = Widget_imageOpt
WidgetDI.Widget_selectMany         = Widget_selectMany
WidgetDI.Widget_selectOne          = Widget_selectOne
WidgetDI.Widget_list               = Widget_list
WidgetDI.Widget_group           = Widget_group
WidgetDI.Widget_choices            = Widget_choices
WidgetDI.Widget_enum               = Widget_enum
WidgetDI.Widget_enumOpt            = Widget_enumOpt
WidgetDI.Widget_listExt            = Widget_listExt
WidgetDI.Widget_orbit              = Widget_orbit
