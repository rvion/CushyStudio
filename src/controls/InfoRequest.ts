/**
 * this file is an attempt to centralize core widget definition in a single
 * file so it's easy to add any widget in the future
 */
import type { ItemDataType } from 'rsuite/esm/@types/common'
import type { CELL } from 'src/front/ui/widgets/WidgetMatrixUI'
import type { EnumInfo, SchemaL } from 'src/models/Schema'
import type { SimplifiedLoraDef } from 'src/presets/SimplifiedLoraDef'
import type { PossibleSerializedNodes } from 'src/prompter/plugins/CushyDebugPlugin'
import type { WidgetPromptOutput } from 'src/prompter/WidgetPromptUI'
import type { AspectRatio, CushySize, CushySizeByRatio, ImageAnswer, ImageAnswerForm, SDModelType } from './misc/InfoAnswer'

import { makeAutoObservable } from 'mobx'
import { bang } from 'src/utils/bang'
import { deepCopyNaive, exhaust } from 'src/utils/ComfyUtils'
import { NumbericTheme } from 'src/front/ui/widgets/WidgetNumUI'


// requestable are a closed union
export type Requestable =
    | Requestable_color
    | Requestable_str
    | Requestable_strOpt
    | Requestable_prompt
    | Requestable_promptOpt
    | Requestable_seed
    | Requestable_int
    | Requestable_float
    | Requestable_bool
    | Requestable_intOpt
    | Requestable_floatOpt
    | Requestable_size
    | Requestable_matrix
    | Requestable_loras
    | Requestable_image
    | Requestable_imageOpt
    | Requestable_selectOneOrCustom
    | Requestable_selectMany<any>
    | Requestable_selectManyOrCustom
    | Requestable_selectOne<any>
    | Requestable_list<any>
    | Requestable_group<any>
    | Requestable_groupOpt<any>
    | Requestable_choice<any>
    | Requestable_choices<any>
    | Requestable_enum<KnownEnumNames>
    | Requestable_enumOpt<KnownEnumNames>

// -------------------------------------------------------------------------------------------------------------------------------------------------

export type ReqResult<Req> = Req extends IWidget<any, any, any, any, infer O> ? O : never
export type ReqState<Req> = Req extends IWidget<any, any, any, infer S, any> ? S : never
export type IWidget<T, I, X extends {type: T}, S, O> = {
    $Input: I;
    $Serial: X;
    $State: S;
    $Output: O
}
export type IRequest<T, I, X, S, O> = {
    type: T
    state: S
    readonly result: O
    readonly serial: X
}

export type LabelPos = 'start' | 'end'
export type ReqInput<X> = X & {
    label?: string
    labelPos?: LabelPos
    layout?: 'H'| 'V',
    group?: string
    tooltip?: string
    i18n?: { [key: string]: string }
    className?: string
}

// 🅿️ str ==============================================================================
export type Requestable_str_input = ReqInput<{ default?: string; textarea?: boolean }>
export type Requestable_str_serial = { type: 'str', active: true; val: string }
export type Requestable_str_state  = { type: 'str', active: true; val: string }
export type Requestable_str_output = string
export interface Requestable_str extends IWidget<'str', Requestable_str_input, Requestable_str_serial, Requestable_str_state, Requestable_str_output> {}
export class Requestable_str implements IRequest<'str', Requestable_str_input, Requestable_str_serial, Requestable_str_state, Requestable_str_output> {
    type = 'str' as const
    state: Requestable_str_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Requestable_str_input,
        serial?: Requestable_str_serial,
    ) {
        this.state = serial ?? { type:'str', active: true, val: input.default ?? '' }
        makeAutoObservable(this)
    }
    get serial(): Requestable_str_serial { return this.state }
    get result(): Requestable_str_output { return this.state.val }
}

// 🅿️ str ==============================================================================
export type Requestable_color_input = ReqInput<{ default?: string; }>
export type Requestable_color_serial = { type: 'color', active: true; val: string }
export type Requestable_color_state  = { type: 'color', active: true; val: string }
export type Requestable_color_output = string
export interface Requestable_color extends IWidget<'color', Requestable_color_input, Requestable_color_serial, Requestable_color_state, Requestable_color_output> {}
export class Requestable_color implements IRequest<'color', Requestable_color_input, Requestable_color_serial, Requestable_color_state, Requestable_color_output> {
    type = 'color' as const
    state: Requestable_color_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Requestable_color_input,
        serial?: Requestable_color_serial,
    ) {
        this.state = serial ?? { type:'color', active: true, val: input.default ?? '' }
        makeAutoObservable(this)
    }
    get serial(): Requestable_color_serial { return this.state }
    get result(): Requestable_color_output { return this.state.val }
}

// 🅿️ strOpt ==============================================================================
export type Requestable_strOpt_input = ReqInput<{ default?: string; textarea?: boolean }>
export type Requestable_strOpt_serial = Requestable_strOpt_state
export type Requestable_strOpt_state = { type:'strOpt', active: boolean; val: string }
export type Requestable_strOpt_output = Maybe<string>
export interface Requestable_strOpt extends IWidget<'strOpt', Requestable_strOpt_input, Requestable_strOpt_serial, Requestable_strOpt_state, Requestable_strOpt_output> {}
export class Requestable_strOpt implements IRequest<'strOpt', Requestable_strOpt_input, Requestable_strOpt_serial, Requestable_strOpt_state, Requestable_strOpt_output> {
    type = 'strOpt' as const
    state: Requestable_strOpt_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Requestable_strOpt_input,
        serial?: Requestable_strOpt_serial,
    ) {
        this.state = serial ?? {
            type: 'strOpt',
            active: input.default != null,
            val: input.default ?? '',
        }
        makeAutoObservable(this)
    }
    get serial(){ return this.state }
    get result(): Requestable_strOpt_output {
        if (!this.state.active) return undefined
        return this.state.val
    }
}

