/**
 * this file is an attempt to centralize core widget definition in a single
 * file so it's easy to add any widget in the future
 */
import type { ItemDataType } from 'src/rsuite/shims'
import type { CELL } from 'src/controls/widgets/WidgetMatrixUI'
import type { SchemaL } from 'src/models/Schema'
import type { SimplifiedLoraDef } from 'src/presets/SimplifiedLoraDef'
import type { WidgetPromptOutput } from 'src/widgets/prompter/WidgetPromptUI'
import type { PossibleSerializedNodes } from 'src/widgets/prompter/plugins/CushyDebugPlugin'
import type { AspectRatio, ComfyImageAnswer, CushyImageAnswer, CushySize, CushySizeByRatio, ImageAnswer, ImageAnswerForm, PaintImageAnswer, SDModelType } from './misc/InfoAnswer'

import { makeAutoObservable } from 'mobx'
import { bang } from 'src/utils/misc/bang'
import { FormBuilder } from './FormBuilder'
import { IRequest, IWidget, ReqInput, ReqResult, StateFields } from './IWidget'
import { nanoid } from 'nanoid'
import { CleanedEnumResult } from 'src/types/EnumUtils'
import { RelativePath } from 'src/utils/fs/BrandedPaths'

// Widget is a closed union for added type safety
export type Widget =
    | Widget_color
    | Widget_str
    | Widget_strOpt
    | Widget_prompt
    | Widget_promptOpt
    | Widget_seed
    | Widget_int
    | Widget_float
    | Widget_bool
    | Widget_intOpt
    | Widget_floatOpt
    | Widget_markdown
    | Widget_size
    | Widget_matrix
    | Widget_loras
    | Widget_image
    | Widget_imageOpt
    | Widget_selectOneOrCustom
    | Widget_selectMany<any>
    | Widget_selectManyOrCustom
    | Widget_selectOne<any>
    | Widget_list<any>
    | Widget_group<any>
    | Widget_groupOpt<any>
    | Widget_choice<any>
    | Widget_choices<any>
    | Widget_enum<any>
    | Widget_enumOpt<any>

// 🅿️ str ==============================================================================
export type Widget_str_input  = ReqInput<{ default?: string; textarea?: boolean, placeHolder?:string }>
export type Widget_str_serial = StateFields<{ type: 'str', active: true; val: string }>
export type Widget_str_state  = StateFields<{ type: 'str', active: true; val: string }>
export type Widget_str_output = string
export interface Widget_str extends IWidget<'str', Widget_str_input, Widget_str_serial, Widget_str_state, Widget_str_output> {}
export class Widget_str implements IRequest<'str', Widget_str_input, Widget_str_serial, Widget_str_state, Widget_str_output> {
    isOptional = false
    id: string
    type = 'str' as const
    state: Widget_str_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_str_input,
        serial?: Widget_str_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.state = serial ?? { type:'str', active: true, val: input.default ?? '', id: this.id }
        makeAutoObservable(this)
    }
    get serial(): Widget_str_serial { return this.state }
    get result(): Widget_str_output { return this.state.val }
}

// 🅿️ markdown ==============================================================================
export type Widget_markdown_input = ReqInput<{ markdown: string | ((formRoot:Widget_group<any>) => string); }>
export type Widget_markdown_serial = StateFields<{ type: 'markdown', active: true }>
export type Widget_markdown_state  = StateFields<{ type: 'markdown', active: true }>
export type Widget_markdown_output = { type: 'markdown', active: true }
export interface Widget_markdown extends IWidget<'markdown', Widget_markdown_input, Widget_markdown_serial, Widget_markdown_state, Widget_markdown_output> {}
export class Widget_markdown implements IRequest<'markdown', Widget_markdown_input, Widget_markdown_serial, Widget_markdown_state, Widget_markdown_output> {
    isOptional = false
    id: string
    type = 'markdown' as const
    state: Widget_markdown_state

    get markdown() :string{
        const md= this.input.markdown
        if (typeof md === 'string') return md
        return md(this.builder.ROOT)
    }

    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_markdown_input,
        serial?: Widget_markdown_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.state = serial ?? { type:'markdown', active: true, id: this.id }
        makeAutoObservable(this)
    }
    get serial(): Widget_markdown_serial { return this.state }
    get result(): Widget_markdown_output { return this.state }
}

// 🅿️ str ==============================================================================
export type Widget_color_input = ReqInput<{ default?: string; }>
export type Widget_color_serial = StateFields<{ type: 'color', active: true; val: string }>
export type Widget_color_state  = StateFields<{ type: 'color', active: true; val: string }>
export type Widget_color_output = string
export interface Widget_color extends IWidget<'color', Widget_color_input, Widget_color_serial, Widget_color_state, Widget_color_output> {}
export class Widget_color implements IRequest<'color', Widget_color_input, Widget_color_serial, Widget_color_state, Widget_color_output> {
    isOptional = false
    id: string
    type = 'color' as const
    state: Widget_color_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_color_input,
        serial?: Widget_color_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.state = serial ?? { type:'color', id: this.id,  active: true, val: input.default ?? '' }
        makeAutoObservable(this)
    }
    get serial(): Widget_color_serial { return this.state }
    get result(): Widget_color_output { return this.state.val }
}

// 🅿️ strOpt ==============================================================================
export type Widget_strOpt_input  = Widget_str_input
export type Widget_strOpt_serial = Widget_strOpt_state
export type Widget_strOpt_state  = StateFields<{ type:'strOpt', active: boolean; val: string }>
export type Widget_strOpt_output = Maybe<string>
export interface Widget_strOpt extends IWidget<'strOpt', Widget_strOpt_input, Widget_strOpt_serial, Widget_strOpt_state, Widget_strOpt_output> {}
export class Widget_strOpt implements IRequest<'strOpt', Widget_strOpt_input, Widget_strOpt_serial, Widget_strOpt_state, Widget_strOpt_output> {
    isOptional = true
    id: string
    type = 'strOpt' as const
    state: Widget_strOpt_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_strOpt_input,
        serial?: Widget_strOpt_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.state = serial ?? {
            type: 'strOpt',
            id: this.id,
            active: input.default != null,
            val: input.default ?? '',
        }
        makeAutoObservable(this)
    }
    get serial(){ return this.state }
    get result(): Widget_strOpt_output {
        if (!this.state.active) return undefined
        return this.state.val
    }
}

