/**
 * this file is an attempt to centralize core widget definition in a single
 * file so it's easy to add any widget in the future
 */
import type { CELL } from 'src/front/ui/widgets/WidgetMatrixUI'
import type { SchemaL } from 'src/models/Schema'
import type { SimplifiedLoraDef } from 'src/presets/SimplifiedLoraDef'
import type { WidgetPromptOutput } from 'src/prompter/WidgetPromptUI'
import type { PossibleSerializedNodes } from 'src/prompter/plugins/CushyDebugPlugin'
import type { AspectRatio, CushySize, CushySizeByRatio, ImageAnswer, ImageAnswerForm, SDModelType } from './misc/InfoAnswer'

import { makeAutoObservable } from 'mobx'

export type Widget<
    // unique identifier
    Type extends string,
    State extends object,
    Result,
    Extra,
> = {
    type: Type
    label?: string
    group?: string
    tooltip?: string
    $Result: Result
    $State: State & { type: Type }
} & Extra

export type ReqResult<Req> = Req extends IWidget<any, any, infer O> ? O : never
export type ReqState<Req> = Req extends IWidget<any, infer S, any> ? S : never
// injected
export type IWidget<I, S, O> = { $Input: I; $State: S; $Output: O }
// must complyto
export type IRequestable<I, S, O> = {
    state: S
    readonly result: O
}

export type ReqInput<X> = X & {
    label?: string
    group?: string
    tooltip?: string
    i18n?: { [key: string]: string }
}

// 🅿️ str ==============================================================================

export type Requestable_str_input = ReqInput<{ default?: string; textarea?: boolean }>
export type Requestable_str_state = { active: true; val: string }
export type Requestable_str_output = string
export interface Requestable_str extends IWidget<Requestable_str_input, Requestable_str_state, Requestable_str_output> {}
export class Requestable_str implements IRequestable<Requestable_str_input, Requestable_str_state, Requestable_str_output> {
    type = 'str'
    constructor(
        public schema: SchemaL,
        public input: Requestable_str_input,
        public prevState?: Requestable_str_state,
    ) {
        this.state = prevState ?? { active: true, val: input.default ?? '' }
        makeAutoObservable(this)
    }
    state: Requestable_str_state
    get result(): Requestable_str_output {
        return this.state.val
    }
}

// 🅿️ strOpt ==============================================================================

export type Requestable_strOpt_input = ReqInput<{ default?: string; textarea?: boolean }>
export type Requestable_strOpt_state = { active: boolean; val: string }
export type Requestable_strOpt_output = Maybe<string>
export interface Requestable_strOpt
    extends IWidget<Requestable_strOpt_input, Requestable_strOpt_state, Requestable_strOpt_output> {}
export class Requestable_strOpt
    implements IRequestable<Requestable_strOpt_input, Requestable_strOpt_state, Requestable_strOpt_output>
{
    type = 'str?'
    constructor(
        public schema: SchemaL,
        public input: Requestable_strOpt_input,
        public prevState?: Requestable_strOpt_state,
    ) {
        this.state = prevState ?? {
            active: input.default != null,
            val: input.default ?? '',
        }
        makeAutoObservable(this)
    }
    state: Requestable_strOpt_state
    get result(): Requestable_strOpt_output {
        if (!this.state.active) return undefined
        return this.state.val
    }
}

// 🅿️ prompt ==============================================================================

export type Requestable_prompt_input = ReqInput<{ /* 🟢 CUSTOM */ default?: string | WidgetPromptOutput }>
export type Requestable_prompt_state = WidgetPromptOutput<true>
export type Requestable_prompt_output = WidgetPromptOutput
export interface Requestable_prompt
    extends IWidget<Requestable_prompt_input, Requestable_prompt_state, Requestable_prompt_output> {}