// 🅿️ prompt ==============================================================================
export type Requestable_prompt_input = ReqInput<{ default?: string | WidgetPromptOutput }>
export type Requestable_prompt_serial = Requestable_prompt_state
export type Requestable_prompt_state =  { type: 'prompt'; active: true; text: string; tokens: PossibleSerializedNodes[] }
export type Requestable_prompt_output = { type: 'prompt'; active: true; text: string; tokens: PossibleSerializedNodes[] }
export interface Requestable_prompt extends IWidget<'prompt', Requestable_prompt_input, Requestable_prompt_serial, Requestable_prompt_state, Requestable_prompt_output> {}
export class Requestable_prompt implements IRequest<'prompt', Requestable_prompt_input, Requestable_prompt_serial, Requestable_prompt_state, Requestable_prompt_output> {
    type = 'prompt' as const
    state: Requestable_prompt_state

    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Requestable_prompt_input,
        serial?: Requestable_prompt_serial,
    ) {
        if (serial) {
            this.state = serial
        } else {
            this.state = { type:'prompt', active: true, text: '', tokens: [] }

            const def = input.default
            if (def != null) {
                if (typeof def === 'string') {
                    this.state.text = def
                    this.state.tokens = [{ type: 'text', text: def }]
                }
                if (typeof Array.isArray(def)) {
                    // 🔴
                }
            }
        }
        makeAutoObservable(this)
    }
    get serial(): Requestable_prompt_serial { return this.state } // prettier-ignore
    get result(): Requestable_prompt_output {
        JSON.stringify(this.state) // 🔶 force deep observation
        return this.state
    }
}

// 🅿️ promptOpt ==============================================================================
export type Requestable_promptOpt_input  = ReqInput<{ default?: string | PossibleSerializedNodes[] }>
export type Requestable_promptOpt_serial = { type: 'promptOpt'; active: boolean; text: string; tokens: PossibleSerializedNodes[] }
export type Requestable_promptOpt_state  = { type: 'promptOpt'; active: boolean; text: string; tokens: PossibleSerializedNodes[] }
export type Requestable_promptOpt_output = Maybe<WidgetPromptOutput>
export interface Requestable_promptOpt extends IWidget<'promptOpt', Requestable_promptOpt_input, Requestable_promptOpt_serial, Requestable_promptOpt_state, Requestable_promptOpt_output> {}
export class Requestable_promptOpt implements IRequest<'promptOpt', Requestable_promptOpt_input, Requestable_promptOpt_serial, Requestable_promptOpt_state, Requestable_promptOpt_output> {
    type = 'promptOpt' as const
    state: Requestable_promptOpt_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Requestable_promptOpt_input,
        serial?: Requestable_promptOpt_serial,
    ) {
        if (serial) {
            this.state = serial
        } else {
            this.state = { type:'promptOpt', active: false, text: '', tokens: [] }
            const def = input.default
            if (def != null) {
                if (typeof def === 'string') {
                    this.state.active = true
                    this.state.text = def
                    this.state.tokens = [{ type: 'text', text: def }]
                }
                if (typeof Array.isArray(def)) {
                    // 🔴
                }
            }
        }
        makeAutoObservable(this)
    }
    get serial(): Requestable_promptOpt_serial { return this.state }
    get result(): Requestable_promptOpt_output {
        if (this.state.active === false) return undefined
        return this.state
    }
}

// 🅿️ int ==============================================================================
export type Requestable_int_input  = ReqInput<{ default?: number; min?: number; max?: number, theme?: NumbericTheme }>
export type Requestable_int_serial = Requestable_int_state
export type Requestable_int_state  = { type:'int', active: true; val: number }
export type Requestable_int_output = number
export interface Requestable_int extends IWidget<'int', Requestable_int_input, Requestable_int_serial, Requestable_int_state, Requestable_int_output> {}
export class Requestable_int implements IRequest<'int', Requestable_int_input, Requestable_int_serial, Requestable_int_state, Requestable_int_output> {
    type = 'int' as const
    state: Requestable_int_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Requestable_int_input,
        serial?: Requestable_int_serial,
    ) {
        this.state = serial ?? { type: 'int', active: true, val: input.default ?? 0 }
        makeAutoObservable(this)
    }
    get serial(): Requestable_int_serial { return this.state }
    get result(): Requestable_int_output { return this.state.val }
}

// 🅿️ seed ==============================================================================
export type Requestable_seed_input  = ReqInput<{ default?: number; defaultMode?: 'randomize' | 'fixed' | 'last', min?: number; max?: number }>
export type Requestable_seed_serial = Requestable_seed_state
export type Requestable_seed_state  = { type:'seed', active: true; val: number, mode: 'randomize' | 'fixed' | 'last' }
export type Requestable_seed_output = number
export interface Requestable_seed extends IWidget<'seed', Requestable_seed_input, Requestable_seed_serial, Requestable_seed_state, Requestable_seed_output> {}
export class Requestable_seed implements IRequest<'seed', Requestable_seed_input, Requestable_seed_serial, Requestable_seed_state, Requestable_seed_output> {
    type = 'seed' as const
    state: Requestable_seed_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Requestable_seed_input,
        serial?: Requestable_seed_serial,
    ) {
        this.state = serial ?? {
            type: 'seed',
            active: true,
            val: input.default ?? 0,
            mode: input.defaultMode ?? 'randomize'
        }
        makeAutoObservable(this)
    }
    get serial(): Requestable_seed_serial { return this.state }
    get result(): Requestable_seed_output {
        return this.state.mode ==='randomize'
            ? Math.floor(Math.random()* 9_999_999)
            : this.state.val
    }
}

// 🅿️ float ==============================================================================
export type Requestable_float_input = ReqInput<{ default?: number; min?: number; max?: number, theme?: NumbericTheme }>
export type Requestable_float_serial = Requestable_float_state
export type Requestable_float_state = { type:'float', active: true; val: number }
export type Requestable_float_output = number
export interface Requestable_float extends IWidget<'float', Requestable_float_input, Requestable_float_serial, Requestable_float_state, Requestable_float_output> {}
export class Requestable_float implements IRequest<'float', Requestable_float_input, Requestable_float_serial, Requestable_float_state, Requestable_float_output> {
    type = 'float' as const
    state: Requestable_float_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Requestable_float_input,
        serial?: Requestable_float_serial,
    ) {
        this.state = serial ?? { type:'float', active: true, val: input.default ?? 0 }
        makeAutoObservable(this)
    }
    get serial(): Requestable_float_serial { return this.state }
    get result(): Requestable_float_output { return this.state.val }
}