// 🅿️ prompt ==============================================================================
export type Widget_prompt_input  = ReqInput<{ default?: string | WidgetPromptOutput }>
export type Widget_prompt_serial = Widget_prompt_state
export type Widget_prompt_state  = StateFields<{ type: 'prompt'; active: true; /*text: string;*/ tokens: PossibleSerializedNodes[] }>
export type Widget_prompt_output = { type: 'prompt'; active: true; /*text: string;*/ tokens: PossibleSerializedNodes[] }
export interface Widget_prompt extends IWidget<'prompt', Widget_prompt_input, Widget_prompt_serial, Widget_prompt_state, Widget_prompt_output> {}
export class Widget_prompt implements IRequest<'prompt', Widget_prompt_input, Widget_prompt_serial, Widget_prompt_state, Widget_prompt_output> {
    isOptional = false
    id: string
    type = 'prompt' as const
    state: Widget_prompt_state

    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_prompt_input,
        serial?: Widget_prompt_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        if (serial) {
            this.state = serial
        } else {
            this.state = { type:'prompt', id: this.id, active: true, /*text: '',*/ tokens: [] }

            const def = input.default
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
export type Widget_promptOpt_input  = ReqInput<{ default?: string | WidgetPromptOutput }>
export type Widget_promptOpt_serial = Widget_promptOpt_state // { type: 'promptOpt'; active: boolean; /* text: string;*/ tokens: PossibleSerializedNodes[] }
export type Widget_promptOpt_state  = StateFields<{ type: 'promptOpt'; active: boolean; /* text: string;*/ tokens: PossibleSerializedNodes[] }>
export type Widget_promptOpt_output = Maybe<WidgetPromptOutput>
export interface Widget_promptOpt extends IWidget<'promptOpt', Widget_promptOpt_input, Widget_promptOpt_serial, Widget_promptOpt_state, Widget_promptOpt_output> {}
export class Widget_promptOpt implements IRequest<'promptOpt', Widget_promptOpt_input, Widget_promptOpt_serial, Widget_promptOpt_state, Widget_promptOpt_output> {
    isOptional = true
    id: string
    type = 'promptOpt' as const
    state: Widget_promptOpt_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_promptOpt_input,
        serial?: Widget_promptOpt_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        if (serial) {
            this.state = serial
        } else {
            this.state = { type:'promptOpt', id: this.id, active: false, /*text: '',*/ tokens: [] }
            const def = input.default
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
export type Widget_seed_input  = ReqInput<{ default?: number; defaultMode?: 'randomize' | 'fixed' | 'last', min?: number; max?: number }>
export type Widget_seed_serial = Widget_seed_state
export type Widget_seed_state  = StateFields<{ type:'seed', active: true; val: number, mode: 'randomize' | 'fixed' | 'last' }>
export type Widget_seed_output = number
export interface Widget_seed extends IWidget<'seed', Widget_seed_input, Widget_seed_serial, Widget_seed_state, Widget_seed_output> {}
export class Widget_seed implements IRequest<'seed', Widget_seed_input, Widget_seed_serial, Widget_seed_state, Widget_seed_output> {
    isOptional = false
    id: string
    type = 'seed' as const
    state: Widget_seed_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_seed_input,
        serial?: Widget_seed_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.state = serial ?? {
            type: 'seed',
            id: this.id,
            active: true,
            val: input.default ?? 0,
            mode: input.defaultMode ?? 'randomize'
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

// 🅿️ int ==============================================================================
export type Widget_int_input  = ReqInput<{ default?: number; min?: number; max?: number, step?: number, hideSlider?: boolean }>
export type Widget_int_serial = Widget_int_state
export type Widget_int_state  = StateFields<{ type:'int', active: true; val: number }>
export type Widget_int_output = number
export interface Widget_int extends IWidget<'int', Widget_int_input, Widget_int_serial, Widget_int_state, Widget_int_output> {}
export class Widget_int implements IRequest<'int', Widget_int_input, Widget_int_serial, Widget_int_state, Widget_int_output> {
    isOptional = false
    id: string
    type = 'int' as const
    state: Widget_int_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_int_input,
        serial?: Widget_int_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.state = serial ?? { type: 'int', id: this.id, active: true, val: input.default ?? 0 }
        makeAutoObservable(this)
    }
    get serial(): Widget_int_serial { return this.state }
    get result(): Widget_int_output { return this.state.val }
}

// 🅿️ float ==============================================================================
export type Widget_float_input  = ReqInput<{ default?: number; min?: number; max?: number, step?: number, hideSlider?: boolean }>
export type Widget_float_serial = Widget_float_state
export type Widget_float_state  = StateFields<{ type:'float', active: true; val: number }>
export type Widget_float_output = number
export interface Widget_float extends IWidget<'float', Widget_float_input, Widget_float_serial, Widget_float_state, Widget_float_output> {}
export class Widget_float implements IRequest<'float', Widget_float_input, Widget_float_serial, Widget_float_state, Widget_float_output> {
    isOptional = false
    id: string
    type = 'float' as const
    state: Widget_float_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_float_input,
        serial?: Widget_float_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.state = serial ?? { type:'float', id: this.id, active: true, val: input.default ?? 0 }
        makeAutoObservable(this)
    }
    get serial(): Widget_float_serial { return this.state }
    get result(): Widget_float_output { return this.state.val }
}

// 🅿️ bool ==============================================================================
export type Widget_bool_input  = ReqInput<{ default?: boolean }>
export type Widget_bool_serial = Widget_bool_state
export type Widget_bool_state  = StateFields<{ type:'bool', active: true; val: boolean }>
export type Widget_bool_output = boolean
export interface Widget_bool extends IWidget<'bool', Widget_bool_input, Widget_bool_serial, Widget_bool_state, Widget_bool_output> {}
export class Widget_bool implements IRequest<'bool', Widget_bool_input, Widget_bool_serial, Widget_bool_state, Widget_bool_output> {
    isOptional = true
    id: string
    type = 'bool' as const
    state: Widget_bool_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_bool_input,
        serial?: Widget_bool_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.state = serial ?? { type: 'bool', id: this.id, active: true, val: input.default ?? false }
        makeAutoObservable(this)
    }
    get serial(): Widget_bool_serial { return this.state }
    get result(): Widget_bool_output { return this.state.active ? this.state.val : false}
}

// 🅿️ intOpt ==============================================================================
export type Widget_intOpt_input  = ReqInput<{ default?: number; min?: number; max?: number; step?: number, hideSlider?: boolean }>
export type Widget_intOpt_serial = Widget_intOpt_state
export type Widget_intOpt_state  = StateFields<{ type: 'intOpt', active: boolean; val: number }>
export type Widget_intOpt_output = Maybe<number>
export interface Widget_intOpt extends IWidget<'intOpt', Widget_intOpt_input, Widget_intOpt_serial, Widget_intOpt_state, Widget_intOpt_output> {}
export class Widget_intOpt implements IRequest<'intOpt', Widget_intOpt_input, Widget_intOpt_serial, Widget_intOpt_state, Widget_intOpt_output> {
    isOptional = true
    id: string
    type = 'intOpt' as const
    state: Widget_intOpt_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_intOpt_input,
        serial?: Widget_intOpt_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.state = serial ?? {
            type: 'intOpt',
            id: this.id,
            active: input.default != null,
            val: input.default ?? 0,
        }
        makeAutoObservable(this)
    }
    get serial(): Widget_intOpt_serial { return this.state }
    get result(): Widget_intOpt_output {
        if (this.state.active === false) return undefined
        return this.state.val
    }
}

// 🅿️ floatOpt ==============================================================================
export type Widget_floatOpt_input  = ReqInput<{ default?: number; min?: number; max?: number; step?: number, hideSlider?: boolean }>
export type Widget_floatOpt_serial = Widget_floatOpt_state
export type Widget_floatOpt_state  = StateFields<{ type: 'floatOpt', active: boolean; val: number }>
export type Widget_floatOpt_output = Maybe<number>
export interface Widget_floatOpt extends IWidget<'floatOpt', Widget_floatOpt_input, Widget_floatOpt_serial, Widget_floatOpt_state, Widget_floatOpt_output> {}
export class Widget_floatOpt implements IRequest<'floatOpt', Widget_floatOpt_input, Widget_floatOpt_serial, Widget_floatOpt_state, Widget_floatOpt_output> {
    isOptional = true
    id: string
    type = 'floatOpt' as const
    state: Widget_floatOpt_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_floatOpt_input,
        serial?: Widget_floatOpt_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.state = serial ?? {
            type: 'floatOpt',
            id: this.id,
            active: input.default != null,
            val: input.default ?? 0,
        }
        makeAutoObservable(this)
    }
    get serial(): Widget_floatOpt_serial { return this.state }
    get result(): Widget_floatOpt_output {
        if (this.state.active === false) return undefined
        return this.state.val
    }
}

// 🅿️ size ==============================================================================
export type Widget_size_input  = ReqInput<{ default?: CushySizeByRatio }>
export type Widget_size_serial = Widget_size_state
export type Widget_size_state  = StateFields<CushySize>
export type Widget_size_output = CushySize
export interface Widget_size extends IWidget<'size', Widget_size_input, Widget_size_serial, Widget_size_state, Widget_size_output> {}
export class Widget_size implements IRequest<'size', Widget_size_input, Widget_size_serial, Widget_size_state, Widget_size_output> {
    isOptional = false
    id: string
    type = 'size' as const
    state: Widget_size_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_size_input,
        serial?: Widget_size_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        if (serial) {
            this.state = serial
        } else {
            const aspectRatio: AspectRatio = input.default?.aspectRatio ?? '1:1'
            const modelType: SDModelType = input.default?.modelType ?? 'SD1.5 512'
            const width = 512 // 🔴
            const height = 512 // 🔴
            this.state = {
                type: 'size',
                id: this.id,
                aspectRatio,
                modelType,
                height,
                width,
                active: true,
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
export type Widget_matrix_input  = ReqInput<{ default?: { row: string; col: string }[]; rows: string[]; cols: string[] }>
export type Widget_matrix_serial = Widget_matrix_state
export type Widget_matrix_state  = StateFields<{ type: 'matrix', active: true; selected: CELL[] }>
export type Widget_matrix_output = CELL[]
export interface Widget_matrix extends IWidget<'matrix', Widget_matrix_input, Widget_matrix_serial, Widget_matrix_state, Widget_matrix_output> {}
export class Widget_matrix implements IRequest<'matrix', Widget_matrix_input, Widget_matrix_serial, Widget_matrix_state, Widget_matrix_output> {
    isOptional = false
    id: string
    type = 'matrix' as const
    state: Widget_matrix_state
    rows: string[]
    cols: string[]
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_matrix_input,
        serial?: Widget_matrix_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.state = serial ?? { type:'matrix', id: this.id, active: true, selected: [] }
        const rows = input.rows
        const cols = input.cols
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
        this.rows = input.rows
        this.cols = input.cols
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
    private store = new Map<string, CELL>()
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

    get = (row: string, col: string): CELL => {
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
export type Widget_loras_input  = ReqInput<{ default?: SimplifiedLoraDef[] }>
export type Widget_loras_serial = Widget_loras_state
export type Widget_loras_state  = StateFields<{ type: 'loras', active: true; loras: SimplifiedLoraDef[] }>
export type Widget_loras_output = SimplifiedLoraDef[]
export interface Widget_loras extends IWidget<'loras', Widget_loras_input, Widget_loras_serial, Widget_loras_state, Widget_loras_output> {}
export class Widget_loras implements IRequest<'loras', Widget_loras_input, Widget_loras_serial, Widget_loras_state, Widget_loras_output> {
    isOptional = false
    id: string
    type = 'loras' as const
    state: Widget_loras_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_loras_input,
        serial?: Widget_loras_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.state = serial ?? { type: 'loras', id: this.id, active: true, loras: input.default ?? [] }
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
export type Widget_image_input  = ReqInput<{
    default?: 'cushy' | 'comfy' | 'paint',
    defaultComfy?: ComfyImageAnswer,
    defaultCushy?: CushyImageAnswer,
    defaultPaint?: PaintImageAnswer,
    scribbleStrokeColor?: string,
    scribbleFillColor?: string
    assetSuggested?: RelativePath
}>
export type Widget_image_serial = Widget_image_state
export type Widget_image_state  = StateFields<ImageAnswerForm<'image', true>>
export type Widget_image_output = ImageAnswer
export interface Widget_image extends IWidget<'image', Widget_image_input, Widget_image_serial, Widget_image_state, Widget_image_output> {}
export class Widget_image implements IRequest<'image', Widget_image_input, Widget_image_serial, Widget_image_state, Widget_image_output> {
    isOptional = false
    id: string
    type = 'image' as const
    state: Widget_image_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_image_input,
        serial?: Widget_image_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        // console.log('🔴 AAA', serial)
        this.state = serial ?? {
            type: 'image',
            id: this.id,
            active: true,
            comfy: input.defaultComfy ?? { imageName: 'example.png', type: 'ComfyImage' },
            cushy: input.defaultCushy,
            paint: input.defaultPaint,
            pick: input.default ?? 'comfy',
        }
        makeAutoObservable(this)
    }
    get serial(): Widget_image_serial { return this.state }
    get result(): Widget_image_output {
        if (this.state.pick === 'cushy' && this.state.cushy) return this.state.cushy
        if (this.state.pick === 'paint' && this.state.paint) return this.state.paint
        return this.state.comfy
    }
}

// 🅿️ imageOpt ==============================================================================
export type Widget_imageOpt_input  = Widget_image_input // same as image
export type Widget_imageOpt_serial = Widget_imageOpt_state
export type Widget_imageOpt_state  = StateFields<ImageAnswerForm<'imageOpt', boolean>>
export type Widget_imageOpt_output = Maybe<ImageAnswer>
export interface Widget_imageOpt extends IWidget<'imageOpt', Widget_imageOpt_input, Widget_imageOpt_serial, Widget_imageOpt_state, Widget_imageOpt_output> {}
export class Widget_imageOpt implements IRequest<'imageOpt', Widget_imageOpt_input, Widget_imageOpt_serial, Widget_imageOpt_state, Widget_imageOpt_output> {
    isOptional = true
    id: string
    type = 'imageOpt' as const
    state: Widget_imageOpt_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_imageOpt_input,
        serial?: Widget_imageOpt_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.state = serial ?? {
            type: 'imageOpt',
            id: this.id,
            active: input.default ? true : false,
            comfy: input.defaultComfy ?? { imageName: 'example.png', type: 'ComfyImage' },
            cushy: input.defaultCushy,
            paint: input.defaultPaint,
            pick: input.default ?? 'comfy',
        }
        makeAutoObservable(this)
    }
    get serial(): Widget_imageOpt_serial { return this.state }
    get result(): Widget_imageOpt_output {
        if (!this.state.active) return undefined
        if (this.state.pick === 'cushy' && this.state.cushy) return this.state.cushy
        if (this.state.pick === 'paint' && this.state.paint) return this.state.paint
        return this.state.comfy
    }
}

// 🅿️ selectOne ==============================================================================
export type BaseSelectOneEntry = { id: string, label?: string }
export type Widget_selectOne_input <T extends BaseSelectOneEntry>  = ReqInput<{ default?: T; choices: T[] | ((formRoot:Widget_group<any>) => T[]) }>
export type Widget_selectOne_serial<T extends BaseSelectOneEntry> = Widget_selectOne_state<T>
export type Widget_selectOne_state <T extends BaseSelectOneEntry>  = StateFields<{ type:'selectOne', query: string; val: T }>
export type Widget_selectOne_output<T extends BaseSelectOneEntry> = T
export interface Widget_selectOne<T>  extends IWidget<'selectOne', Widget_selectOne_input<T>, Widget_selectOne_serial<T>, Widget_selectOne_state<T>, Widget_selectOne_output<T>> {}
export class Widget_selectOne<T extends BaseSelectOneEntry> implements IRequest<'selectOne', Widget_selectOne_input<T>, Widget_selectOne_serial<T>, Widget_selectOne_state<T>, Widget_selectOne_output<T>> {
    isOptional = false
    id: string
    type = 'selectOne' as const
    state: Widget_selectOne_state<T>

    get choices():T[]{
        const _choices = this.input.choices
        return typeof _choices === 'function' //
            ? _choices(this.builder.ROOT)
            : _choices
    }
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_selectOne_input<T>,
        serial?: Widget_selectOne_serial<T>,
    ) {
        this.id = serial?.id ?? nanoid()
        const choices = this.choices
        this.state = serial ?? {
            type: 'selectOne',
            active: true,
            id: this.id,
            query: '',
            val: input.default ?? choices[0],
        }
        makeAutoObservable(this)
    }
    get serial(): Widget_selectOne_serial<T> { return this.state }
    get result(): Widget_selectOne_output<T> { return this.state.val }
}

// 🅿️ selectOneOrCustom ==============================================================================
export type Widget_selectOneOrCustom_input  = ReqInput<{ default?: string; choices: string[] }>
export type Widget_selectOneOrCustom_serial = Widget_selectOneOrCustom_state
export type Widget_selectOneOrCustom_state  = StateFields<{ type:'selectOneOrCustom', query: string; val: string }>
export type Widget_selectOneOrCustom_output = string
export interface Widget_selectOneOrCustom extends IWidget<'selectOneOrCustom', Widget_selectOneOrCustom_input, Widget_selectOneOrCustom_serial, Widget_selectOneOrCustom_state, Widget_selectOneOrCustom_output > {}
export class Widget_selectOneOrCustom implements IRequest<'selectOneOrCustom', Widget_selectOneOrCustom_input, Widget_selectOneOrCustom_serial, Widget_selectOneOrCustom_state, Widget_selectOneOrCustom_output > {
    isOptional = false
    id: string
    type = 'selectOneOrCustom' as const
    state: Widget_selectOneOrCustom_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_selectOneOrCustom_input,
        serial?: Widget_selectOneOrCustom_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.state = serial ?? {
            type: 'selectOneOrCustom',
            id: this.id,
            query: '',
            val: input.default ?? input.choices[0] ?? '',
        }
        makeAutoObservable(this)
    }
    get serial(): Widget_selectOneOrCustom_serial { return this.state }
    get result(): Widget_selectOneOrCustom_output { return this.state.val }
}

// 🅿️ selectMany ==============================================================================
export type Widget_selectMany_input<T extends { type: string }>  = ReqInput<{ default?: T[]; choices: T[] }>
export type Widget_selectMany_serial<T extends { type: string }> = StateFields<{ type: 'selectMany', query: string; values_: string[] }>
export type Widget_selectMany_state<T extends { type: string }>  = StateFields<{ type: 'selectMany', query: string; values: T[] }>
export type Widget_selectMany_output<T extends { type: string }> = T[]
export interface Widget_selectMany<T extends { type: string }> extends IWidget<'selectMany', Widget_selectMany_input<T>, Widget_selectMany_serial<T>, Widget_selectMany_state<T>, Widget_selectMany_output<T>> {}
export class Widget_selectMany<T extends { type: string }> implements IRequest<'selectMany', Widget_selectMany_input<T>, Widget_selectMany_serial<T>, Widget_selectMany_state<T>, Widget_selectMany_output<T>> {
    isOptional = false
    id: string
    type = 'selectMany' as const
    state: Widget_selectMany_state<T>
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_selectMany_input<T>,
        serial?: Widget_selectMany_serial<T>,
    ) {
        this.id = serial?.id ?? nanoid()
        if (serial) {
            const values = serial.values_.map((v) => input.choices.find((c) => c.type === v)!).filter((v) => v != null)
            this.state = { type: 'selectMany', id: this.id, query: serial.query, values: values, }
        } else {
            this.state = { type: 'selectMany', id: this.id, query: '', values: input.default ?? [], }
        }
        makeAutoObservable(this)
    }
    get serial(): Widget_selectMany_serial<T> {
        const values_ = this.state.values.map((v) => v.type)
        return { type: 'selectMany', id: this.id, query: this.state.query, values_ }
    }
    get result(): Widget_selectMany_output<T> {
        return this.state.values
    }
}

// 🅿️ selectManyOrCustom ==============================================================================
export type Widget_selectManyOrCustom_input  = ReqInput<{ default?: string[]; choices: string[] }>
export type Widget_selectManyOrCustom_serial = Widget_selectManyOrCustom_state
export type Widget_selectManyOrCustom_state  = StateFields<{ type: 'selectManyOrCustom', query: string; values: string[] }>
export type Widget_selectManyOrCustom_output = string[]
export interface Widget_selectManyOrCustom extends IWidget<'selectManyOrCustom',  Widget_selectManyOrCustom_input, Widget_selectManyOrCustom_serial, Widget_selectManyOrCustom_state, Widget_selectManyOrCustom_output > {}
export class Widget_selectManyOrCustom implements IRequest<'selectManyOrCustom', Widget_selectManyOrCustom_input, Widget_selectManyOrCustom_serial, Widget_selectManyOrCustom_state, Widget_selectManyOrCustom_output > {
    isOptional = false
    id: string
    type = 'selectManyOrCustom' as const
    state: Widget_selectManyOrCustom_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_selectManyOrCustom_input,
        serial?: Widget_selectManyOrCustom_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.state = serial ?? { type: 'selectManyOrCustom', id: this.id, query: '', values: input.default ?? [] }
        makeAutoObservable(this)
    }
    get serial(): Widget_selectManyOrCustom_serial { return this.state }
    get result(): Widget_selectManyOrCustom_output { return this.state.values }
}

// 🅿️ list ==============================================================================
export type Widget_list_input<T extends Widget>  = ReqInput<{
    element: () => T,
    min?: number,
    max?:number,
    defaultLength?:number
}>
export type Widget_list_serial<T extends Widget> = StateFields<{ type: 'list', active: true; items_: T['$Serial'][] }>
export type Widget_list_state<T extends Widget>  = StateFields<{ type: 'list', active: true; items: T[] }>
export type Widget_list_output<T extends Widget> = T['$Output'][]
export interface Widget_list<T extends Widget> extends IWidget<'list', Widget_list_input<T>, Widget_list_serial<T>, Widget_list_state<T>, Widget_list_output<T>> {}
export class Widget_list<T extends Widget> implements IRequest<'list', Widget_list_input<T>, Widget_list_serial<T>, Widget_list_state<T>, Widget_list_output<T>> {
    isOptional = false
    id: string
    type = 'list' as const
    state: Widget_list_state<T>
    private _reference: T

