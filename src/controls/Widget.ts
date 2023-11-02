/**
 * this file is an attempt to centralize core widget definition in a single
 * file so it's easy to add any widget in the future
 */
import type { ItemDataType } from 'rsuite/esm/@types/common'
import type { CELL } from 'src/front/ui/widgets/WidgetMatrixUI'
import type { SchemaL } from 'src/models/Schema'
import type { SimplifiedLoraDef } from 'src/presets/SimplifiedLoraDef'
import type { WidgetPromptOutput } from 'src/prompter/WidgetPromptUI'
import type { PossibleSerializedNodes } from 'src/prompter/plugins/CushyDebugPlugin'
import type { AspectRatio, ComfyImageAnswer, CushyImageAnswer, CushySize, CushySizeByRatio, ImageAnswer, ImageAnswerForm, PaintImageAnswer, SDModelType } from './misc/InfoAnswer'

import { makeAutoObservable } from 'mobx'
import { NumbericTheme } from 'src/front/ui/widgets/WidgetNumUI'
import { bang } from 'src/utils/bang'
import { FormBuilder } from './FormBuilder'
import { IRequest, IWidget, ReqInput, ReqResult } from './IWidget'

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
export type Widget_str_input = ReqInput<{ default?: string; textarea?: boolean }>
export type Widget_str_serial = { type: 'str', active: true; val: string }
export type Widget_str_state  = { type: 'str', active: true; val: string }
export type Widget_str_output = string
export interface Widget_str extends IWidget<'str', Widget_str_input, Widget_str_serial, Widget_str_state, Widget_str_output> {}
export class Widget_str implements IRequest<'str', Widget_str_input, Widget_str_serial, Widget_str_state, Widget_str_output> {
    type = 'str' as const
    state: Widget_str_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_str_input,
        serial?: Widget_str_serial,
    ) {
        this.state = serial ?? { type:'str', active: true, val: input.default ?? '' }
        makeAutoObservable(this)
    }
    get serial(): Widget_str_serial { return this.state }
    get result(): Widget_str_output { return this.state.val }
}

// 🅿️ markdown ==============================================================================
export type Widget_markdown_input = ReqInput<{ markdown: string; }>
export type Widget_markdown_serial = { type: 'markdown', active: true }
export type Widget_markdown_state  = { type: 'markdown', active: true }
export type Widget_markdown_output = { type: 'markdown', active: true }
export interface Widget_markdown extends IWidget<'markdown', Widget_markdown_input, Widget_markdown_serial, Widget_markdown_state, Widget_markdown_output> {}
export class Widget_markdown implements IRequest<'markdown', Widget_markdown_input, Widget_markdown_serial, Widget_markdown_state, Widget_markdown_output> {
    type = 'markdown' as const
    state: Widget_markdown_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_markdown_input,
        serial?: Widget_markdown_serial,
    ) {
        this.state = serial ?? { type:'markdown', active: true }
        makeAutoObservable(this)
    }
    get serial(): Widget_markdown_serial { return this.state }
    get result(): Widget_markdown_output { return this.state }
}

// 🅿️ str ==============================================================================
export type Widget_color_input = ReqInput<{ default?: string; }>
export type Widget_color_serial = { type: 'color', active: true; val: string }
export type Widget_color_state  = { type: 'color', active: true; val: string }
export type Widget_color_output = string
export interface Widget_color extends IWidget<'color', Widget_color_input, Widget_color_serial, Widget_color_state, Widget_color_output> {}
export class Widget_color implements IRequest<'color', Widget_color_input, Widget_color_serial, Widget_color_state, Widget_color_output> {
    type = 'color' as const
    state: Widget_color_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_color_input,
        serial?: Widget_color_serial,
    ) {
        this.state = serial ?? { type:'color', active: true, val: input.default ?? '' }
        makeAutoObservable(this)
    }
    get serial(): Widget_color_serial { return this.state }
    get result(): Widget_color_output { return this.state.val }
}