// 🅿️ bool ==============================================================================
export type Requestable_bool_input = ReqInput<{ default?: boolean }>
export type Requestable_bool_serial = Requestable_bool_state
export type Requestable_bool_state = { type:'bool', active: true; val: boolean }
export type Requestable_bool_output = boolean
export interface Requestable_bool extends IWidget<'bool', Requestable_bool_input, Requestable_bool_serial, Requestable_bool_state, Requestable_bool_output> {}
export class Requestable_bool implements IRequest<'bool', Requestable_bool_input, Requestable_bool_serial, Requestable_bool_state, Requestable_bool_output> {
    type = 'bool' as const
    state: Requestable_bool_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Requestable_bool_input,
        serial?: Requestable_bool_serial,
    ) {
        this.state = serial ?? { type: 'bool', active: true, val: input.default ?? false }
        makeAutoObservable(this)
    }
    get serial(): Requestable_bool_serial { return this.state }
    get result(): Requestable_bool_output { return this.state.val }
}

// 🅿️ intOpt ==============================================================================
export type Requestable_intOpt_input = ReqInput<{ default?: number; min?: number; max?: number; step?: number, theme?: NumbericTheme }>
export type Requestable_intOpt_serial = Requestable_intOpt_state
export type Requestable_intOpt_state = { type: 'intOpt', active: boolean; val: number }
export type Requestable_intOpt_output = Maybe<number>
export interface Requestable_intOpt extends IWidget<'intOpt', Requestable_intOpt_input, Requestable_intOpt_serial, Requestable_intOpt_state, Requestable_intOpt_output> {}
export class Requestable_intOpt implements IRequest<'intOpt', Requestable_intOpt_input, Requestable_intOpt_serial, Requestable_intOpt_state, Requestable_intOpt_output> {
    type = 'intOpt' as const
    state: Requestable_intOpt_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Requestable_intOpt_input,
        serial?: Requestable_intOpt_serial,
    ) {
        this.state = serial ?? {
            type: 'intOpt',
            active: input.default != null,
            val: input.default ?? 0,
        }
        makeAutoObservable(this)
    }
    get serial(): Requestable_intOpt_serial { return this.state }
    get result(): Requestable_intOpt_output {
        if (this.state.active === false) return undefined
        return this.state.val
    }
}

// 🅿️ floatOpt ==============================================================================
export type Requestable_floatOpt_input = ReqInput<{ default?: number; min?: number; max?: number; step?: number, theme?: NumbericTheme }>
export type Requestable_floatOpt_serial = Requestable_floatOpt_state
export type Requestable_floatOpt_state = { type: 'floatOpt', active: boolean; val: number }
export type Requestable_floatOpt_output = Maybe<number>
export interface Requestable_floatOpt extends IWidget<'floatOpt', Requestable_floatOpt_input, Requestable_floatOpt_serial, Requestable_floatOpt_state, Requestable_floatOpt_output> {}
export class Requestable_floatOpt implements IRequest<'floatOpt', Requestable_floatOpt_input, Requestable_floatOpt_serial, Requestable_floatOpt_state, Requestable_floatOpt_output> {
    type = 'floatOpt' as const
    state: Requestable_floatOpt_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Requestable_floatOpt_input,
        serial?: Requestable_floatOpt_serial,
    ) {
        this.state = serial ?? {
            type: 'floatOpt',
            active: input.default != null,
            val: input.default ?? 0,
        }
        makeAutoObservable(this)
    }
    get serial(): Requestable_floatOpt_serial { return this.state }
    get result(): Requestable_floatOpt_output {
        if (this.state.active === false) return undefined
        return this.state.val
    }
}

// 🅿️ size ==============================================================================
export type Requestable_size_input = ReqInput<{ default?: CushySizeByRatio }>
export type Requestable_size_serial = Requestable_size_state
export type Requestable_size_state = CushySize
export type Requestable_size_output = CushySize
export interface Requestable_size extends IWidget<'size', Requestable_size_input, Requestable_size_serial, Requestable_size_state, Requestable_size_output> {}
export class Requestable_size implements IRequest<'size', Requestable_size_input, Requestable_size_serial, Requestable_size_state, Requestable_size_output> {
    type = 'size' as const
    state: Requestable_size_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Requestable_size_input,
        serial?: Requestable_size_serial,
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
    get serial(): Requestable_size_serial { return this.state }
    get result(): Requestable_size_output {
        return this.state
    }
}