    // moveItemUp(index: number) {
    //     if (index > 0) {
    //         const item = this.state.items[index];
    //         this.state.items.splice(index, 1);   // Remove the item from its current position
    //         this.state.items.splice(index - 1, 0, item);  // Reinsert at new position
    //     }
    // }

    // moveItemDown(index: number) {
    //     if (index < this.state.items.length - 1) {
    //         const item = this.state.items[index];
    //         this.state.items.splice(index, 1);   // Remove the item from its current position
    //         this.state.items.splice(index + 1, 0, item);  // Reinsert at new position
    //     }
    // }

    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_list_input<T>,
        serial?: Widget_list_serial<T>,
    ) {
        this.id = serial?.id ?? nanoid()
        this._reference = input.element()
        if (serial) {
            const items = serial.items_.map((sub_) => builder.HYDRATE(sub_.type, this._reference.input, sub_)) // 🔴 handler filter if wrong type
            this.state = { type: 'list', id: this.id, active: serial.active, items }
        } else {
            const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)
            const defaultLen = clamp(input.defaultLength ?? 0, input.min ?? 0, input.max ?? 10)
            const items = defaultLen
                ? new Array(defaultLen).fill(0).map(() => input.element())
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
    removemAllItems = () => {
        this.state.items = []
    }
    collapseAllItems = () => {
        for (const item of this.state.items)
            item.state.collapsed = true
    }
    expandAllItems = () => {
        for (const item of this.state.items)
            item.state.collapsed = false
    }
    removeItem = (item: T) => {
        const i = this.state.items.indexOf(item)
        if (i >= 0) this.state.items.splice(i, 1)
    }
    get serial(): Widget_list_serial<T> {
        const items_ = this.state.items.map((i) => i.serial)
        return { type: 'list', id: this.id, active: this.state.active, items_ }
    }
    get result(): Widget_list_output<T> { return this.state.items.map((i) => i.result) }
    addItem() {
        // const _ref = this._reference
        // const newItem = this.builder.HYDRATE(_ref.type, _ref.input)
        this.state.items.push(this.input.element())
    }
}

// 🅿️ group ==============================================================================
export type Widget_group_input <T extends { [key: string]: Widget }> = ReqInput<{ items: () => T, topLevel?: boolean, verticalLabels?: boolean }>
export type Widget_group_serial<T extends { [key: string]: Widget }> = StateFields<{ type: 'group', active: true; values_: {[k in keyof T]: T[k]['$Serial']}, collapsed?: boolean }>
export type Widget_group_state <T extends { [key: string]: Widget }> = StateFields<{ type: 'group', active: true; values: T, vertical?: boolean }>
export type Widget_group_output<T extends { [key: string]: Widget }> = { [k in keyof T]: ReqResult<T[k]> }
export interface Widget_group<T extends { [key: string]: Widget }> extends IWidget<'group', Widget_group_input<T>, Widget_group_serial<T>, Widget_group_state<T>, Widget_group_output<T>> {}
export class Widget_group<T extends { [key: string]: Widget }> implements IRequest<'group', Widget_group_input<T>, Widget_group_serial<T>, Widget_group_state<T>, Widget_group_output<T>> {
    isOptional = false
    id: string
    type = 'group' as const
    state: Widget_group_state<T>
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_group_input<T>,
        serial?: Widget_group_serial<T>,
    ) {
        this.id = serial?.id ?? nanoid()
        if (typeof input.items!=='function') {
            console.log('🔴 group "items" should be af unction')
            debugger
        }
        // debugger
        if (serial){
            const _newValues = input.items()
            this.state = { type: 'group', id: this.id, active: serial.active, collapsed: serial.collapsed, values: {} as any}
            const prevValues_ = serial.values_??{}
            for (const key in _newValues) {
                const newItem = _newValues[key]
                const prevValue_ = prevValues_[key]
                // if (newItem==null) continue // 🔴 loop should be on now item keys, not prev
                // if (newItem==null) debugger
                const newInput = newItem.input
                const newType = newItem.type
                // console.log(' 👀 >>', key, prev_)
                if (prevValue_ && newType === prevValue_.type) {
                    this.state.values[key] = this.builder.HYDRATE(newType, newInput, prevValue_)
                } else {
                    this.state.values[key] = newItem
                }
            }
        } else {
            const _items = input.items()
            this.state = { type: 'group', id: this.id, active: true, values: _items, vertical: input.verticalLabels??true }
        }
        makeAutoObservable(this)
    }
    get serial(): Widget_group_serial<T> {
        const values_: { [key: string]: any } = {}
        for (const key in this.state.values) values_[key] = this.state.values[key].serial
        return { type: 'group', id: this.id, active: this.state.active, values_: values_ as any, collapsed: this.state.collapsed }
    }
    get result(): Widget_group_output<T> {
        const out: { [key: string]: any } = {}
        for (const key in this.state.values) {
            out[key] = this.state.values[key].result
        }
        return out as any
    }
}