export class Requestable_prompt
    implements IRequestable<Requestable_prompt_input, Requestable_prompt_state, Requestable_prompt_output>
{
    type = 'prompt'
    constructor(
        public schema: SchemaL,
        public input: Requestable_prompt_input,
        public prevState?: Requestable_prompt_state,
    ) {
        if (prevState) {
            this.state = prevState
        } else {
            this.state = { active: true, text: '', tokens: [] }

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
    state: Requestable_prompt_state
    get result(): Requestable_prompt_output {
        return this.state
    }
}

// 🅿️ promptOpt ==============================================================================

export type Requestable_promptOpt_input = ReqInput<{ /* 🟢 CUSTOM */ default?: string | PossibleSerializedNodes[] }>
export type Requestable_promptOpt_state = WidgetPromptOutput<boolean>
export type Requestable_promptOpt_output = Maybe<WidgetPromptOutput>
export interface Requestable_promptOpt
    extends IWidget<Requestable_promptOpt_input, Requestable_promptOpt_state, Requestable_promptOpt_output> {}
export class Requestable_promptOpt
    implements IRequestable<Requestable_promptOpt_input, Requestable_promptOpt_state, Requestable_promptOpt_output>
{
    type = 'prompt?'
    constructor(
        public schema: SchemaL,
        public input: Requestable_promptOpt_input,
        public prevState?: Requestable_promptOpt_state,
    ) {
        if (prevState) {
            this.state = prevState
        } else {
            this.state = { active: false, text: '', tokens: [] }
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
    state: Requestable_promptOpt_state
    get result(): Requestable_promptOpt_output {
        if (this.state.active === false) return undefined
        return this.state
    }
}

// 🅿️ int ==============================================================================

export type Requestable_int_input = ReqInput<{ default?: number; min?: number; max?: number }>
export type Requestable_int_state = { active: true; val: number }
export type Requestable_int_output = number
export interface Requestable_int extends IWidget<Requestable_int_input, Requestable_int_state, Requestable_int_output> {}
export class Requestable_int implements IRequestable<Requestable_int_input, Requestable_int_state, Requestable_int_output> {
    type = 'int'
    constructor(
        public schema: SchemaL,
        public input: Requestable_int_input,
        public prevState?: Requestable_int_state,
    ) {
        this.state = prevState ?? { active: true, val: input.default ?? 0 }
        makeAutoObservable(this)
    }
    state: Requestable_int_state
    get result(): Requestable_int_output {
        return this.state.val
    }
}

// 🅿️ float ==============================================================================

export type Requestable_float_input = ReqInput<{ default?: number; min?: number; max?: number }>
export type Requestable_float_state = { active: true; val: number }
export type Requestable_float_output = number
export interface Requestable_float extends IWidget<Requestable_float_input, Requestable_float_state, Requestable_float_output> {}
export class Requestable_float
    implements IRequestable<Requestable_float_input, Requestable_float_state, Requestable_float_output>
{
    type = 'float'
    constructor(
        public schema: SchemaL,
        public input: Requestable_float_input,
        public prevState?: Requestable_float_state,
    ) {
        this.state = prevState ?? { active: true, val: input.default ?? 0 }
        makeAutoObservable(this)
    }
    state: Requestable_float_state
    get result(): Requestable_float_output {
        return this.state.val
    }
}

// 🅿️ bool ==============================================================================

export type Requestable_bool_input = ReqInput<{ default?: boolean }>
export type Requestable_bool_state = { active: true; val: boolean }
export type Requestable_bool_output = boolean
export interface Requestable_bool extends IWidget<Requestable_bool_input, Requestable_bool_state, Requestable_bool_output> {}
export class Requestable_bool implements IRequestable<Requestable_bool_input, Requestable_bool_state, Requestable_bool_output> {
    type = 'bool'
    constructor(
        public schema: SchemaL,
        public input: Requestable_bool_input,
        public prevState?: Requestable_bool_state,
    ) {
        this.state = prevState ?? { active: true, val: input.default ?? false }
        makeAutoObservable(this)
    }
    state: Requestable_bool_state
    get result(): Requestable_bool_output {
        return this.state.val
    }
}

// 🅿️ intOpt ==============================================================================

export type Requestable_intOpt_input = ReqInput<{ default?: number }>
export type Requestable_intOpt_state = { active: boolean; val: number }
export type Requestable_intOpt_output = Maybe<number>
export interface Requestable_intOpt
    extends IWidget<Requestable_intOpt_input, Requestable_intOpt_state, Requestable_intOpt_output> {}
export class Requestable_intOpt
    implements IRequestable<Requestable_intOpt_input, Requestable_intOpt_state, Requestable_intOpt_output>
{
    type = 'int?'
    constructor(
        public schema: SchemaL,
        public input: Requestable_intOpt_input,
        public prevState?: Requestable_intOpt_state,
    ) {
        this.state = prevState ?? {
            active: input.default != null,
            val: input.default ?? 0,
        }
        makeAutoObservable(this)
    }
    state: Requestable_intOpt_state
    get result(): Requestable_intOpt_output {
        if (this.state.active === false) return undefined
        return this.state.val
    }
}

// 🅿️ floatOpt ==============================================================================

export type Requestable_floatOpt_input = ReqInput<{ default?: number }>
export type Requestable_floatOpt_state = { active: boolean; val: number }
export type Requestable_floatOpt_output = Maybe<number>
export interface Requestable_floatOpt
    extends IWidget<Requestable_floatOpt_input, Requestable_floatOpt_state, Requestable_floatOpt_output> {}
export class Requestable_floatOpt
    implements IRequestable<Requestable_floatOpt_input, Requestable_floatOpt_state, Requestable_floatOpt_output>
{
    type = 'float?'
    constructor(
        public schema: SchemaL,
        public input: Requestable_floatOpt_input,
        public prevState?: Requestable_floatOpt_state,
    ) {
        this.state = prevState ?? {
            active: input.default != null,
            val: input.default ?? 0,
        }
        makeAutoObservable(this)
    }
    state: Requestable_floatOpt_state
    get result(): Requestable_floatOpt_output {
        if (this.state.active === false) return undefined
        return this.state.val
    }
}

// 🅿️ boolOpt ==============================================================================

export type Requestable_boolOpt_input = ReqInput<{ default?: boolean }>
export type Requestable_boolOpt_state = { active: boolean; val: boolean }
export type Requestable_boolOpt_output = Maybe<boolean>
export interface Requestable_boolOpt
    extends IWidget<Requestable_boolOpt_input, Requestable_boolOpt_state, Requestable_boolOpt_output> {}
export class Requestable_boolOpt
    implements IRequestable<Requestable_boolOpt_input, Requestable_boolOpt_state, Requestable_boolOpt_output>
{
    type = 'bool?'
    constructor(
        public schema: SchemaL,
        public input: Requestable_boolOpt_input,
        public prevState?: Requestable_boolOpt_state,
    ) {
        this.state = prevState ?? {
            active: input.default != null,
            val: input.default ?? false,
        }
        makeAutoObservable(this)
    }
    state: Requestable_boolOpt_state
    get result(): Requestable_boolOpt_output {
        if (this.state.active === false) return undefined
        return this.state.val
    }
}

// 🅿️ size ==============================================================================

export type Requestable_size_input = ReqInput<{ default?: CushySizeByRatio }>
export type Requestable_size_state = CushySize
export type Requestable_size_output = CushySize
export interface Requestable_size extends IWidget<Requestable_size_input, Requestable_size_state, Requestable_size_output> {}
export class Requestable_size implements IRequestable<Requestable_size_input, Requestable_size_state, Requestable_size_output> {
    type = 'size'
    constructor(
        public schema: SchemaL,
        public input: Requestable_size_input,
        public prevState?: Requestable_size_state,
    ) {
        if (prevState) {
            this.state = prevState
        } else {
            const aspectRatio: AspectRatio = input.default?.aspectRatio ?? '1:1'
            const modelType: SDModelType = input.default?.modelType ?? 'SD1.5 512'
            const width = 512 // 🔴
            const height = 512 // 🔴
            this.state = {
                aspectRatio,
                modelType,
                height,
                width,
            }
        }
        makeAutoObservable(this)
    }
    state: Requestable_size_state
    get result(): Requestable_size_output {
        return this.state
    }
}

// 🅿️ matrix ==============================================================================

export type Requestable_matrix_input = ReqInput<{
    /* 🟢 CUSOM */ default?: { row: string; col: string }[]
    rows: string[]
    cols: string[]
}>
export type Requestable_matrix_state = { active: true; selected: CELL[] }
export type Requestable_matrix_output = CELL[]
export interface Requestable_matrix
    extends IWidget<Requestable_matrix_input, Requestable_matrix_state, Requestable_matrix_output> {}
export class Requestable_matrix
    implements IRequestable<Requestable_matrix_input, Requestable_matrix_state, Requestable_matrix_output>
{
    type = 'matrix'
    constructor(
        public schema: SchemaL,
        public input: Requestable_matrix_input,
        public prevState?: Requestable_matrix_state,
    ) {
        this.state = prevState ?? { active: true, selected: [] } // 🔴
        makeAutoObservable(this)
    }
    state: Requestable_matrix_state
    get result(): Requestable_matrix_output {
        // if (!this.state.active) return undefined
        return this.state.selected
    }
}

// 🅿️ loras ==============================================================================

export type Requestable_loras_input = ReqInput<{ default?: SimplifiedLoraDef[] }>
export type Requestable_loras_state = { active: true; loras: SimplifiedLoraDef[] }
export type Requestable_loras_output = SimplifiedLoraDef[]
export interface Requestable_loras extends IWidget<Requestable_loras_input, Requestable_loras_state, Requestable_loras_output> {}
export class Requestable_loras
    implements IRequestable<Requestable_loras_input, Requestable_loras_state, Requestable_loras_output>
{
    type = 'loras'
    constructor(
        public schema: SchemaL,
        public input: Requestable_loras_input,
        public prevState?: Requestable_loras_state,
    ) {
        this.state = prevState ?? { active: true, loras: input.default ?? [] }
        makeAutoObservable(this)
    }
    state: Requestable_loras_state
    get result(): Requestable_loras_output {
        return this.state.loras
    }
}

// 🅿️ image ==============================================================================

export type Requestable_image_input = ReqInput<{ default?: ImageAnswer }>
export type Requestable_image_state = ImageAnswerForm<true>
export type Requestable_image_output = ImageAnswer
export interface Requestable_image extends IWidget<Requestable_image_input, Requestable_image_state, Requestable_image_output> {}
export class Requestable_image
    implements IRequestable<Requestable_image_input, Requestable_image_state, Requestable_image_output>
{
    type = 'image'
    constructor(
        public schema: SchemaL,
        public input: Requestable_image_input,
        public prevState?: Requestable_image_state,
    ) {
        this.state = prevState ?? {
            active: true,
            comfy: input.default?.type === 'ComfyImage' ? input.default : { imageName: 'example.png', type: 'ComfyImage' },
            cushy: input.default?.type === 'CushyImage' ? input.default : null,
            pick: input.default?.type === 'CushyImage' ? 'cushy' : 'comfy',
        }
        makeAutoObservable(this)
    }
    state: Requestable_image_state
    get result(): Requestable_image_output {
        if (this.state.pick === 'cushy' && this.state.cushy) return this.state.cushy
        return this.state.comfy
    }
}

// 🅿️ imageOpt ==============================================================================

export type Requestable_imageOpt_input = ReqInput<{ default?: ImageAnswer }>
export type Requestable_imageOpt_state = ImageAnswerForm<boolean>
export type Requestable_imageOpt_output = Maybe<ImageAnswer>
export interface Requestable_imageOpt
    extends IWidget<Requestable_imageOpt_input, Requestable_imageOpt_state, Requestable_imageOpt_output> {}
export class Requestable_imageOpt
    implements IRequestable<Requestable_imageOpt_input, Requestable_imageOpt_state, Requestable_imageOpt_output>
{
    type = 'image?'
    constructor(
        public schema: SchemaL,
        public input: Requestable_imageOpt_input,
        public prevState?: Requestable_imageOpt_state,
    ) {
        this.state = prevState ?? {
            active: input.default ? true : false,
            comfy: input.default?.type === 'ComfyImage' ? input.default : { imageName: 'example.png', type: 'ComfyImage' },
            cushy: input.default?.type === 'CushyImage' ? input.default : null,
            pick: input.default?.type === 'CushyImage' ? 'cushy' : 'comfy',
        }
        makeAutoObservable(this)
    }
    state: Requestable_imageOpt_state
    get result(): Requestable_imageOpt_output {
        if (!this.state.active) return undefined
        if (this.state.pick === 'cushy' && this.state.cushy) return this.state.cushy
        return this.state.comfy
    }
}

// 🅿️ selectOne ==============================================================================

export type Requestable_selectOne_input<T> = ReqInput<{ default?: T; choices: T[] }>
export type Requestable_selectOne_state<T> = { query: string; val: T }
export type Requestable_selectOne_output<T> = T
export interface Requestable_selectOne<T>
    extends IWidget<Requestable_selectOne_input<T>, Requestable_selectOne_state<T>, Requestable_selectOne_output<T>> {}
export class Requestable_selectOne<T>
    implements IRequestable<Requestable_selectOne_input<T>, Requestable_selectOne_state<T>, Requestable_selectOne_output<T>>
{
    type = 'selectOne'
    constructor(
        public schema: SchemaL,
        public input: Requestable_selectOne_input<T>,
        public prevState?: Requestable_selectOne_state<T>,
    ) {
        this.state = prevState ?? {
            query: '',
            val: input.default ?? input.choices[0],
        }
        makeAutoObservable(this)
    }
    state: Requestable_selectOne_state<T>
    get result(): Requestable_selectOne_output<T> {
        return this.state.val
    }
}

// 🅿️ selectOneOrCustom ==============================================================================

export type Requestable_selectOneOrCustom_input = ReqInput<{ default?: string; choices: string[] }>
export type Requestable_selectOneOrCustom_state = { query: string; val: string }
export type Requestable_selectOneOrCustom_output = string
export interface Requestable_selectOneOrCustom
    extends IWidget<
        Requestable_selectOneOrCustom_input,
        Requestable_selectOneOrCustom_state,
        Requestable_selectOneOrCustom_output
    > {}
export class Requestable_selectOneOrCustom
    implements
        IRequestable<
            Requestable_selectOneOrCustom_input,
            Requestable_selectOneOrCustom_state,
            Requestable_selectOneOrCustom_output
        >
{
    type = 'selectOneOrCustom'
    constructor(
        public schema: SchemaL,
        public input: Requestable_selectOneOrCustom_input,
        public prevState?: Requestable_selectOneOrCustom_state,
    ) {
        this.state = prevState ?? {
            query: '',
            val: input.default ?? input.choices[0] ?? '',
        }
        makeAutoObservable(this)
    }
    state: Requestable_selectOneOrCustom_state
    get result(): Requestable_selectOneOrCustom_output {
        return this.state.val
    }
}

// 🅿️ selectMany ==============================================================================

export type Requestable_selectMany_input<T extends { type: string }> = ReqInput<{ default?: T[]; choices: T[] }>
export type Requestable_selectMany_state<T extends { type: string }> = { query: string; values: T[] }
export type Requestable_selectMany_output<T extends { type: string }> = T[]
export interface Requestable_selectMany<T extends { type: string }>
    extends IWidget<Requestable_selectMany_input<T>, Requestable_selectMany_state<T>, Requestable_selectMany_output<T>> {}
export class Requestable_selectMany<T extends { type: string }>
    implements IRequestable<Requestable_selectMany_input<T>, Requestable_selectMany_state<T>, Requestable_selectMany_output<T>>
{
    type = 'selectMany'
    constructor(
        public schema: SchemaL,
        public input: Requestable_selectMany_input<T>,
        public prevState?: Requestable_selectMany_state<T>,
    ) {
        this.state = prevState ?? {
            query: '',
            values: input.default ?? [],
        }
        makeAutoObservable(this)
    }
    state: Requestable_selectMany_state<T>
    get result(): Requestable_selectMany_output<T> {
        return this.state.values
    }
}

// 🅿️ selectManyOrCustom ==============================================================================

export type Requestable_selectManyOrCustom_input = ReqInput<{ default?: string[]; choices: string[] }>
export type Requestable_selectManyOrCustom_state = { query: string; values: string[] }
export type Requestable_selectManyOrCustom_output = string[]
export interface Requestable_selectManyOrCustom
    extends IWidget<
        Requestable_selectManyOrCustom_input,
        Requestable_selectManyOrCustom_state,
        Requestable_selectManyOrCustom_output
    > {}
export class Requestable_selectManyOrCustom
    implements
        IRequestable<
            Requestable_selectManyOrCustom_input,
            Requestable_selectManyOrCustom_state,
            Requestable_selectManyOrCustom_output
        >
{
    type = 'selectManyOrCustom'
    constructor(
        public schema: SchemaL,
        public input: Requestable_selectManyOrCustom_input,
        public prevState?: Requestable_selectManyOrCustom_state,
    ) {
        this.state = prevState ?? {
            query: '',
            values: input.default ?? [],
        }
        makeAutoObservable(this)
    }
    state: Requestable_selectManyOrCustom_state
    get result(): Requestable_selectManyOrCustom_output {
        return this.state.values
    }
}

// 🅿️ list ==============================================================================

export type Requestable_list_input<T extends Requestable> = ReqInput<{ /* 🟢 NO DEFAULT */ mkItem: (ix: number) => T }>
export type Requestable_list_state<T extends Requestable> = { active: true; items: T[] }
export type Requestable_list_output<T extends Requestable> = T['$Output'][]
export interface Requestable_list<T extends Requestable>
    extends IWidget<Requestable_list_input<T>, Requestable_list_state<T>, Requestable_list_output<T>> {}

export class Requestable_list<T extends Requestable>
    implements IRequestable<Requestable_list_input<T>, Requestable_list_state<T>, Requestable_list_output<T>>
{
    type = 'list'
    constructor(
        public schema: SchemaL,
        public input: Requestable_list_input<T>,
        public prevState?: Requestable_list_state<T>,
    ) {
        // 🔴 prev state can't be an instance there
        this.state = prevState ?? {
            active: true,
            items: [],
        }
        makeAutoObservable(this)
    }
    state: Requestable_list_state<T>
    get result(): Requestable_list_output<T> {
        return this.state.items.map((i) => i.result)
    }
    addItem() {
        this.state.items.push(this.input.mkItem(this.state.items.length))
    }
}

// 🅿️ group ==============================================================================

export type Requestable_group_input<T extends { [key: string]: Requestable }> = ReqInput<{ items: T }>
export type Requestable_group_state<T extends { [key: string]: Requestable }> = {
    active: true
    values: T
}
export type Requestable_group_output<T extends { [key: string]: Requestable }> = { [k in keyof T]: ReqResult<T[k]> }
export interface Requestable_group<T>
    extends IWidget<Requestable_group_input<T>, Requestable_group_state<T>, Requestable_group_output<T>> {}
export class Requestable_group<T extends { [key: string]: Requestable }>
    implements IRequestable<Requestable_group_input<T>, Requestable_group_state<T>, Requestable_group_output<T>>
{
    type = 'items'
    constructor(
        public schema: SchemaL,
        public input: Requestable_group_input<T>,
        public prevState?: Requestable_group_state<T>,
    ) {
        this.state = prevState ?? {
            active: true,
            values: input.items,
        }
        makeAutoObservable(this)
    }
    state: Requestable_group_state<T>
    get result(): Requestable_group_output<T> {
        const out: { [key: string]: any } = {}
        for (const key in this.state.values) {
            out[key] = this.state.values[key].result
        }
        return out as any
    }
}

// 🅿️ groupOpt ==============================================================================

export type Requestable_groupOpt_input<T extends { [key: string]: Requestable }> = ReqInput<{ default?: boolean; items: T }>
export type Requestable_groupOpt_state<T extends { [key: string]: Requestable }> = {
    active: boolean
    values: T
}
export type Requestable_groupOpt_output<T extends { [key: string]: Requestable }> = Maybe<{ [k in keyof T]: ReqResult<T[k]> }>

export interface Requestable_groupOpt<T>
    extends IWidget<Requestable_groupOpt_input<T>, Requestable_groupOpt_state<T>, Requestable_groupOpt_output<T>> {}
export class Requestable_groupOpt<T extends { [key: string]: Requestable }>
    implements IRequestable<Requestable_groupOpt_input<T>, Requestable_groupOpt_state<T>, Requestable_groupOpt_output<T>>
{
    type = 'items?'
    constructor(
        public schema: SchemaL,
        public input: Requestable_groupOpt_input<T>,
        public prevState?: Requestable_groupOpt_state<T>,
    ) {
        this.state = prevState ?? {
            active: true,
            values: input.items,
        }
        makeAutoObservable(this)
    }
    state: Requestable_groupOpt_state<T>
    get result(): Requestable_groupOpt_output<T> {
        if (!this.state.active) return undefined
        const out: { [key: string]: any } = {}
        for (const key in this.state.values) {
            out[key] = this.state.values[key].result
        }
        return out as any
    }
}

// 🅿️ enum ==============================================================================

export type Requestable_enum_input<T extends KnownEnumNames> = ReqInput<{ default?: Requirable[T]; enumName: T }>
export type Requestable_enum_state<T extends KnownEnumNames> = { active: true; val: Requirable[T] }
export type Requestable_enum_output<T extends KnownEnumNames> = Requirable[T]
export interface Requestable_enum<T extends KnownEnumNames>
    extends IWidget<Requestable_enum_input<T>, Requestable_enum_state<T>, Requestable_enum_output<T>> {}
export class Requestable_enum<T extends KnownEnumNames>
    implements IRequestable<Requestable_enum_input<T>, Requestable_enum_state<T>, Requestable_enum_output<T>>
{
    type = 'enum'
    constructor(
        public schema: SchemaL,
        public input: Requestable_enum_input<T>,
        public prevState?: Requestable_enum_state<T>,
    ) {
        const possibleValues = this.schema.knownEnumsByName.get(input.enumName) ?? []
        this.state = prevState ?? {
            active: true,
            val: input.default ?? (possibleValues[0] as any) /* 🔴 */,
        }
        makeAutoObservable(this)
    }
    state: Requestable_enum_state<T>
    get result(): Requestable_enum_output<T> {
        return this.state.val
    }
}

// 🅿️ enumOpt ==============================================================================

export type Requestable_enumOpt_input<T extends KnownEnumNames> = ReqInput<{ default?: Requirable[T]; enumName: T }>
export type Requestable_enumOpt_state<T extends KnownEnumNames> = { active: boolean; val: Maybe<Requirable[T]> }
export type Requestable_enumOpt_output<T extends KnownEnumNames> = Maybe<Requirable[T]>
export interface Requestable_enumOpt<T extends KnownEnumNames>
    extends IWidget<Requestable_enumOpt_input<T>, Requestable_enumOpt_state<T>, Requestable_enumOpt_output<T>> {}
export class Requestable_enumOpt<T extends KnownEnumNames>
    implements IRequestable<Requestable_enumOpt_input<T>, Requestable_enumOpt_state<T>, Requestable_enumOpt_output<T>>
{
    type = 'enum?'
    constructor(
        public schema: SchemaL,
        public input: Requestable_enumOpt_input<T>,
        public prevState?: Requestable_enumOpt_state<T>,
    ) {
        const possibleValues = this.schema.knownEnumsByName.get(input.enumName) ?? []
        this.state = prevState ?? {
            active: input.default != null,
            val: input.default ?? (possibleValues[0] as any) /* 🔴 */,
        }
        makeAutoObservable(this)
    }
    state: Requestable_enumOpt_state<T>
    get result(): Requestable_enumOpt_output<T> {
        if (!this.state.active) return undefined
        return this.state.val
    }
}

// requestable are a closed union
export type Requestable =
    | Requestable_str
    | Requestable_strOpt
    | Requestable_prompt
    | Requestable_promptOpt
    | Requestable_int
    | Requestable_float
    | Requestable_bool
    | Requestable_intOpt
    | Requestable_floatOpt
    | Requestable_boolOpt
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
    | Requestable_enum<KnownEnumNames>
    | Requestable_enumOpt<KnownEnumNames>

// prettier-ignore
export class FormBuilder {
    constructor(public schema: SchemaL) {}

    string             = (p: Requestable_str_input)                => new Requestable_str(this.schema, p)
    stringOpt          = (p: Requestable_strOpt_input)             => new Requestable_strOpt(this.schema, p)
    str                = (p: Requestable_str_input)                => new Requestable_str(this.schema, p)
    strOpt             = (p: Requestable_strOpt_input)             => new Requestable_strOpt(this.schema, p)
    prompt             = (p: Requestable_prompt_input)             => new Requestable_prompt(this.schema, p)
    promptOpt          = (p: Requestable_promptOpt_input)          => new Requestable_promptOpt(this.schema, p)
    int                = (p: Requestable_int_input)                => new Requestable_int(this.schema, p)
    intOpt             = (p: Requestable_intOpt_input)             => new Requestable_intOpt(this.schema, p)
    float              = (p: Requestable_float_input)              => new Requestable_float(this.schema, p)
    floatOpt           = (p: Requestable_floatOpt_input)           => new Requestable_floatOpt(this.schema, p)
    number             = (p: Requestable_float_input)              => new Requestable_float(this.schema, p)
    numberOpt          = (p: Requestable_floatOpt_input)           => new Requestable_floatOpt(this.schema, p)
    matrix             = (p: Requestable_matrix_input)             => new Requestable_matrix(this.schema, p)
    boolean            = (p: Requestable_bool_input)               => new Requestable_bool(this.schema, p)
    bool               = (p: Requestable_bool_input)               => new Requestable_bool(this.schema, p)
    boolOpt            = (p: Requestable_boolOpt_input)            => new Requestable_boolOpt(this.schema, p)
    loras              = (p: Requestable_loras_input)              => new Requestable_loras(this.schema, p)
    image              = (p: Requestable_image_input)              => new Requestable_image(this.schema, p)
    imageOpt           = (p: Requestable_imageOpt_input)           => new Requestable_imageOpt(this.schema, p)
    selectOneOrCustom  = (p: Requestable_selectOneOrCustom_input)  => new Requestable_selectOneOrCustom(this.schema, p)
    selectManyOrCustom = (p: Requestable_selectManyOrCustom_input) => new Requestable_selectManyOrCustom(this.schema, p)
    enum               = <const T extends KnownEnumNames>                 (p: Requestable_enum_input<T>)        => new Requestable_enum(this.schema, p)
    enumOpt            = <const T extends KnownEnumNames>                 (p: Requestable_enumOpt_input<T>)     => new Requestable_enumOpt(this.schema, p)
    list               = <const T extends Requestable>                    (p: Requestable_list_input<T>)        => new Requestable_list(this.schema, p)
    groupOpt           = <const T extends { [key: string]: Requestable }> (p: Requestable_groupOpt_input<T>)    => new Requestable_groupOpt(this.schema, p)
    group              = <const T extends { [key: string]: Requestable }> (p: Requestable_group_input<T>)       => new Requestable_group(this.schema, p)
    selectOne          = <const T extends { type: string}>                (p: Requestable_selectOne_input<T>)   => new Requestable_selectOne(this.schema, p)
    selectMany         = <const T extends { type: string}>                (p: Requestable_selectMany_input<T>)  => new Requestable_selectMany(this.schema, p)

    // -------------------------------------
    ui                 = <const T extends { [key: string]: Requestable }> (p:T)                                 => new Requestable_group(this.schema, {items:p })

}

// // should this instanciate it's children automatically ?
// // should all forms be a group by default ? => yes ? => allow for reuse without nesting ?
// export class WidgetState<Req extends Requestable> {
//     //
//     constructor(
//         public req: Req,
//         public path: FormPath,
//         public draft: DraftL,
//     ) {
//         makeAutoObservable(this)
//     }

//     get result(): Req['$Output'] {
//         const state = this.state
//         if (state.type === 'bool') return state.val
//     }

//     // state ------------------------------
//     set = (next: Req['$State']) => this.draft.setAtPath(this.path, next)

//     get state(): Req['$State'] {
//         return (
//             this.draft.getAtPath(this.path) ?? //
//             this.defaultWidgetState //
//         )
//     }

//     get schema(): SchemaL { return this.draft.db.schema } // prettier-ignore

//     // prettier-ignore
//     private get defaultWidgetState(): ReqState<Req> {
//         const schema = this.schema
//         const req = this.req
//         return makeDefaultFor(schema, req)
//     }
// }