// 🅿️ matrix ==============================================================================
export type Requestable_matrix_input = ReqInput<{ default?: { row: string; col: string }[]; rows: string[]; cols: string[] }>
export type Requestable_matrix_serial = Requestable_matrix_state
export type Requestable_matrix_state = { type: 'matrix', active: true; selected: CELL[] }
export type Requestable_matrix_output = CELL[]
export interface Requestable_matrix extends IWidget<'matrix', Requestable_matrix_input, Requestable_matrix_serial, Requestable_matrix_state, Requestable_matrix_output> {}
export class Requestable_matrix implements IRequest<'matrix', Requestable_matrix_input, Requestable_matrix_serial, Requestable_matrix_state, Requestable_matrix_output> {
    type = 'matrix' as const
    state: Requestable_matrix_state
    rows: string[]
    cols: string[]
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Requestable_matrix_input,
        serial?: Requestable_matrix_serial,
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
    get serial(): Requestable_matrix_serial { return this.state }
    get result(): Requestable_matrix_output {
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
export type Requestable_loras_input = ReqInput<{ default?: SimplifiedLoraDef[] }>
export type Requestable_loras_serial = Requestable_loras_state
export type Requestable_loras_state = { type: 'loras', active: true; loras: SimplifiedLoraDef[] }
export type Requestable_loras_output = SimplifiedLoraDef[]
export interface Requestable_loras extends IWidget<'loras', Requestable_loras_input, Requestable_loras_serial, Requestable_loras_state, Requestable_loras_output> {}
export class Requestable_loras implements IRequest<'loras', Requestable_loras_input, Requestable_loras_serial, Requestable_loras_state, Requestable_loras_output> {
    type = 'loras' as const
    state: Requestable_loras_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Requestable_loras_input,
        serial?: Requestable_loras_serial,
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
    get serial(): Requestable_loras_serial { return this.state }
    get result(): Requestable_loras_output {
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
export type Requestable_image_input = ReqInput<{ default?: ImageAnswer }>
export type Requestable_image_serial = Requestable_image_state
export type Requestable_image_state = ImageAnswerForm<'image', true>
export type Requestable_image_output = ImageAnswer
export interface Requestable_image extends IWidget<'image', Requestable_image_input, Requestable_image_serial, Requestable_image_state, Requestable_image_output> {}
export class Requestable_image implements IRequest<'image', Requestable_image_input, Requestable_image_serial, Requestable_image_state, Requestable_image_output> {
    type = 'image' as const
    state: Requestable_image_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Requestable_image_input,
        serial?: Requestable_image_serial,
    ) {
        // console.log('🔴 AAA', serial)
        this.state = serial ?? {
            type: 'image',
            active: true,
            comfy: input.default?.type === 'ComfyImage' ? input.default : { imageName: 'example.png', type: 'ComfyImage' },
            cushy: input.default?.type === 'CushyImage' ? input.default : null,
            paint: input.default?.type === 'PaintImage' ? input.default : null,
            pick: input.default?.type === 'CushyImage' ? 'cushy' : 'comfy',
        }
        makeAutoObservable(this)
    }
    get serial(): Requestable_image_serial { return this.state }
    get result(): Requestable_image_output {
        if (this.state.pick === 'cushy' && this.state.cushy) return this.state.cushy
        if (this.state.pick === 'paint' && this.state.paint) return this.state.paint
        return this.state.comfy
    }
}

// 🅿️ imageOpt ==============================================================================
export type Requestable_imageOpt_input = ReqInput<{ default?: ImageAnswer }>
export type Requestable_imageOpt_serial = Requestable_imageOpt_state
export type Requestable_imageOpt_state = ImageAnswerForm<'imageOpt', boolean>
export type Requestable_imageOpt_output = Maybe<ImageAnswer>
export interface Requestable_imageOpt extends IWidget<'imageOpt', Requestable_imageOpt_input, Requestable_imageOpt_serial, Requestable_imageOpt_state, Requestable_imageOpt_output> {}
export class Requestable_imageOpt implements IRequest<'imageOpt', Requestable_imageOpt_input, Requestable_imageOpt_serial, Requestable_imageOpt_state, Requestable_imageOpt_output> {
    type = 'imageOpt' as const
    state: Requestable_imageOpt_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Requestable_imageOpt_input,
        serial?: Requestable_imageOpt_serial,
    ) {
        // console.log('🔴 BBB', serial)
        this.state = serial ?? {
            type: 'imageOpt',
            active: input.default ? true : false,
            comfy: input.default?.type === 'ComfyImage' ? input.default : { imageName: 'example.png', type: 'ComfyImage' },
            cushy: input.default?.type === 'CushyImage' ? input.default : null,
            paint: input.default?.type === 'PaintImage' ? input.default : null,
            pick: input.default?.type === 'CushyImage' ? 'cushy' : 'comfy',
        }
        makeAutoObservable(this)
    }
    get serial(): Requestable_imageOpt_serial { return this.state }
    get result(): Requestable_imageOpt_output {
        if (!this.state.active) return undefined
        if (this.state.pick === 'cushy' && this.state.cushy) return this.state.cushy
        if (this.state.pick === 'paint' && this.state.paint) return this.state.paint
        return this.state.comfy
    }
}

// 🅿️ selectOne ==============================================================================
export type Requestable_selectOne_input<T> = ReqInput<{ default?: T; choices: T[] }>
export type Requestable_selectOne_serial<T> = Requestable_selectOne_state<T>
export type Requestable_selectOne_state<T> = { type:'selectOne', query: string; val: T }
export type Requestable_selectOne_output<T> = T
export interface Requestable_selectOne<T>  extends IWidget<'selectOne', Requestable_selectOne_input<T>, Requestable_selectOne_serial<T>, Requestable_selectOne_state<T>, Requestable_selectOne_output<T>> {}
export class Requestable_selectOne<T> implements IRequest<'selectOne', Requestable_selectOne_input<T>, Requestable_selectOne_serial<T>, Requestable_selectOne_state<T>, Requestable_selectOne_output<T>> {
    type = 'selectOne' as const
    state: Requestable_selectOne_state<T>
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Requestable_selectOne_input<T>,
        serial?: Requestable_selectOne_serial<T>,
    ) {
        this.state = serial ?? {
            type: 'selectOne',
            query: '',
            val: input.default ?? input.choices[0],
        }
        makeAutoObservable(this)
    }
    get serial(): Requestable_selectOne_serial<T> { return this.state }
    get result(): Requestable_selectOne_output<T> { return this.state.val }
}

// 🅿️ selectOneOrCustom ==============================================================================
export type Requestable_selectOneOrCustom_input = ReqInput<{ default?: string; choices: string[] }>
export type Requestable_selectOneOrCustom_serial = Requestable_selectOneOrCustom_state
export type Requestable_selectOneOrCustom_state = { type:'selectOneOrCustom', query: string; val: string }
export type Requestable_selectOneOrCustom_output = string
export interface Requestable_selectOneOrCustom extends IWidget<'selectOneOrCustom', Requestable_selectOneOrCustom_input, Requestable_selectOneOrCustom_serial, Requestable_selectOneOrCustom_state, Requestable_selectOneOrCustom_output > {}
export class Requestable_selectOneOrCustom implements IRequest<'selectOneOrCustom', Requestable_selectOneOrCustom_input, Requestable_selectOneOrCustom_serial, Requestable_selectOneOrCustom_state, Requestable_selectOneOrCustom_output > {
    type = 'selectOneOrCustom' as const
    state: Requestable_selectOneOrCustom_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Requestable_selectOneOrCustom_input,
        serial?: Requestable_selectOneOrCustom_serial,
    ) {
        this.state = serial ?? {
            type: 'selectOneOrCustom',
            query: '',
            val: input.default ?? input.choices[0] ?? '',
        }
        makeAutoObservable(this)
    }
    get serial(): Requestable_selectOneOrCustom_serial { return this.state }
    get result(): Requestable_selectOneOrCustom_output { return this.state.val }
}