// 🅿️ groupOpt ==============================================================================
export type Widget_groupOpt_input <T extends { [key: string]: Widget }> = ReqInput<{ default?: boolean; items: () => T, topLevel?: false }>
export type Widget_groupOpt_serial<T extends { [key: string]: Widget }> = StateFields<{ type: 'groupOpt', active: boolean; values_: {[K in keyof T]: T[K]['$Serial']}, }>
export type Widget_groupOpt_state <T extends { [key: string]: Widget }> = StateFields<{ type: 'groupOpt', active: boolean; values: T, }>
export type Widget_groupOpt_output<T extends { [key: string]: Widget }> = Maybe<{ [k in keyof T]: ReqResult<T[k]> }>
export interface Widget_groupOpt<T extends { [key: string]: Widget }> extends IWidget<'groupOpt', Widget_groupOpt_input<T>, Widget_groupOpt_serial<T>, Widget_groupOpt_state<T>, Widget_groupOpt_output<T>> {}
export class Widget_groupOpt<T extends { [key: string]: Widget }> implements IRequest<'groupOpt', Widget_groupOpt_input<T>, Widget_groupOpt_serial<T>, Widget_groupOpt_state<T>, Widget_groupOpt_output<T>> {
    isOptional = true
    id: string
    type = 'groupOpt' as const
    state: Widget_groupOpt_state<T>
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_groupOpt_input<T>,
        serial?: Widget_groupOpt_serial<T>,
    ) {
        this.id = serial?.id ?? nanoid()
        if (serial){
            const _newValues = input.items()
            this.state = { type:'groupOpt', id: this.id, active: serial.active, collapsed: serial.collapsed, values: {} as any }
            const prevValues_ = serial.values_??{}
            for (const key in _newValues) {
                const newItem = _newValues[key]
                const prevValue_ = prevValues_[key]
                // if (newItem==null) continue // 🔴 loop should be on now item keys, not prev
                // if (newItem==null) debugger
                const newInput = newItem.input
                const newType = newItem.type
                // console.log(' 👀 >>', key, prev_)
                if (prevValue_ && newType === prevValue_.type) {
                    this.state.values[key] = this.builder.HYDRATE(newType, newInput, prevValue_)
                } else {
                    this.state.values[key] = newItem
                }
            }
        } else {
            const _items = input.items()
            this.state = { type: 'groupOpt', id: this.id, active: input.default ?? false, values: _items }
        }
        makeAutoObservable(this)
    }
    get serial(): Widget_groupOpt_serial<T> {
        const out: { [key: string]: any } = {}
        for (const key in this.state.values) out[key] = this.state.values[key].serial
        return { type: 'groupOpt', id: this.id, active: this.state.active, values_: out as any, collapsed: this.state.collapsed }
    }
    get result(): Widget_groupOpt_output<T> {
        if (!this.state.active) return undefined
        const out: { [key: string]: any } = {}
        for (const key in this.state.values) {
            out[key] = this.state.values[key].result
        }
        return out as any
    }
}