// 🅿️ strOpt ==============================================================================
export type Widget_strOpt_input = ReqInput<{ default?: string; textarea?: boolean }>
export type Widget_strOpt_serial = Widget_strOpt_state
export type Widget_strOpt_state = { type:'strOpt', active: boolean; val: string }
export type Widget_strOpt_output = Maybe<string>
export interface Widget_strOpt extends IWidget<'strOpt', Widget_strOpt_input, Widget_strOpt_serial, Widget_strOpt_state, Widget_strOpt_output> {}
export class Widget_strOpt implements IRequest<'strOpt', Widget_strOpt_input, Widget_strOpt_serial, Widget_strOpt_state, Widget_strOpt_output> {
    type = 'strOpt' as const
    state: Widget_strOpt_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_strOpt_input,
        serial?: Widget_strOpt_serial,
    ) {
        this.state = serial ?? {
            type: 'strOpt',
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
export type Widget_prompt_input = ReqInput<{ default?: string | WidgetPromptOutput }>
export type Widget_prompt_serial = Widget_prompt_state
export type Widget_prompt_state =  { type: 'prompt'; active: true; /*text: string;*/ tokens: PossibleSerializedNodes[] }
export type Widget_prompt_output = { type: 'prompt'; active: true; /*text: string;*/ tokens: PossibleSerializedNodes[] }
export interface Widget_prompt extends IWidget<'prompt', Widget_prompt_input, Widget_prompt_serial, Widget_prompt_state, Widget_prompt_output> {}
export class Widget_prompt implements IRequest<'prompt', Widget_prompt_input, Widget_prompt_serial, Widget_prompt_state, Widget_prompt_output> {
    type = 'prompt' as const
    state: Widget_prompt_state

    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_prompt_input,
        serial?: Widget_prompt_serial,
    ) {
        if (serial) {
            this.state = serial
        } else {
            this.state = { type:'prompt', active: true, /*text: '',*/ tokens: [] }

            const def = input.default
            if (def != null) {
                if (typeof def === 'string') {
                    // this.state.text = def
                    this.state.tokens = [{ type: 'text', text: def }]
                }
                if (typeof Array.isArray(def)) {
                    // 🔴
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
export type Widget_promptOpt_input  = ReqInput<{ default?: string | PossibleSerializedNodes[] }>
export type Widget_promptOpt_serial = { type: 'promptOpt'; active: boolean; /* text: string;*/ tokens: PossibleSerializedNodes[] }
export type Widget_promptOpt_state  = { type: 'promptOpt'; active: boolean; /* text: string;*/ tokens: PossibleSerializedNodes[] }
export type Widget_promptOpt_output = Maybe<WidgetPromptOutput>
export interface Widget_promptOpt extends IWidget<'promptOpt', Widget_promptOpt_input, Widget_promptOpt_serial, Widget_promptOpt_state, Widget_promptOpt_output> {}
export class Widget_promptOpt implements IRequest<'promptOpt', Widget_promptOpt_input, Widget_promptOpt_serial, Widget_promptOpt_state, Widget_promptOpt_output> {
    type = 'promptOpt' as const
    state: Widget_promptOpt_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_promptOpt_input,
        serial?: Widget_promptOpt_serial,
    ) {
        if (serial) {
            this.state = serial
        } else {
            this.state = { type:'promptOpt', active: false, /*text: '',*/ tokens: [] }
            const def = input.default
            if (def != null) {
                if (typeof def === 'string') {
                    this.state.active = true
                    // this.state.text = def
                    this.state.tokens = [{ type: 'text', text: def }]
                }
                if (typeof Array.isArray(def)) {
                    // 🔴
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
export type Widget_seed_state  = { type:'seed', active: true; val: number, mode: 'randomize' | 'fixed' | 'last' }
export type Widget_seed_output = number
export interface Widget_seed extends IWidget<'seed', Widget_seed_input, Widget_seed_serial, Widget_seed_state, Widget_seed_output> {}
export class Widget_seed implements IRequest<'seed', Widget_seed_input, Widget_seed_serial, Widget_seed_state, Widget_seed_output> {
    type = 'seed' as const
    state: Widget_seed_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_seed_input,
        serial?: Widget_seed_serial,
    ) {
        this.state = serial ?? {
            type: 'seed',
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
export type Widget_int_input  = ReqInput<{ default?: number; min?: number; max?: number, step?: number, theme?: NumbericTheme }>
export type Widget_int_serial = Widget_int_state
export type Widget_int_state  = { type:'int', active: true; val: number }
export type Widget_int_output = number
export interface Widget_int extends IWidget<'int', Widget_int_input, Widget_int_serial, Widget_int_state, Widget_int_output> {}
export class Widget_int implements IRequest<'int', Widget_int_input, Widget_int_serial, Widget_int_state, Widget_int_output> {
    type = 'int' as const
    state: Widget_int_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_int_input,
        serial?: Widget_int_serial,
    ) {
        this.state = serial ?? { type: 'int', active: true, val: input.default ?? 0 }
        makeAutoObservable(this)
    }
    get serial(): Widget_int_serial { return this.state }
    get result(): Widget_int_output { return this.state.val }
}

// 🅿️ float ==============================================================================
export type Widget_float_input = ReqInput<{ default?: number; min?: number; max?: number, step?: number, theme?: NumbericTheme }>
export type Widget_float_serial = Widget_float_state
export type Widget_float_state = { type:'float', active: true; val: number }
export type Widget_float_output = number
export interface Widget_float extends IWidget<'float', Widget_float_input, Widget_float_serial, Widget_float_state, Widget_float_output> {}
export class Widget_float implements IRequest<'float', Widget_float_input, Widget_float_serial, Widget_float_state, Widget_float_output> {
    type = 'float' as const
    state: Widget_float_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_float_input,
        serial?: Widget_float_serial,
    ) {
        this.state = serial ?? { type:'float', active: true, val: input.default ?? 0 }
        makeAutoObservable(this)
    }
    get serial(): Widget_float_serial { return this.state }
    get result(): Widget_float_output { return this.state.val }
}

// 🅿️ bool ==============================================================================
export type Widget_bool_input = ReqInput<{ default?: boolean }>
export type Widget_bool_serial = Widget_bool_state
export type Widget_bool_state = { type:'bool', active: true; val: boolean }
export type Widget_bool_output = boolean
export interface Widget_bool extends IWidget<'bool', Widget_bool_input, Widget_bool_serial, Widget_bool_state, Widget_bool_output> {}
export class Widget_bool implements IRequest<'bool', Widget_bool_input, Widget_bool_serial, Widget_bool_state, Widget_bool_output> {
    type = 'bool' as const
    state: Widget_bool_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_bool_input,
        serial?: Widget_bool_serial,
    ) {
        this.state = serial ?? { type: 'bool', active: true, val: input.default ?? false }
        makeAutoObservable(this)
    }
    get serial(): Widget_bool_serial { return this.state }
    get result(): Widget_bool_output { return this.state.val }
}

// 🅿️ intOpt ==============================================================================
export type Widget_intOpt_input = ReqInput<{ default?: number; min?: number; max?: number; step?: number, theme?: NumbericTheme }>
export type Widget_intOpt_serial = Widget_intOpt_state
export type Widget_intOpt_state = { type: 'intOpt', active: boolean; val: number }
export type Widget_intOpt_output = Maybe<number>
export interface Widget_intOpt extends IWidget<'intOpt', Widget_intOpt_input, Widget_intOpt_serial, Widget_intOpt_state, Widget_intOpt_output> {}
export class Widget_intOpt implements IRequest<'intOpt', Widget_intOpt_input, Widget_intOpt_serial, Widget_intOpt_state, Widget_intOpt_output> {
    type = 'intOpt' as const
    state: Widget_intOpt_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_intOpt_input,
        serial?: Widget_intOpt_serial,
    ) {
        this.state = serial ?? {
            type: 'intOpt',
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
export type Widget_floatOpt_input = ReqInput<{ default?: number; min?: number; max?: number; step?: number, theme?: NumbericTheme }>
export type Widget_floatOpt_serial = Widget_floatOpt_state
export type Widget_floatOpt_state = { type: 'floatOpt', active: boolean; val: number }
export type Widget_floatOpt_output = Maybe<number>
export interface Widget_floatOpt extends IWidget<'floatOpt', Widget_floatOpt_input, Widget_floatOpt_serial, Widget_floatOpt_state, Widget_floatOpt_output> {}
export class Widget_floatOpt implements IRequest<'floatOpt', Widget_floatOpt_input, Widget_floatOpt_serial, Widget_floatOpt_state, Widget_floatOpt_output> {
    type = 'floatOpt' as const
    state: Widget_floatOpt_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_floatOpt_input,
        serial?: Widget_floatOpt_serial,
    ) {
        this.state = serial ?? {
            type: 'floatOpt',
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
export type Widget_size_input = ReqInput<{ default?: CushySizeByRatio }>
export type Widget_size_serial = Widget_size_state
export type Widget_size_state = CushySize
export type Widget_size_output = CushySize
export interface Widget_size extends IWidget<'size', Widget_size_input, Widget_size_serial, Widget_size_state, Widget_size_output> {}
export class Widget_size implements IRequest<'size', Widget_size_input, Widget_size_serial, Widget_size_state, Widget_size_output> {
    type = 'size' as const
    state: Widget_size_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_size_input,
        serial?: Widget_size_serial,
    ) {
        if (serial) {
            this.state = serial
        } else {
            const aspectRatio: AspectRatio = input.default?.aspectRatio ?? '1:1'
            const modelType: SDModelType = input.default?.modelType ?? 'SD1.5 512'
            const width = 512 // 🔴
            const height = 512 // 🔴
            this.state = {
                type: 'size',
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
export type Widget_matrix_input = ReqInput<{ default?: { row: string; col: string }[]; rows: string[]; cols: string[] }>
export type Widget_matrix_serial = Widget_matrix_state
export type Widget_matrix_state = { type: 'matrix', active: true; selected: CELL[], collapsed?: boolean }
export type Widget_matrix_output = CELL[]
export interface Widget_matrix extends IWidget<'matrix', Widget_matrix_input, Widget_matrix_serial, Widget_matrix_state, Widget_matrix_output> {}
export class Widget_matrix implements IRequest<'matrix', Widget_matrix_input, Widget_matrix_serial, Widget_matrix_state, Widget_matrix_output> {
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
        this.state = serial ?? { type:'matrix', active: true, selected: [] }
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
export type Widget_loras_input = ReqInput<{ default?: SimplifiedLoraDef[] }>
export type Widget_loras_serial = Widget_loras_state
export type Widget_loras_state = { type: 'loras', active: true; loras: SimplifiedLoraDef[] }
export type Widget_loras_output = SimplifiedLoraDef[]
export interface Widget_loras extends IWidget<'loras', Widget_loras_input, Widget_loras_serial, Widget_loras_state, Widget_loras_output> {}
export class Widget_loras implements IRequest<'loras', Widget_loras_input, Widget_loras_serial, Widget_loras_state, Widget_loras_output> {
    type = 'loras' as const
    state: Widget_loras_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_loras_input,
        serial?: Widget_loras_serial,
    ) {
        this.state = serial ?? { type: 'loras', active: true, loras: input.default ?? [] }
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
    FOLDER: ItemDataType<any>[] = []
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
}>
export type Widget_image_serial = Widget_image_state
export type Widget_image_state  = ImageAnswerForm<'image', true>
export type Widget_image_output = ImageAnswer
export interface Widget_image extends IWidget<'image', Widget_image_input, Widget_image_serial, Widget_image_state, Widget_image_output> {}
export class Widget_image implements IRequest<'image', Widget_image_input, Widget_image_serial, Widget_image_state, Widget_image_output> {
    type = 'image' as const
    state: Widget_image_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_image_input,
        serial?: Widget_image_serial,
    ) {
        // console.log('🔴 AAA', serial)
        this.state = serial ?? {
            type: 'image',
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
export type Widget_imageOpt_state  = ImageAnswerForm<'imageOpt', boolean>
export type Widget_imageOpt_output = Maybe<ImageAnswer>
export interface Widget_imageOpt extends IWidget<'imageOpt', Widget_imageOpt_input, Widget_imageOpt_serial, Widget_imageOpt_state, Widget_imageOpt_output> {}
export class Widget_imageOpt implements IRequest<'imageOpt', Widget_imageOpt_input, Widget_imageOpt_serial, Widget_imageOpt_state, Widget_imageOpt_output> {
    type = 'imageOpt' as const
    state: Widget_imageOpt_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_imageOpt_input,
        serial?: Widget_imageOpt_serial,
    ) {
        this.state = serial ?? {
            type: 'imageOpt',
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
export type Widget_selectOne_input<T> = ReqInput<{ default?: T; choices: T[] }>
export type Widget_selectOne_serial<T> = Widget_selectOne_state<T>
export type Widget_selectOne_state<T> = { type:'selectOne', query: string; val: T }
export type Widget_selectOne_output<T> = T
export interface Widget_selectOne<T>  extends IWidget<'selectOne', Widget_selectOne_input<T>, Widget_selectOne_serial<T>, Widget_selectOne_state<T>, Widget_selectOne_output<T>> {}
export class Widget_selectOne<T> implements IRequest<'selectOne', Widget_selectOne_input<T>, Widget_selectOne_serial<T>, Widget_selectOne_state<T>, Widget_selectOne_output<T>> {
    type = 'selectOne' as const
    state: Widget_selectOne_state<T>
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_selectOne_input<T>,
        serial?: Widget_selectOne_serial<T>,
    ) {
        this.state = serial ?? {
            type: 'selectOne',
            query: '',
            val: input.default ?? input.choices[0],
        }
        makeAutoObservable(this)
    }
    get serial(): Widget_selectOne_serial<T> { return this.state }
    get result(): Widget_selectOne_output<T> { return this.state.val }
}

// 🅿️ selectOneOrCustom ==============================================================================
export type Widget_selectOneOrCustom_input = ReqInput<{ default?: string; choices: string[] }>
export type Widget_selectOneOrCustom_serial = Widget_selectOneOrCustom_state
export type Widget_selectOneOrCustom_state = { type:'selectOneOrCustom', query: string; val: string }
export type Widget_selectOneOrCustom_output = string
export interface Widget_selectOneOrCustom extends IWidget<'selectOneOrCustom', Widget_selectOneOrCustom_input, Widget_selectOneOrCustom_serial, Widget_selectOneOrCustom_state, Widget_selectOneOrCustom_output > {}
export class Widget_selectOneOrCustom implements IRequest<'selectOneOrCustom', Widget_selectOneOrCustom_input, Widget_selectOneOrCustom_serial, Widget_selectOneOrCustom_state, Widget_selectOneOrCustom_output > {
    type = 'selectOneOrCustom' as const
    state: Widget_selectOneOrCustom_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_selectOneOrCustom_input,
        serial?: Widget_selectOneOrCustom_serial,
    ) {
        this.state = serial ?? {
            type: 'selectOneOrCustom',
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
export type Widget_selectMany_serial<T extends { type: string }> = { type: 'selectMany', query: string; values_: string[] }
export type Widget_selectMany_state<T extends { type: string }>  = { type: 'selectMany', query: string; values: T[] }
export type Widget_selectMany_output<T extends { type: string }> = T[]
export interface Widget_selectMany<T extends { type: string }> extends IWidget<'selectMany', Widget_selectMany_input<T>, Widget_selectMany_serial<T>, Widget_selectMany_state<T>, Widget_selectMany_output<T>> {}
export class Widget_selectMany<T extends { type: string }> implements IRequest<'selectMany', Widget_selectMany_input<T>, Widget_selectMany_serial<T>, Widget_selectMany_state<T>, Widget_selectMany_output<T>> {
    type = 'selectMany' as const
    state: Widget_selectMany_state<T>
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_selectMany_input<T>,
        serial?: Widget_selectMany_serial<T>,
    ) {
        if (serial) {
            const values = serial.values_.map((v) => input.choices.find((c) => c.type === v)!).filter((v) => v != null)
            this.state = { type: 'selectMany', query: serial.query, values: values, }
        } else {
            this.state = { type: 'selectMany', query: '', values: input.default ?? [], }
        }
        makeAutoObservable(this)
    }
    get serial(): Widget_selectMany_serial<T> {
        const values_ = this.state.values.map((v) => v.type)
        return { type: 'selectMany', query: this.state.query, values_ }
    }
    get result(): Widget_selectMany_output<T> {
        return this.state.values
    }
}

// 🅿️ selectManyOrCustom ==============================================================================
export type Widget_selectManyOrCustom_input = ReqInput<{ default?: string[]; choices: string[] }>
export type Widget_selectManyOrCustom_serial = Widget_selectManyOrCustom_state
export type Widget_selectManyOrCustom_state = { type: 'selectManyOrCustom', query: string; values: string[] }
export type Widget_selectManyOrCustom_output = string[]
export interface Widget_selectManyOrCustom extends IWidget<'selectManyOrCustom',  Widget_selectManyOrCustom_input, Widget_selectManyOrCustom_serial, Widget_selectManyOrCustom_state, Widget_selectManyOrCustom_output > {}
export class Widget_selectManyOrCustom implements IRequest<'selectManyOrCustom', Widget_selectManyOrCustom_input, Widget_selectManyOrCustom_serial, Widget_selectManyOrCustom_state, Widget_selectManyOrCustom_output > {
    type = 'selectManyOrCustom' as const
    state: Widget_selectManyOrCustom_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_selectManyOrCustom_input,
        serial?: Widget_selectManyOrCustom_serial,
    ) {
        this.state = serial ?? { type: 'selectManyOrCustom', query: '', values: input.default ?? [] }
        makeAutoObservable(this)
    }
    get serial(): Widget_selectManyOrCustom_serial { return this.state }
    get result(): Widget_selectManyOrCustom_output { return this.state.values }
}

// 🅿️ list ==============================================================================
export type Widget_list_input<T extends Widget>  = ReqInput<{ element: () => T }>
export type Widget_list_serial<T extends Widget> = { type: 'list', active: true; items_: T['$Serial'][] }
export type Widget_list_state<T extends Widget>  = { type: 'list', active: true; items: T[] }
export type Widget_list_output<T extends Widget> = T['$Output'][]
export interface Widget_list<T extends Widget> extends IWidget<'list', Widget_list_input<T>, Widget_list_serial<T>, Widget_list_state<T>, Widget_list_output<T>> {}
export class Widget_list<T extends Widget> implements IRequest<'list', Widget_list_input<T>, Widget_list_serial<T>, Widget_list_state<T>, Widget_list_output<T>> {
    type = 'list' as const
    state: Widget_list_state<T>
    private _reference: T
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_list_input<T>,
        serial?: Widget_list_serial<T>,
    ) {
        this._reference = input.element()
        if (serial) {
            const items = serial.items_.map((sub_) => builder.HYDRATE(sub_.type, this._reference.input, sub_)) // 🔴 handler filter if wrong type
            this.state = { type: 'list', active: serial.active, items }
        } else {
            this.state = { type: 'list', active: true, items: [], }
        }
        makeAutoObservable(this)
    }
    removeItem = (item: T) => {
        const i = this.state.items.indexOf(item)
        if (i >= 0) this.state.items.splice(i, 1)
    }
    get serial(): Widget_list_serial<T> {
        const items_ = this.state.items.map((i) => i.serial)
        return { type: 'list', active: this.state.active, items_ }
    }
    get result(): Widget_list_output<T> { return this.state.items.map((i) => i.result) }
    addItem() {
        // const _ref = this._reference
        // const newItem = this.builder.HYDRATE(_ref.type, _ref.input)
        this.state.items.push(this.input.element())
    }
}

// 🅿️ group ==============================================================================
export type Widget_group_input <T extends { [key: string]: Widget }> = ReqInput<{ items: () => T, topLevel?: boolean }>
export type Widget_group_serial<T extends { [key: string]: Widget }> = { type: 'group', active: true; values_: {[k in keyof T]: T[k]['$Serial']}, collapsed?: boolean }
export type Widget_group_state <T extends { [key: string]: Widget }> = { type: 'group', active: true; values: T, collapsed?: boolean }
export type Widget_group_output<T extends { [key: string]: Widget }> = { [k in keyof T]: ReqResult<T[k]> }
export interface Widget_group<T extends { [key: string]: Widget }> extends IWidget<'group', Widget_group_input<T>, Widget_group_serial<T>, Widget_group_state<T>, Widget_group_output<T>> {}
export class Widget_group<T extends { [key: string]: Widget }> implements IRequest<'group', Widget_group_input<T>, Widget_group_serial<T>, Widget_group_state<T>, Widget_group_output<T>> {
    type = 'group' as const
    state: Widget_group_state<T>
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_group_input<T>,
        serial?: Widget_group_serial<T>,
    ) {
        if (typeof input.items!=='function') {
            console.log('🔴 group "items" should be af unction')
            debugger
        }
        // debugger
        if (serial){
            const _newValues = input.items()
            this.state = { type: 'group', active: serial.active, collapsed: serial.collapsed, values: {} as any }
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
            this.state = { type: 'group', active: true, values: _items, }
        }
        makeAutoObservable(this)
    }
    get serial(): Widget_group_serial<T> {
        const values_: { [key: string]: any } = {}
        for (const key in this.state.values) values_[key] = this.state.values[key].serial
        return { type: 'group', active: this.state.active, values_: values_ as any, collapsed: this.state.collapsed }
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
export type Widget_groupOpt_input <T extends { [key: string]: Widget }> = ReqInput<{ default?: boolean; items: () => T }>
export type Widget_groupOpt_serial<T extends { [key: string]: Widget }> = { type: 'groupOpt', active: boolean; values_: {[K in keyof T]: T[K]['$Serial']}, collapsed?: boolean }
export type Widget_groupOpt_state <T extends { [key: string]: Widget }> = { type: 'groupOpt', active: boolean; values: T, collapsed?: boolean }
export type Widget_groupOpt_output<T extends { [key: string]: Widget }> = Maybe<{ [k in keyof T]: ReqResult<T[k]> }>
export interface Widget_groupOpt<T extends { [key: string]: Widget }> extends IWidget<'groupOpt', Widget_groupOpt_input<T>, Widget_groupOpt_serial<T>, Widget_groupOpt_state<T>, Widget_groupOpt_output<T>> {}
export class Widget_groupOpt<T extends { [key: string]: Widget }> implements IRequest<'groupOpt', Widget_groupOpt_input<T>, Widget_groupOpt_serial<T>, Widget_groupOpt_state<T>, Widget_groupOpt_output<T>> {
    type = 'groupOpt' as const
    state: Widget_groupOpt_state<T>
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_groupOpt_input<T>,
        serial?: Widget_groupOpt_serial<T>,
    ) {
        if (serial){
            const _newValues = input.items()
            this.state = { type:'groupOpt', active: serial.active, collapsed: serial.collapsed, values: {} as any }
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
            this.state = { type: 'groupOpt', active: input.default ?? false, values: _items }
        }
        makeAutoObservable(this)
    }
    get serial(): Widget_groupOpt_serial<T> {
        const out: { [key: string]: any } = {}
        for (const key in this.state.values) out[key] = this.state.values[key].serial
        return { type: 'groupOpt', active: this.state.active, values_: out as any, collapsed: this.state.collapsed }
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
export type Widget_choice_serial<T extends { [key: string]: Widget }> = { type: 'choice', active: boolean; pick: keyof T & string, values_: {[K in keyof T]: T[K]['$Serial']}, collapsed?: boolean }
export type Widget_choice_state <T extends { [key: string]: Widget }> = { type: 'choice', active: boolean; pick: keyof T & string, values: T, collapsed?: boolean }
export type Widget_choice_output<T extends { [key: string]: Widget }> = ReqResult<T[keyof T]>
export interface Widget_choice  <T extends { [key: string]: Widget }> extends    IWidget<'choice',  Widget_choice_input<T>, Widget_choice_serial<T>, Widget_choice_state<T>, Widget_choice_output<T>> {}
export class Widget_choice      <T extends { [key: string]: Widget }> implements IRequest<'choice', Widget_choice_input<T>, Widget_choice_serial<T>, Widget_choice_state<T>, Widget_choice_output<T>> {
    type = 'choice' as const
    state: Widget_choice_state<T>
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_choice_input<T>,
        serial?: Widget_choice_serial<T>,
    ) {
        if (serial){
            const _newValues = input.items()
            this.state = { type:'choice', active: serial.active, collapsed: serial.collapsed, values: {} as any, pick: serial.pick }
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
            this.state = { type: 'choice', active: (input.default!=null) ?? false, values: _items, pick: defaultPick }
        }
        makeAutoObservable(this)
    }
    get serial(): Widget_choice_serial<T> {
        const out: { [key: string]: any } = {}
        for (const key in this.state.values) out[key] = this.state.values[key].serial
        return { type: 'choice', active: this.state.active, values_: out as any, collapsed: this.state.collapsed, pick: this.state.pick }
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
export type Widget_choices_serial<T extends { [key: string]: Widget }> = { type: 'choices', active: true; branches: {[k in keyof T]?: boolean}, values_: {[k in keyof T]: T[k]['$Serial']}, collapsed?: boolean }
export type Widget_choices_state <T extends { [key: string]: Widget }> = { type: 'choices', active: true; branches: {[k in keyof T]?: boolean}, values: T, collapsed?: boolean }
export type Widget_choices_output<T extends { [key: string]: Widget }> = { [k in keyof T]?: ReqResult<T[k]> }
export interface Widget_choices<T extends { [key: string]: Widget }> extends IWidget<'choices', Widget_choices_input<T>, Widget_choices_serial<T>, Widget_choices_state<T>, Widget_choices_output<T>> {}
export class Widget_choices<T extends { [key: string]: Widget }> implements IRequest<'choices', Widget_choices_input<T>, Widget_choices_serial<T>, Widget_choices_state<T>, Widget_choices_output<T>> {
    type = 'choices' as const
    state: Widget_choices_state<T>
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_choices_input<T>,
        serial?: Widget_choices_serial<T>,
    ) {
        if (typeof input.items!=='function') {
            console.log('🔴 choices "items" should be af unction')
            debugger
        }
        // debugger
        if (serial){
            const _newValues = input.items()
            this.state = {
                type: 'choices',
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
            this.state = { type: 'choices', active: true, values: _items, branches: {} }
        }
        makeAutoObservable(this)
    }
    get serial(): Widget_choices_serial<T> {
        const values_: { [key: string]: any } = {}
        for (const key in this.state.values) values_[key] = this.state.values[key].serial
        return {
            type: 'choices',
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
export type Widget_enum_input<T extends KnownEnumNames> = ReqInput<{ default?: Requirable[T]; enumName: T }>
export type Widget_enum_serial<T extends KnownEnumNames> = Widget_enum_state<T>
export type Widget_enum_state<T extends KnownEnumNames> = { type: 'enum', active: true; val: Requirable[T] }
export type Widget_enum_output<T extends KnownEnumNames> = Requirable[T]
export interface Widget_enum<T extends KnownEnumNames> extends IWidget<'enum', Widget_enum_input<T>, Widget_enum_serial<T>, Widget_enum_state<T>, Widget_enum_output<T>> {}
export class Widget_enum<T extends KnownEnumNames> implements IRequest<'enum', Widget_enum_input<T>, Widget_enum_serial<T>, Widget_enum_state<T>, Widget_enum_output<T>> {
    type = 'enum' as const
    state: Widget_enum_state<T>
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_enum_input<T>,
        serial?: Widget_enum_serial<T>,
    ) {
        const possibleValues = this.schema.knownEnumsByName.get(input.enumName)?.values ?? []
        this.state = serial ?? {
            type: 'enum',
            active: true,
            val: input.default ?? (possibleValues[0] as any) /* 🔴 */,
        }
        makeAutoObservable(this)
    }
    get serial(): Widget_enum_serial<T> { return this.state }
    get result(): Widget_enum_output<T> { return this.state.val }
}

// 🅿️ enumOpt ==============================================================================
export type Widget_enumOpt_input<T extends KnownEnumNames> = ReqInput<{ default?: Requirable[T]; enumName: T }>
export type Widget_enumOpt_serial<T extends KnownEnumNames> = Widget_enumOpt_state<T>
export type Widget_enumOpt_state<T extends KnownEnumNames> = { type: 'enumOpt', active: boolean; val: Requirable[T] }
export type Widget_enumOpt_output<T extends KnownEnumNames> = Maybe<Requirable[T]>
export interface Widget_enumOpt<T extends KnownEnumNames> extends IWidget<'enumOpt', Widget_enumOpt_input<T>, Widget_enumOpt_serial<T>, Widget_enumOpt_state<T>, Widget_enumOpt_output<T>> {}
export class Widget_enumOpt<T extends KnownEnumNames> implements IRequest<'enumOpt', Widget_enumOpt_input<T>, Widget_enumOpt_serial<T>, Widget_enumOpt_state<T>, Widget_enumOpt_output<T>> {
    type = 'enumOpt' as const
    state: Widget_enumOpt_state<T>
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Widget_enumOpt_input<T>,
        serial?: Widget_enumOpt_serial<T>,
    ) {
        const possibleValues = this.schema.knownEnumsByName.get(input.enumName)?.values ?? []
        this.state = serial ?? {
            type: 'enumOpt',
            active: input.default != null,
            val: input.default ?? (possibleValues[0] as any) /* 🔴 */,
        }
        makeAutoObservable(this)
    }
    get serial(): Widget_enumOpt_serial<T> { return this.state }
    get result(): Widget_enumOpt_output<T> {
        if (!this.state.active) return undefined
        return this.state.val
    }
}