// 🅿️ selectMany ==============================================================================
export type Requestable_selectMany_input<T extends { type: string }>  = ReqInput<{ default?: T[]; choices: T[] }>
export type Requestable_selectMany_serial<T extends { type: string }> = { type: 'selectMany', query: string; values_: string[] }
export type Requestable_selectMany_state<T extends { type: string }>  = { type: 'selectMany', query: string; values: T[] }
export type Requestable_selectMany_output<T extends { type: string }> = T[]
export interface Requestable_selectMany<T extends { type: string }> extends IWidget<'selectMany', Requestable_selectMany_input<T>, Requestable_selectMany_serial<T>, Requestable_selectMany_state<T>, Requestable_selectMany_output<T>> {}
export class Requestable_selectMany<T extends { type: string }> implements IRequest<'selectMany', Requestable_selectMany_input<T>, Requestable_selectMany_serial<T>, Requestable_selectMany_state<T>, Requestable_selectMany_output<T>> {
    type = 'selectMany' as const
    state: Requestable_selectMany_state<T>
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Requestable_selectMany_input<T>,
        serial?: Requestable_selectMany_serial<T>,
    ) {
        if (serial) {
            const values = serial.values_.map((v) => input.choices.find((c) => c.type === v)!).filter((v) => v != null)
            this.state = { type: 'selectMany', query: serial.query, values: values, }
        } else {
            this.state = { type: 'selectMany', query: '', values: input.default ?? [], }
        }
        makeAutoObservable(this)
    }
    get serial(): Requestable_selectMany_serial<T> {
        const values_ = this.state.values.map((v) => v.type)
        return { type: 'selectMany', query: this.state.query, values_ }
    }
    get result(): Requestable_selectMany_output<T> {
        return this.state.values
    }
}

// 🅿️ selectManyOrCustom ==============================================================================
export type Requestable_selectManyOrCustom_input = ReqInput<{ default?: string[]; choices: string[] }>
export type Requestable_selectManyOrCustom_serial = Requestable_selectManyOrCustom_state
export type Requestable_selectManyOrCustom_state = { type: 'selectManyOrCustom', query: string; values: string[] }
export type Requestable_selectManyOrCustom_output = string[]
export interface Requestable_selectManyOrCustom extends IWidget<'selectManyOrCustom',  Requestable_selectManyOrCustom_input, Requestable_selectManyOrCustom_serial, Requestable_selectManyOrCustom_state, Requestable_selectManyOrCustom_output > {}
export class Requestable_selectManyOrCustom implements IRequest<'selectManyOrCustom', Requestable_selectManyOrCustom_input, Requestable_selectManyOrCustom_serial, Requestable_selectManyOrCustom_state, Requestable_selectManyOrCustom_output > {
    type = 'selectManyOrCustom' as const
    state: Requestable_selectManyOrCustom_state
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Requestable_selectManyOrCustom_input,
        serial?: Requestable_selectManyOrCustom_serial,
    ) {
        this.state = serial ?? { type: 'selectManyOrCustom', query: '', values: input.default ?? [] }
        makeAutoObservable(this)
    }
    get serial(): Requestable_selectManyOrCustom_serial { return this.state }
    get result(): Requestable_selectManyOrCustom_output { return this.state.values }
}

// 🅿️ list ==============================================================================
export type Requestable_list_input<T extends Requestable>  = ReqInput<{ element: () => T }>
export type Requestable_list_serial<T extends Requestable> = { type: 'list', active: true; items_: T['$Serial'][] }
export type Requestable_list_state<T extends Requestable>  = { type: 'list', active: true; items: T[] }
export type Requestable_list_output<T extends Requestable> = T['$Output'][]
export interface Requestable_list<T extends Requestable> extends IWidget<'list', Requestable_list_input<T>, Requestable_list_serial<T>, Requestable_list_state<T>, Requestable_list_output<T>> {}
export class Requestable_list<T extends Requestable> implements IRequest<'list', Requestable_list_input<T>, Requestable_list_serial<T>, Requestable_list_state<T>, Requestable_list_output<T>> {
    type = 'list' as const
    state: Requestable_list_state<T>
    private _reference: T
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Requestable_list_input<T>,
        serial?: Requestable_list_serial<T>,
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
    get serial(): Requestable_list_serial<T> {
        const items_ = this.state.items.map((i) => i.serial)
        return { type: 'list', active: this.state.active, items_ }
    }
    get result(): Requestable_list_output<T> { return this.state.items.map((i) => i.result) }
    addItem() {
        // const _ref = this._reference
        // const newItem = this.builder.HYDRATE(_ref.type, _ref.input)
        this.state.items.push(this.input.element())
    }
}

// 🅿️ group ==============================================================================
export type Requestable_group_input <T extends { [key: string]: Requestable }> = ReqInput<{ items: () => T }>
export type Requestable_group_serial<T extends { [key: string]: Requestable }> = { type: 'group', active: true; values_: {[k in keyof T]: T[k]['$Serial']}, collapsed?: boolean }
export type Requestable_group_state <T extends { [key: string]: Requestable }> = { type: 'group', active: true; values: T, collapsed?: boolean }
export type Requestable_group_output<T extends { [key: string]: Requestable }> = { [k in keyof T]: ReqResult<T[k]> }
export interface Requestable_group<T extends { [key: string]: Requestable }> extends IWidget<'group', Requestable_group_input<T>, Requestable_group_serial<T>, Requestable_group_state<T>, Requestable_group_output<T>> {}
export class Requestable_group<T extends { [key: string]: Requestable }> implements IRequest<'group', Requestable_group_input<T>, Requestable_group_serial<T>, Requestable_group_state<T>, Requestable_group_output<T>> {
    type = 'group' as const
    state: Requestable_group_state<T>
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Requestable_group_input<T>,
        serial?: Requestable_group_serial<T>,
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
    get serial(): Requestable_group_serial<T> {
        const values_: { [key: string]: any } = {}
        for (const key in this.state.values) values_[key] = this.state.values[key].serial
        return { type: 'group', active: this.state.active, values_: values_ as any, collapsed: this.state.collapsed }
    }
    get result(): Requestable_group_output<T> {
        const out: { [key: string]: any } = {}
        for (const key in this.state.values) {
            out[key] = this.state.values[key].result
        }
        return out as any
    }
}