// 🅿️ choice ==============================================================================
export type Widget_choice_input <T extends { [key: string]: Widget }> = ReqInput<{ default?: keyof T; items: () => T }>
export type Widget_choice_serial<T extends { [key: string]: Widget }> = StateFields<{ type: 'choice', active: boolean; pick: keyof T & string, values_: {[K in keyof T]: T[K]['$Serial']} }>
export type Widget_choice_state <T extends { [key: string]: Widget }> = StateFields<{ type: 'choice', active: boolean; pick: keyof T & string, values: T }>
export type Widget_choice_output<T extends { [key: string]: Widget }> = ReqResult<T[keyof T]>
export interface Widget_choice  <T extends { [key: string]: Widget }> extends    IWidget<'choice',  Widget_choice_input<T>, Widget_choice_serial<T>, Widget_choice_state<T>, Widget_choice_output<T>> {}
export class Widget_choice      <T extends { [key: string]: Widget }> implements IRequest<'choice', Widget_choice_input<T>, Widget_choice_serial<T>, Widget_choice_state<T>, Widget_choice_output<T>> {
    isOptional = false
    id: string
    type = 'choice' as const
    state: Widget_choice_state<T>
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_choice_input<T>,
        serial?: Widget_choice_serial<T>,
    ) {
        this.id = serial?.id ?? nanoid()
        if (serial){
            const _newValues = input.items()
            this.state = { type:'choice', id: this.id, active: serial.active, collapsed: serial.collapsed, values: {} as any, pick: serial.pick }
            const prevValues_ = serial.values_??{}
            for (const key in _newValues) {
                const newItem = _newValues[key]
                const prevValue_ = prevValues_[key]
                const newInput = newItem.input
                const newType = newItem.type
                if (prevValue_ && newType === prevValue_.type) {
                    this.state.values[key] = this.builder.HYDRATE(newType, newInput, prevValue_)
                } else {
                    this.state.values[key] = newItem
                }
            }
        } else {
            const _items = input.items()
            const defaultPick: keyof T & string = (Object.keys(_items)[0]  ?? '_error_')
            this.state = { type: 'choice', id: this.id, active: (input.default!=null) ?? false, values: _items, pick: defaultPick }
        }
        makeAutoObservable(this)
    }
    get serial(): Widget_choice_serial<T> {
        const out: { [key: string]: any } = {}
        for (const key in this.state.values) out[key] = this.state.values[key].serial
        return { type: 'choice', id: this.id, active: this.state.active, values_: out as any, collapsed: this.state.collapsed, pick: this.state.pick }
    }
    get result(): Widget_choice_output<T> {
        // @ts-ignore
        if (!this.state.active) return undefined
        // @ts-ignore
        if (this.state.pick==null)return undefined

        return this.state.values[this.state.pick].result
    }
}