// 🅿️ groupOpt ==============================================================================
export type Requestable_groupOpt_input <T extends { [key: string]: Requestable }> = ReqInput<{ default?: boolean; items: () => T }>
export type Requestable_groupOpt_serial<T extends { [key: string]: Requestable }> = { type: 'groupOpt', active: boolean; values_: {[K in keyof T]: T[K]['$Serial']}, collapsed?: boolean }
export type Requestable_groupOpt_state <T extends { [key: string]: Requestable }> = { type: 'groupOpt', active: boolean; values: T, collapsed?: boolean }
export type Requestable_groupOpt_output<T extends { [key: string]: Requestable }> = Maybe<{ [k in keyof T]: ReqResult<T[k]> }>
export interface Requestable_groupOpt<T extends { [key: string]: Requestable }> extends IWidget<'groupOpt', Requestable_groupOpt_input<T>, Requestable_groupOpt_serial<T>, Requestable_groupOpt_state<T>, Requestable_groupOpt_output<T>> {}
export class Requestable_groupOpt<T extends { [key: string]: Requestable }> implements IRequest<'groupOpt', Requestable_groupOpt_input<T>, Requestable_groupOpt_serial<T>, Requestable_groupOpt_state<T>, Requestable_groupOpt_output<T>> {
    type = 'groupOpt' as const
    state: Requestable_groupOpt_state<T>
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Requestable_groupOpt_input<T>,
        serial?: Requestable_groupOpt_serial<T>,
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
    get serial(): Requestable_groupOpt_serial<T> {
        const out: { [key: string]: any } = {}
        for (const key in this.state.values) out[key] = this.state.values[key].serial
        return { type: 'groupOpt', active: this.state.active, values_: out as any, collapsed: this.state.collapsed }
    }
    get result(): Requestable_groupOpt_output<T> {
        if (!this.state.active) return undefined
        const out: { [key: string]: any } = {}
        for (const key in this.state.values) {
            out[key] = this.state.values[key].result
        }
        return out as any
    }
}

// 🅿️ choice ==============================================================================
export type Requestable_choice_input <T extends { [key: string]: Requestable }> = ReqInput<{ default?: keyof T; items: () => T }>
export type Requestable_choice_serial<T extends { [key: string]: Requestable }> = { type: 'choice', active: boolean; pick: keyof T & string, values_: {[K in keyof T]: T[K]['$Serial']}, collapsed?: boolean }
export type Requestable_choice_state <T extends { [key: string]: Requestable }> = { type: 'choice', active: boolean; pick: keyof T & string, values: T, collapsed?: boolean }
export type Requestable_choice_output<T extends { [key: string]: Requestable }> = ReqResult<T[keyof T]>
export interface Requestable_choice  <T extends { [key: string]: Requestable }> extends    IWidget<'choice',  Requestable_choice_input<T>, Requestable_choice_serial<T>, Requestable_choice_state<T>, Requestable_choice_output<T>> {}
export class Requestable_choice      <T extends { [key: string]: Requestable }> implements IRequest<'choice', Requestable_choice_input<T>, Requestable_choice_serial<T>, Requestable_choice_state<T>, Requestable_choice_output<T>> {
    type = 'choice' as const
    state: Requestable_choice_state<T>
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Requestable_choice_input<T>,
        serial?: Requestable_choice_serial<T>,
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
    get serial(): Requestable_choice_serial<T> {
        const out: { [key: string]: any } = {}
        for (const key in this.state.values) out[key] = this.state.values[key].serial
        return { type: 'choice', active: this.state.active, values_: out as any, collapsed: this.state.collapsed, pick: this.state.pick }
    }
    get result(): Requestable_choice_output<T> {
        // @ts-ignore
        if (!this.state.active) return undefined
        // @ts-ignore
        if (this.state.pick==null)return undefined

        return this.state.values[this.state.pick].result
    }
}