// 🅿️ choices ==============================================================================
export type Widget_choices_input <T extends { [key: string]: Widget }> = ReqInput<{ items: () => T, defaultActiveBranches?: {[k in keyof T]?: boolean}  }>
export type Widget_choices_serial<T extends { [key: string]: Widget }> = StateFields<{ type: 'choices', active: true; branches: {[k in keyof T]?: boolean}, values_: {[k in keyof T]: T[k]['$Serial']} }>
export type Widget_choices_state <T extends { [key: string]: Widget }> = StateFields<{ type: 'choices', active: true; branches: {[k in keyof T]?: boolean}, values: T }>
export type Widget_choices_output<T extends { [key: string]: Widget }> = { [k in keyof T]?: ReqResult<T[k]> }
export interface Widget_choices<T extends { [key: string]: Widget }> extends IWidget<'choices', Widget_choices_input<T>, Widget_choices_serial<T>, Widget_choices_state<T>, Widget_choices_output<T>> {}
export class Widget_choices<T extends { [key: string]: Widget }> implements IRequest<'choices', Widget_choices_input<T>, Widget_choices_serial<T>, Widget_choices_state<T>, Widget_choices_output<T>> {
    isOptional = false
    id: string
    type = 'choices' as const
    state: Widget_choices_state<T>
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_choices_input<T>,
        serial?: Widget_choices_serial<T>,
    ) {
        this.id = serial?.id ?? nanoid()
        if (typeof input.items!=='function') {
            console.log('🔴 choices "items" should be af unction')
            debugger
        }
        // debugger
        if (serial){
            const _newValues = input.items()
            this.state = {
                type: 'choices',
                id: this.id,
                active: serial.active,
                collapsed: serial.collapsed,
                branches: this.input.defaultActiveBranches??{},
                values: {} as any
            }
            const prevValues_ = serial.values_??{}
            for (const key in _newValues) {
                const newItem = _newValues[key]
                const prevValue_ = prevValues_[key]
                const newInput = newItem.input
                const newType = newItem.type
                // restore branches value
                if (prevValue_ && newType === prevValue_.type) {
                    this.state.values[key] = this.builder.HYDRATE(newType, newInput, prevValue_)
                } else {
                    this.state.values[key] = newItem
                }
                // restore branch action state
                if (serial.branches[key]!=null) {
                    this.state.branches[key] = serial.branches[key]
                }
            }
        } else {
            const _items = input.items()
            this.state = { type: 'choices', id: this.id, active: true, values: _items, branches: {} }
        }
        makeAutoObservable(this)
    }
    get serial(): Widget_choices_serial<T> {
        const values_: { [key: string]: any } = {}
        for (const key in this.state.values) values_[key] = this.state.values[key].serial
        return {
            type: 'choices',
            id: this.id,
            active: this.state.active,
            values_: values_ as any,
            collapsed: this.state.collapsed ,
            branches: this.state.branches
        }
    }
    get result(): Widget_choices_output<T> {
        const out: { [key: string]: any } = {}
        for (const key in this.state.values) {
            if (this.state.branches[key] !== true) continue
            out[key] = this.state.values[key].result
        }
        return out as any
    }
}

// 🅿️ enum ==============================================================================
export type Widget_enum_input<T extends KnownEnumNames>  = ReqInput<{ default?: Requirable[T]; enumName: T }>
export type Widget_enum_serial<T extends KnownEnumNames> = Widget_enum_state<T>
export type Widget_enum_state<T extends KnownEnumNames>  = StateFields<{ type: 'enum', active: true; val: Requirable[T] }>
export type Widget_enum_output<T extends KnownEnumNames> = Requirable[T]
export interface Widget_enum<T extends KnownEnumNames> extends IWidget<'enum', Widget_enum_input<T>, Widget_enum_serial<T>, Widget_enum_state<T>, Widget_enum_output<T>> {}
export class Widget_enum<T extends KnownEnumNames> implements IRequest<'enum', Widget_enum_input<T>, Widget_enum_serial<T>, Widget_enum_state<T>, Widget_enum_output<T>> {
    isOptional = false
    id: string
    type = 'enum' as const
    state: Widget_enum_state<T>
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_enum_input<T>,
        serial?: Widget_enum_serial<T>,
    ) {
        this.id = serial?.id ?? nanoid()
        const possibleValues = this.schema.knownEnumsByName.get(input.enumName)?.values ?? []
        this.state = serial ?? {
            type: 'enum',
            id: this.id,
            active: true,
            val: input.default ?? (possibleValues[0] as any)
        }
        makeAutoObservable(this)
    }
    get status(): CleanedEnumResult<any> { return this.schema.st.fixEnumValue(this.state.val as any, this.input.enumName, false) } // prettier-ignore
    get serial(): Widget_enum_serial<T> { return this.state }
    get result(): Widget_enum_output<T> { return this.status.finalValue }
}