// 🅿️ choices ==============================================================================
export type Requestable_choices_input <T extends { [key: string]: Requestable }> = ReqInput<{ items: () => T, defaultActiveBranches?: {[k in keyof T]?: boolean}  }>
export type Requestable_choices_serial<T extends { [key: string]: Requestable }> = { type: 'choices', active: true; branches: {[k in keyof T]?: boolean}, values_: {[k in keyof T]: T[k]['$Serial']}, collapsed?: boolean }
export type Requestable_choices_state <T extends { [key: string]: Requestable }> = { type: 'choices', active: true; branches: {[k in keyof T]?: boolean}, values: T, collapsed?: boolean }
export type Requestable_choices_output<T extends { [key: string]: Requestable }> = { [k in keyof T]?: ReqResult<T[k]> }
export interface Requestable_choices<T extends { [key: string]: Requestable }> extends IWidget<'choices', Requestable_choices_input<T>, Requestable_choices_serial<T>, Requestable_choices_state<T>, Requestable_choices_output<T>> {}
export class Requestable_choices<T extends { [key: string]: Requestable }> implements IRequest<'choices', Requestable_choices_input<T>, Requestable_choices_serial<T>, Requestable_choices_state<T>, Requestable_choices_output<T>> {
    type = 'choices' as const
    state: Requestable_choices_state<T>
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Requestable_choices_input<T>,
        serial?: Requestable_choices_serial<T>,
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
    get serial(): Requestable_choices_serial<T> {
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
    get result(): Requestable_choices_output<T> {
        const out: { [key: string]: any } = {}
        for (const key in this.state.values) {
            if (this.state.branches[key] !== true) continue
            out[key] = this.state.values[key].result
        }
        return out as any
    }
}

// 🅿️ enum ==============================================================================
export type Requestable_enum_input<T extends KnownEnumNames> = ReqInput<{ default?: Requirable[T]; enumName: T }>
export type Requestable_enum_serial<T extends KnownEnumNames> = Requestable_enum_state<T>
export type Requestable_enum_state<T extends KnownEnumNames> = { type: 'enum', active: true; val: Requirable[T] }
export type Requestable_enum_output<T extends KnownEnumNames> = Requirable[T]
export interface Requestable_enum<T extends KnownEnumNames> extends IWidget<'enum', Requestable_enum_input<T>, Requestable_enum_serial<T>, Requestable_enum_state<T>, Requestable_enum_output<T>> {}
export class Requestable_enum<T extends KnownEnumNames> implements IRequest<'enum', Requestable_enum_input<T>, Requestable_enum_serial<T>, Requestable_enum_state<T>, Requestable_enum_output<T>> {
    type = 'enum' as const
    state: Requestable_enum_state<T>
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Requestable_enum_input<T>,
        serial?: Requestable_enum_serial<T>,
    ) {
        const possibleValues = this.schema.knownEnumsByName.get(input.enumName)?.values ?? []
        this.state = serial ?? {
            type: 'enum',
            active: true,
            val: input.default ?? (possibleValues[0] as any) /* 🔴 */,
        }
        makeAutoObservable(this)
    }
    get serial(): Requestable_enum_serial<T> { return this.state }
    get result(): Requestable_enum_output<T> { return this.state.val }
}

// 🅿️ enumOpt ==============================================================================
export type Requestable_enumOpt_input<T extends KnownEnumNames> = ReqInput<{ default?: Requirable[T]; enumName: T }>
export type Requestable_enumOpt_serial<T extends KnownEnumNames> = Requestable_enumOpt_state<T>
export type Requestable_enumOpt_state<T extends KnownEnumNames> = { type: 'enumOpt', active: boolean; val: Requirable[T] }
export type Requestable_enumOpt_output<T extends KnownEnumNames> = Maybe<Requirable[T]>
export interface Requestable_enumOpt<T extends KnownEnumNames> extends IWidget<'enumOpt', Requestable_enumOpt_input<T>, Requestable_enumOpt_serial<T>, Requestable_enumOpt_state<T>, Requestable_enumOpt_output<T>> {}
export class Requestable_enumOpt<T extends KnownEnumNames> implements IRequest<'enumOpt', Requestable_enumOpt_input<T>, Requestable_enumOpt_serial<T>, Requestable_enumOpt_state<T>, Requestable_enumOpt_output<T>> {
    type = 'enumOpt' as const
    state: Requestable_enumOpt_state<T>
    constructor(
        public builder: FormBuilder,
        public schema: SchemaL,
        public input: Requestable_enumOpt_input<T>,
        serial?: Requestable_enumOpt_serial<T>,
    ) {
        const possibleValues = this.schema.knownEnumsByName.get(input.enumName)?.values ?? []
        this.state = serial ?? {
            type: 'enumOpt',
            active: input.default != null,
            val: input.default ?? (possibleValues[0] as any) /* 🔴 */,
        }
        makeAutoObservable(this)
    }
    get serial(): Requestable_enumOpt_serial<T> { return this.state }
    get result(): Requestable_enumOpt_output<T> {
        if (!this.state.active) return undefined
        return this.state.val
    }
}


// prettier-ignore
export class FormBuilder {
    constructor(public schema: SchemaL) {}

    // 🔴 untyped internals there
    HYDRATE =(type: Requestable['type'], input: any, serial?: any ): any => {
        if (type === 'bool')               return new Requestable_bool               (this, this.schema, input, serial)
        if (type === 'str')                return new Requestable_str                (this, this.schema, input, serial)
        if (type === 'strOpt')             return new Requestable_strOpt             (this, this.schema, input, serial)
        if (type === 'int')                return new Requestable_int                (this, this.schema, input, serial)
        if (type === 'seed')               return new Requestable_seed               (this, this.schema, input, serial)
        if (type === 'intOpt')             return new Requestable_intOpt             (this, this.schema, input, serial)
        if (type === 'float')              return new Requestable_float              (this, this.schema, input, serial)
        if (type === 'floatOpt')           return new Requestable_floatOpt           (this, this.schema, input, serial)
        if (type === 'matrix')             return new Requestable_matrix             (this, this.schema, input, serial)
        if (type === 'prompt')             return new Requestable_prompt             (this, this.schema, input, serial)
        if (type === 'promptOpt')          return new Requestable_promptOpt          (this, this.schema, input, serial)
        if (type === 'loras')              return new Requestable_loras              (this, this.schema, input, serial)
        if (type === 'image')              return new Requestable_image              (this, this.schema, input, serial)
        if (type === 'imageOpt')           return new Requestable_imageOpt           (this, this.schema, input, serial)
        if (type === 'selectOneOrCustom')  return new Requestable_selectOneOrCustom  (this, this.schema, input, serial)
        if (type === 'selectManyOrCustom') return new Requestable_selectManyOrCustom (this, this.schema, input, serial)
        if (type === 'enum')               return new Requestable_enum               (this, this.schema, input, serial)
        if (type === 'enumOpt')            return new Requestable_enumOpt            (this, this.schema, input, serial)
        if (type === 'list')               return new Requestable_list               (this, this.schema, input, serial)
        if (type === 'groupOpt')           return new Requestable_groupOpt           (this, this.schema, input, serial)
        if (type === 'group')              return new Requestable_group              (this, this.schema, input, serial)
        if (type === 'selectOne')          return new Requestable_selectOne          (this, this.schema, input, serial)
        if (type === 'selectMany')         return new Requestable_selectMany         (this, this.schema, input, serial)
        if (type === 'size')               return new Requestable_size               (this, this.schema, input, serial)
        if (type === 'color')              return new Requestable_color              (this, this.schema, input, serial)
        if (type === 'choice')             return new Requestable_choice             (this, this.schema, input, serial)
        if (type === 'choices')            return new Requestable_choices            (this, this.schema, input, serial)
        console.log(`🔴 unknown type ${type}`)
        exhaust(type)
    }


    // autoUI          =                                                  (p: Requestable_str_input                , serial?: Requestable_str_serial                ) => new Requestable_str                 (this, this.schema, p, serial)
    string             =                                                  (p: Requestable_str_input                , serial?: Requestable_str_serial                ) => new Requestable_str                 (this, this.schema, p, serial)
    color              =                                                  (p: Requestable_color_input              , serial?: Requestable_color_serial              ) => new Requestable_color               (this, this.schema, p, serial)
    stringOpt          =                                                  (p: Requestable_strOpt_input             , serial?: Requestable_strOpt_serial             ) => new Requestable_strOpt              (this, this.schema, p, serial)
    str                =                                                  (p: Requestable_str_input                , serial?: Requestable_str_serial                ) => new Requestable_str                 (this, this.schema, p, serial)
    strOpt             =                                                  (p: Requestable_strOpt_input             , serial?: Requestable_strOpt_serial             ) => new Requestable_strOpt              (this, this.schema, p, serial)
    prompt             =                                                  (p: Requestable_prompt_input             , serial?: Requestable_prompt_serial             ) => new Requestable_prompt              (this, this.schema, p, serial)
    promptOpt          =                                                  (p: Requestable_promptOpt_input          , serial?: Requestable_promptOpt_serial          ) => new Requestable_promptOpt           (this, this.schema, p, serial)
    seed               =                                                 (p: Requestable_seed_input                , serial?: Requestable_seed_serial               ) => new Requestable_seed                (this, this.schema, p, serial)
    int                =                                                  (p: Requestable_int_input                , serial?: Requestable_int_serial                ) => new Requestable_int                 (this, this.schema, p, serial)
    intOpt             =                                                  (p: Requestable_intOpt_input             , serial?: Requestable_intOpt_serial             ) => new Requestable_intOpt              (this, this.schema, p, serial)
    float              =                                                  (p: Requestable_float_input              , serial?: Requestable_float_serial              ) => new Requestable_float               (this, this.schema, p, serial)
    floatOpt           =                                                  (p: Requestable_floatOpt_input           , serial?: Requestable_floatOpt_serial           ) => new Requestable_floatOpt            (this, this.schema, p, serial)
    number             =                                                  (p: Requestable_float_input              , serial?: Requestable_float_serial              ) => new Requestable_float               (this, this.schema, p, serial)
    numberOpt          =                                                  (p: Requestable_floatOpt_input           , serial?: Requestable_floatOpt_serial           ) => new Requestable_floatOpt            (this, this.schema, p, serial)
    matrix             =                                                  (p: Requestable_matrix_input             , serial?: Requestable_matrix_serial             ) => new Requestable_matrix              (this, this.schema, p, serial)
    boolean            =                                                  (p: Requestable_bool_input               , serial?: Requestable_bool_serial               ) => new Requestable_bool                (this, this.schema, p, serial)
    bool               =                                                  (p: Requestable_bool_input               , serial?: Requestable_bool_serial               ) => new Requestable_bool                (this, this.schema, p, serial)
    loras              =                                                  (p: Requestable_loras_input              , serial?: Requestable_loras_serial              ) => new Requestable_loras               (this, this.schema, p, serial)
    image              =                                                  (p: Requestable_image_input              , serial?: Requestable_image_serial              ) => new Requestable_image               (this, this.schema, p, serial)
    imageOpt           =                                                  (p: Requestable_imageOpt_input           , serial?: Requestable_imageOpt_serial           ) => new Requestable_imageOpt            (this, this.schema, p, serial)
    selectOneOrCustom  =                                                  (p: Requestable_selectOneOrCustom_input  , serial?: Requestable_selectOneOrCustom_serial  ) => new Requestable_selectOneOrCustom   (this, this.schema, p, serial)
    selectManyOrCustom =                                                  (p: Requestable_selectManyOrCustom_input , serial?: Requestable_selectManyOrCustom_serial ) => new Requestable_selectManyOrCustom  (this, this.schema, p, serial)
    enum               = <const T extends KnownEnumNames>                 (p: Requestable_enum_input<T>            , serial?: Requestable_enum_serial<T>            ) => new Requestable_enum                (this, this.schema, p, serial)
    enumOpt            = <const T extends KnownEnumNames>                 (p: Requestable_enumOpt_input<T>         , serial?: Requestable_enumOpt_serial<T>         ) => new Requestable_enumOpt             (this, this.schema, p, serial)
    list               = <const T extends Requestable>                    (p: Requestable_list_input<T>            , serial?: Requestable_list_serial<T>            ) => new Requestable_list                (this, this.schema, p, serial)
    groupOpt           = <const T extends { [key: string]: Requestable }> (p: Requestable_groupOpt_input<T>        , serial?: Requestable_groupOpt_serial<T>        ) => new Requestable_groupOpt            (this, this.schema, p, serial)
    group              = <const T extends { [key: string]: Requestable }> (p: Requestable_group_input<T>           , serial?: Requestable_group_serial<T>           ) => new Requestable_group               (this, this.schema, p, serial)
    selectOne          = <const T extends { type: string}>                (p: Requestable_selectOne_input<T>       , serial?: Requestable_selectOne_serial<T>       ) => new Requestable_selectOne           (this, this.schema, p, serial)
    selectMany         = <const T extends { type: string}>                (p: Requestable_selectMany_input<T>      , serial?: Requestable_selectMany_serial<T>      ) => new Requestable_selectMany          (this, this.schema, p, serial)
    choice             = <const T extends { [key: string]: Requestable }> (p: Requestable_choice_input<T>          , serial?: Requestable_choice_serial<T>          ) => new Requestable_choice              (this, this.schema, p, serial)
    choices            = <const T extends { [key: string]: Requestable }> (p: Requestable_choices_input<T>         , serial?: Requestable_choices_serial<T>         ) => new Requestable_choices             (this, this.schema, p, serial)
}