// 🅿️ enumOpt ==============================================================================
export type Widget_enumOpt_input<T extends KnownEnumNames>  = ReqInput<{ default?: Requirable[T]; enumName: T }>
export type Widget_enumOpt_serial<T extends KnownEnumNames> = Widget_enumOpt_state<T>
export type Widget_enumOpt_state<T extends KnownEnumNames>  = StateFields<{ type: 'enumOpt', active: boolean; val: Requirable[T] }>
export type Widget_enumOpt_output<T extends KnownEnumNames> = Maybe<Requirable[T]>
export interface Widget_enumOpt<T extends KnownEnumNames> extends IWidget<'enumOpt', Widget_enumOpt_input<T>, Widget_enumOpt_serial<T>, Widget_enumOpt_state<T>, Widget_enumOpt_output<T>> {}
export class Widget_enumOpt<T extends KnownEnumNames> implements IRequest<'enumOpt', Widget_enumOpt_input<T>, Widget_enumOpt_serial<T>, Widget_enumOpt_state<T>, Widget_enumOpt_output<T>> {
    isOptional = true
    id: string
    type = 'enumOpt' as const
    state: Widget_enumOpt_state<T>
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_enumOpt_input<T>,
        serial?: Widget_enumOpt_serial<T>,
    ) {
        this.id = serial?.id ?? nanoid()
        const possibleValues = this.schema.knownEnumsByName.get(input.enumName)?.values ?? []
        this.state = serial ?? {
            type: 'enumOpt',
            id: this.id,
            active: input.default != null,
            val: input.default ?? (possibleValues[0] as any) /* 🔴 */,
        }
        makeAutoObservable(this)
    }
    get status(): CleanedEnumResult<any> { return this.schema.st.fixEnumValue(this.state.val as any, this.input.enumName, true) } // prettier-ignore
    get serial(): Widget_enumOpt_serial<T> { return this.state }
    get result(): Widget_enumOpt_output<T> {
        if (!this.state.active) return undefined
        return this.status.finalValue
    }
}
