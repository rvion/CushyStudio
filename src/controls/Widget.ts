/**
 * this file is an attempt to centralize core widget definition in a single
 * file so it's easy to add any widget in the future
 */
import type { ComfySchemaL } from 'src/models/Schema'
import type { SimplifiedLoraDef } from 'src/presets/SimplifiedLoraDef'
import type { ItemDataType } from 'src/rsuite/RsuiteTypes'
import type { CleanedEnumResult } from 'src/types/EnumUtils'
import type { WidgetPromptOutput } from 'src/widgets/prompter/WidgetPromptUI'
import type { PossibleSerializedNodes } from 'src/widgets/prompter/plugins/PossibleSerializedNodes'
import type { FormBuilder } from './FormBuilder'
import type { IRequest, IWidget, ReqInput, ReqResult, StateFields } from './IWidget'
import type { AspectRatio, ComfyImageAnswer, CushyImageAnswer, CushySize, CushySizeByRatio, ImageAnswer, ImageAnswerForm, PaintImageAnswer, SDModelType } from './misc/InfoAnswer'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { FC } from 'react'
import { bang } from 'src/utils/misc/bang'
import { WidgetDI } from './widgets/WidgetUI.DI'

// Widget is a closed union for added type safety
export type Widget =
    | Widget_color
    | Widget_str
    | Widget_orbit
    | Widget_strOpt
    | Widget_prompt
    | Widget_promptOpt
    | Widget_seed
    | Widget_int
    | Widget_float
    | Widget_bool
    | Widget_inlineRun
    | Widget_intOpt
    | Widget_floatOpt
    | Widget_markdown
    | Widget_custom<any>
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
    | Widget_listExt<any>
    | Widget_group<any>
    | Widget_groupOpt<any>
    | Widget_choice<any>
    | Widget_choices<any>
    | Widget_enum<any>
    | Widget_enumOpt<any>

// 🅿️ str ==============================================================================
export type Widget_str_opts  = ReqInput<{ default?: string; textarea?: boolean, placeHolder?:string }>
export type Widget_str_serial = StateFields<{ type: 'str', active: true; val: string }>
export type Widget_str_state  = StateFields<{ type: 'str', active: true; val: string }>
export type Widget_str_output = string
export interface Widget_str extends IWidget<'str', Widget_str_opts, Widget_str_serial, Widget_str_state, Widget_str_output> {}
export class Widget_str implements IRequest<'str', Widget_str_opts, Widget_str_serial, Widget_str_state, Widget_str_output> {
    isOptional = false
    id: string
    type: 'str' = 'str'
    state: Widget_str_state
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public input: Widget_str_opts,
        serial?: Widget_str_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.state = serial ?? { type:'str', collapsed: input.startCollapsed, active: true, val: input.default ?? '', id: this.id }
        makeAutoObservable(this)
    }
    get serial(): Widget_str_serial { return this.state }
    get result(): Widget_str_output { return this.state.val }
}

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
export type Widget_orbit_opts  = ReqInput<{ default?: Partial<OrbitData> }>
export type Widget_orbit_serial = StateFields<{ type: 'orbit', active: true; val: OrbitData }>
export type Widget_orbit_state  = StateFields<{ type: 'orbit', active: true; val: OrbitData }>
export type Widget_orbit_output = OrbitData & {
    englishSummary: string;
}
export interface Widget_orbit extends IWidget<'orbit', Widget_orbit_opts, Widget_orbit_serial, Widget_orbit_state, Widget_orbit_output> {}
export class Widget_orbit implements IRequest<'orbit', Widget_orbit_opts, Widget_orbit_serial, Widget_orbit_state, Widget_orbit_output> {
    isOptional = false
    id: string
    type: 'orbit' = 'orbit'
    state: Widget_orbit_state
    reset = () => {
        this.state.val.azimuth = this.input.default?.azimuth ?? 0
        this.state.val.elevation = this.input.default?.elevation ?? 0
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
        public input: Widget_orbit_opts,
        serial?: Widget_orbit_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.state = serial ?? {
            type:'orbit',
            collapsed: input.startCollapsed,
            active: true,
            val: {
                azimuth: input.default?.azimuth ?? 0,
                elevation: input.default?.elevation ?? 0,
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
export type Widget_markdown_opts = ReqInput<{ markdown: string | ((formRoot:Widget_group<any>) => string); }>
export type Widget_markdown_serial = StateFields<{ type: 'markdown', active: true }>
export type Widget_markdown_state  = StateFields<{ type: 'markdown', active: true }>
export type Widget_markdown_output = { type: 'markdown', active: true }
export interface Widget_markdown extends IWidget<'markdown', Widget_markdown_opts, Widget_markdown_serial, Widget_markdown_state, Widget_markdown_output> {}
export class Widget_markdown implements IRequest<'markdown', Widget_markdown_opts, Widget_markdown_serial, Widget_markdown_state, Widget_markdown_output> {
    isOptional = false
    id: string
    type: 'markdown' = 'markdown'
    state: Widget_markdown_state

    get markdown() :string{
        const md= this.input.markdown
        if (typeof md === 'string') return md
        return md(this.builder._ROOT)
    }

    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public input: Widget_markdown_opts,
        serial?: Widget_markdown_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.state = serial ?? { type:'markdown', collapsed: input.startCollapsed, active: true, id: this.id }
        makeAutoObservable(this)
    }
    get serial(): Widget_markdown_serial { return this.state }
    get result(): Widget_markdown_output { return this.state }
}

// 🅿️ custom ==============================================================================
export type CustomWidgetProps<T> = { widget: Widget_custom<T>; extra: import('./widgets/WidgetCustomUI').UIKit }
export type Widget_custom_opts  <T> = ReqInput<{ defaultValue: () => T; Component: FC<CustomWidgetProps<T>>}>
export type Widget_custom_serial<T> = StateFields<{ type: 'custom'; active: true; value: T }>
export type Widget_custom_state <T> = StateFields<{ type: 'custom'; active: true; value: T }>
export type Widget_custom_output<T> = T
export interface Widget_custom<T> extends IWidget<'custom', Widget_custom_opts<T>, Widget_custom_serial<T>, Widget_custom_state<T>, Widget_custom_output<T>> {}
export class Widget_custom<T> implements IRequest<'custom', Widget_custom_opts<T>, Widget_custom_serial<T>, Widget_custom_state<T>, Widget_custom_output<T>> {
    isOptional = false
    id: string
    type: 'custom' = 'custom'
    state: Widget_custom_state<T>
    Component: Widget_custom_opts<T>['Component']
    st = () => this.schema.st
    reset = () => (this.state.value = this.input.defaultValue())
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public input: Widget_custom_opts<T>,
        serial?: Widget_custom_serial<T>,
    ) {
        this.id = serial?.id ?? nanoid()
        this.Component = input.Component
        this.state = serial ?? {
            type: 'custom',
            active: true,
            id: this.id,
            value: this.input.defaultValue(),
        }

        makeAutoObservable(this, { Component: false })
    }

    /** never mutate this field manually, only access to .state */
    get serial(): Widget_custom_serial<T> { return this.state }

    /** never mutate this field manually, only access to .state */
    get result(): Widget_custom_output<T> { return this.state.value }
}


// 🅿️ str ==============================================================================
export type Widget_color_opts = ReqInput<{ default?: string; }>
export type Widget_color_serial = StateFields<{ type: 'color', active: true; val: string }>
export type Widget_color_state  = StateFields<{ type: 'color', active: true; val: string }>
export type Widget_color_output = string
export interface Widget_color extends IWidget<'color', Widget_color_opts, Widget_color_serial, Widget_color_state, Widget_color_output> {}
export class Widget_color implements IRequest<'color', Widget_color_opts, Widget_color_serial, Widget_color_state, Widget_color_output> {
    isOptional = false
    id: string
    type: 'color' = 'color'
    state: Widget_color_state
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public input: Widget_color_opts,
        serial?: Widget_color_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.state = serial ?? { type:'color', collapsed: input.startCollapsed, id: this.id,  active: true, val: input.default ?? '' }
        makeAutoObservable(this)
    }
    get serial(): Widget_color_serial { return this.state }
    get result(): Widget_color_output { return this.state.val }
}

// 🅿️ strOpt ==============================================================================
export type Widget_strOpt_opts  = Widget_str_opts
export type Widget_strOpt_serial = Widget_strOpt_state
export type Widget_strOpt_state  = StateFields<{ type:'strOpt', active: boolean; val: string }>
export type Widget_strOpt_output = Maybe<string>
export interface Widget_strOpt extends IWidget<'strOpt', Widget_strOpt_opts, Widget_strOpt_serial, Widget_strOpt_state, Widget_strOpt_output> {}
export class Widget_strOpt implements IRequest<'strOpt', Widget_strOpt_opts, Widget_strOpt_serial, Widget_strOpt_state, Widget_strOpt_output> {
    isOptional = true
    id: string
    type: 'strOpt' = 'strOpt'
    state: Widget_strOpt_state
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public input: Widget_strOpt_opts,
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
export type Widget_prompt_opts  = ReqInput<{ default?: string | WidgetPromptOutput }>
export type Widget_prompt_serial = Widget_prompt_state
export type Widget_prompt_state  = StateFields<{ type: 'prompt'; active: true; /*text: string;*/ tokens: PossibleSerializedNodes[] }>
export type Widget_prompt_output = { type: 'prompt'; active: true; /*text: string;*/ tokens: PossibleSerializedNodes[] }
export interface Widget_prompt extends IWidget<'prompt', Widget_prompt_opts, Widget_prompt_serial, Widget_prompt_state, Widget_prompt_output> {}
export class Widget_prompt implements IRequest<'prompt', Widget_prompt_opts, Widget_prompt_serial, Widget_prompt_state, Widget_prompt_output> {
    isOptional = false
    id: string
    type: 'prompt' = 'prompt'
    state: Widget_prompt_state

    // getText = () => {
    //     const tokens = entry.item.tokens

    // }
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public input: Widget_prompt_opts,
        serial?: Widget_prompt_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        if (serial) {
            this.state = serial
        } else {
            this.state = {
                type:'prompt',
                collapsed: input.startCollapsed,
                id: this.id,
                active: true,
                tokens: []
            }
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
export type Widget_promptOpt_opts  = ReqInput<{ default?: string | WidgetPromptOutput }>
export type Widget_promptOpt_serial = Widget_promptOpt_state // { type: 'promptOpt'; active: boolean; /* text: string;*/ tokens: PossibleSerializedNodes[] }
export type Widget_promptOpt_state  = StateFields<{ type: 'promptOpt'; active: boolean; /* text: string;*/ tokens: PossibleSerializedNodes[] }>
export type Widget_promptOpt_output = Maybe<WidgetPromptOutput>
export interface Widget_promptOpt extends IWidget<'promptOpt', Widget_promptOpt_opts, Widget_promptOpt_serial, Widget_promptOpt_state, Widget_promptOpt_output> {}
export class Widget_promptOpt implements IRequest<'promptOpt', Widget_promptOpt_opts, Widget_promptOpt_serial, Widget_promptOpt_state, Widget_promptOpt_output> {
    isOptional = true
    id: string
    type: 'promptOpt' = 'promptOpt'
    state: Widget_promptOpt_state
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public input: Widget_promptOpt_opts,
        serial?: Widget_promptOpt_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        if (serial) {
            this.state = serial
        } else {
            this.state = {
                type:'promptOpt',
                collapsed: input.startCollapsed,
                id: this.id,
                active: false,
                tokens: []
            }
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
export type Widget_seed_opts  = ReqInput<{ default?: number; defaultMode?: 'randomize' | 'fixed' | 'last', min?: number; max?: number }>
export type Widget_seed_serial = Widget_seed_state
export type Widget_seed_state  = StateFields<{ type:'seed', active: true; val: number, mode: 'randomize' | 'fixed' | 'last' }>
export type Widget_seed_output = number
export interface Widget_seed extends IWidget<'seed', Widget_seed_opts, Widget_seed_serial, Widget_seed_state, Widget_seed_output> {}
export class Widget_seed implements IRequest<'seed', Widget_seed_opts, Widget_seed_serial, Widget_seed_state, Widget_seed_output> {
    isOptional = false
    id: string
    type: 'seed' = 'seed'
    state: Widget_seed_state
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public input: Widget_seed_opts,
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
export type Widget_int_opts  = ReqInput<{ default?: number; min?: number; max?: number, step?: number, hideSlider?: boolean }>
export type Widget_int_serial = Widget_int_state
export type Widget_int_state  = StateFields<{ type:'int', active: true; val: number }>
export type Widget_int_output = number
export interface Widget_int extends IWidget<'int', Widget_int_opts, Widget_int_serial, Widget_int_state, Widget_int_output> {}
export class Widget_int implements IRequest<'int', Widget_int_opts, Widget_int_serial, Widget_int_state, Widget_int_output> {
    isOptional = false
    id: string
    type: 'int' = 'int'
    state: Widget_int_state
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public input: Widget_int_opts,
        serial?: Widget_int_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.state = serial ?? { type: 'int', collapsed: input.startCollapsed, id: this.id, active: true, val: input.default ?? 0 }
        makeAutoObservable(this)
    }
    get serial(): Widget_int_serial { return this.state }
    get result(): Widget_int_output { return this.state.val }
}

// 🅿️ float ==============================================================================
export type Widget_float_opts  = ReqInput<{ default?: number; min?: number; max?: number, step?: number, hideSlider?: boolean }>
export type Widget_float_serial = Widget_float_state
export type Widget_float_state  = StateFields<{ type:'float', active: true; val: number }>
export type Widget_float_output = number
export interface Widget_float extends IWidget<'float', Widget_float_opts, Widget_float_serial, Widget_float_state, Widget_float_output> {}
export class Widget_float implements IRequest<'float', Widget_float_opts, Widget_float_serial, Widget_float_state, Widget_float_output> {
    isOptional = false
    id: string
    type: 'float' = 'float'
    state: Widget_float_state
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public input: Widget_float_opts,
        serial?: Widget_float_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.state = serial ?? { type:'float', collapsed: input.startCollapsed, id: this.id, active: true, val: input.default ?? 0 }
        makeAutoObservable(this)
    }
    get serial(): Widget_float_serial { return this.state }
    get result(): Widget_float_output { return this.state.val }
}

// 🅿️ bool ==============================================================================
export type Widget_bool_opts  = ReqInput<{ default?: boolean }>
export type Widget_bool_serial = Widget_bool_state
export type Widget_bool_state  = StateFields<{ type:'bool', active: true; val: boolean }>
export type Widget_bool_output = boolean
export interface Widget_bool extends IWidget<'bool', Widget_bool_opts, Widget_bool_serial, Widget_bool_state, Widget_bool_output> {}
export class Widget_bool implements IRequest<'bool', Widget_bool_opts, Widget_bool_serial, Widget_bool_state, Widget_bool_output> {
    isOptional = true
    id: string
    type: 'bool' = 'bool'
    state: Widget_bool_state
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public input: Widget_bool_opts,
        serial?: Widget_bool_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.state = serial ?? { type: 'bool', collapsed: input.startCollapsed, id: this.id, active: true, val: input.default ?? false }
        makeAutoObservable(this)
    }
    get serial(): Widget_bool_serial { return this.state }
    get result(): Widget_bool_output { return this.state.active ? this.state.val : false}
}

// 🅿️ inlineRun ==============================================================================
export type Widget_inlineRun_opts  = ReqInput<{text?: string, kind?: `primary`|`special`|`warning`}>
export type Widget_inlineRun_serial = Widget_inlineRun_state
export type Widget_inlineRun_state  = StateFields<{ type:'inlineRun', active: true; val: boolean }>
export type Widget_inlineRun_output = boolean
export interface Widget_inlineRun extends IWidget<'inlineRun', Widget_inlineRun_opts, Widget_inlineRun_serial, Widget_inlineRun_state, Widget_inlineRun_output> {}
export class Widget_inlineRun implements IRequest<'inlineRun', Widget_inlineRun_opts, Widget_inlineRun_serial, Widget_inlineRun_state, Widget_inlineRun_output> {
    isOptional = false
    id: string
    type: 'inlineRun' = 'inlineRun'
    state: Widget_inlineRun_state
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public input: Widget_inlineRun_opts,
        serial?: Widget_inlineRun_serial,
    ) {
        if(input.text){
            input.label = input.label ?? ` `;
        }

        this.id = serial?.id ?? nanoid()
        this.state = serial ?? { type: 'inlineRun', collapsed: input.startCollapsed, id: this.id, active: true, val: false, }
        makeAutoObservable(this)
    }
    get serial(): Widget_inlineRun_serial { return this.state }
    get result(): Widget_inlineRun_output { return this.state.active ? this.state.val : false}
}

// 🅿️ intOpt ==============================================================================
export type Widget_intOpt_opts  = ReqInput<{ default?: number; min?: number; max?: number; step?: number, hideSlider?: boolean }>
export type Widget_intOpt_serial = Widget_intOpt_state
export type Widget_intOpt_state  = StateFields<{ type: 'intOpt', active: boolean; val: number }>
export type Widget_intOpt_output = Maybe<number>
export interface Widget_intOpt extends IWidget<'intOpt', Widget_intOpt_opts, Widget_intOpt_serial, Widget_intOpt_state, Widget_intOpt_output> {}
export class Widget_intOpt implements IRequest<'intOpt', Widget_intOpt_opts, Widget_intOpt_serial, Widget_intOpt_state, Widget_intOpt_output> {
    isOptional = true
    id: string
    type: 'intOpt' = 'intOpt'
    state: Widget_intOpt_state
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public input: Widget_intOpt_opts,
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
export type Widget_floatOpt_opts  = ReqInput<{ default?: number; min?: number; max?: number; step?: number, hideSlider?: boolean }>
export type Widget_floatOpt_serial = Widget_floatOpt_state
export type Widget_floatOpt_state  = StateFields<{ type: 'floatOpt', active: boolean; val: number }>
export type Widget_floatOpt_output = Maybe<number>
export interface Widget_floatOpt extends IWidget<'floatOpt', Widget_floatOpt_opts, Widget_floatOpt_serial, Widget_floatOpt_state, Widget_floatOpt_output> {}
export class Widget_floatOpt implements IRequest<'floatOpt', Widget_floatOpt_opts, Widget_floatOpt_serial, Widget_floatOpt_state, Widget_floatOpt_output> {
    isOptional = true
    id: string
    type: 'floatOpt' = 'floatOpt'
    state: Widget_floatOpt_state
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public input: Widget_floatOpt_opts,
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
export type Widget_size_opts  = ReqInput<{
    default?: CushySizeByRatio
    min?: number
    max?: number
    step?: number
}>
export type Widget_size_serial = Widget_size_state
export type Widget_size_state  = StateFields<CushySize>
export type Widget_size_output = CushySize
export interface Widget_size extends IWidget<'size', Widget_size_opts, Widget_size_serial, Widget_size_state, Widget_size_output> {}
export class Widget_size implements IRequest<'size', Widget_size_opts, Widget_size_serial, Widget_size_state, Widget_size_output> {
    isOptional = false
    id: string
    type: 'size' = 'size'
    state: Widget_size_state
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public input: Widget_size_opts,
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
export type Widget_matrix_cell = {
    x: number
    y: number
    row: string
    col: string
    value: boolean
}
export type Widget_matrix_opts  = ReqInput<{ default?: { row: string; col: string }[]; rows: string[]; cols: string[] }>
export type Widget_matrix_serial = Widget_matrix_state
export type Widget_matrix_state  = StateFields<{ type: 'matrix', active: true; selected: Widget_matrix_cell[] }>
export type Widget_matrix_output = Widget_matrix_cell[]
export interface Widget_matrix extends IWidget<'matrix', Widget_matrix_opts, Widget_matrix_serial, Widget_matrix_state, Widget_matrix_output> {}
export class Widget_matrix implements IRequest<'matrix', Widget_matrix_opts, Widget_matrix_serial, Widget_matrix_state, Widget_matrix_output> {
    isOptional = false
    id: string
    type: 'matrix' = 'matrix'
    state: Widget_matrix_state
    rows: string[]
    cols: string[]
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public input: Widget_matrix_opts,
        serial?: Widget_matrix_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.state = serial ?? { type:'matrix', collapsed: input.startCollapsed, id: this.id, active: true, selected: [] }
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
export type Widget_loras_opts  = ReqInput<{ default?: SimplifiedLoraDef[] }>
export type Widget_loras_serial = Widget_loras_state
export type Widget_loras_state  = StateFields<{ type: 'loras', active: true; loras: SimplifiedLoraDef[] }>
export type Widget_loras_output = SimplifiedLoraDef[]
export interface Widget_loras extends IWidget<'loras', Widget_loras_opts, Widget_loras_serial, Widget_loras_state, Widget_loras_output> {}
export class Widget_loras implements IRequest<'loras', Widget_loras_opts, Widget_loras_serial, Widget_loras_state, Widget_loras_output> {
    isOptional = false
    id: string
    type: 'loras' = 'loras'
    state: Widget_loras_state
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public input: Widget_loras_opts,
        serial?: Widget_loras_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.state = serial ?? { type: 'loras', collapsed: input.startCollapsed, id: this.id, active: true, loras: input.default ?? [] }
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
export type Widget_image_opts  = ReqInput<{
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
export interface Widget_image extends IWidget<'image', Widget_image_opts, Widget_image_serial, Widget_image_state, Widget_image_output> {}
export class Widget_image implements IRequest<'image', Widget_image_opts, Widget_image_serial, Widget_image_state, Widget_image_output> {
    isOptional = false
    id: string
    type: 'image' = 'image'
    state: Widget_image_state
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public input: Widget_image_opts,
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
export type Widget_imageOpt_opts  = Widget_image_opts // same as image
export type Widget_imageOpt_serial = Widget_imageOpt_state
export type Widget_imageOpt_state  = StateFields<ImageAnswerForm<'imageOpt', boolean>>
export type Widget_imageOpt_output = Maybe<ImageAnswer>
export interface Widget_imageOpt extends IWidget<'imageOpt', Widget_imageOpt_opts, Widget_imageOpt_serial, Widget_imageOpt_state, Widget_imageOpt_output> {}
export class Widget_imageOpt implements IRequest<'imageOpt', Widget_imageOpt_opts, Widget_imageOpt_serial, Widget_imageOpt_state, Widget_imageOpt_output> {
    isOptional = true
    id: string
    type: 'imageOpt' = 'imageOpt'
    state: Widget_imageOpt_state
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public input: Widget_imageOpt_opts,
        serial?: Widget_imageOpt_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.state = serial ?? {
            type: 'imageOpt',
            collapsed: input.startCollapsed,
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
export type Widget_selectOne_opts <T extends BaseSelectOneEntry>  = ReqInput<{ default?: T; choices: T[] | ((formRoot:Maybe<Widget_group<any>>) => T[]) }>
export type Widget_selectOne_serial<T extends BaseSelectOneEntry> = Widget_selectOne_state<T>
export type Widget_selectOne_state <T extends BaseSelectOneEntry>  = StateFields<{ type:'selectOne', query: string; val: T }>
export type Widget_selectOne_output<T extends BaseSelectOneEntry> = T
export interface Widget_selectOne<T>  extends IWidget<'selectOne', Widget_selectOne_opts<T>, Widget_selectOne_serial<T>, Widget_selectOne_state<T>, Widget_selectOne_output<T>> {}
export class Widget_selectOne<T extends BaseSelectOneEntry> implements IRequest<'selectOne', Widget_selectOne_opts<T>, Widget_selectOne_serial<T>, Widget_selectOne_state<T>, Widget_selectOne_output<T>> {
    isOptional = false
    id: string
    type: 'selectOne' = 'selectOne'
    state: Widget_selectOne_state<T>

    get choices():T[]{
        const _choices = this.input.choices
        return typeof _choices === 'function' //
            ? _choices(this.builder._ROOT)
            : _choices
    }
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public input: Widget_selectOne_opts<T>,
        serial?: Widget_selectOne_serial<T>,
    ) {
        this.id = serial?.id ?? nanoid()
        const choices = this.choices
        this.state = serial ?? {
            type: 'selectOne',
            collapsed: input.startCollapsed,
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
export type Widget_selectOneOrCustom_opts  = ReqInput<{ default?: string; choices: string[] }>
export type Widget_selectOneOrCustom_serial = Widget_selectOneOrCustom_state
export type Widget_selectOneOrCustom_state  = StateFields<{ type:'selectOneOrCustom', query: string; val: string }>
export type Widget_selectOneOrCustom_output = string
export interface Widget_selectOneOrCustom extends IWidget<'selectOneOrCustom', Widget_selectOneOrCustom_opts, Widget_selectOneOrCustom_serial, Widget_selectOneOrCustom_state, Widget_selectOneOrCustom_output > {}
export class Widget_selectOneOrCustom implements IRequest<'selectOneOrCustom', Widget_selectOneOrCustom_opts, Widget_selectOneOrCustom_serial, Widget_selectOneOrCustom_state, Widget_selectOneOrCustom_output > {
    isOptional = false
    id: string
    type: 'selectOneOrCustom' = 'selectOneOrCustom'
    state: Widget_selectOneOrCustom_state
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public input: Widget_selectOneOrCustom_opts,
        serial?: Widget_selectOneOrCustom_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.state = serial ?? {
            type: 'selectOneOrCustom',
            collapsed: input.startCollapsed,
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
export type Widget_selectMany_opts<T extends { type: string }>  = ReqInput<{ default?: T[]; choices: T[] }>
export type Widget_selectMany_serial<T extends { type: string }> = StateFields<{ type: 'selectMany', query: string; values_: string[] }>
export type Widget_selectMany_state<T extends { type: string }>  = StateFields<{ type: 'selectMany', query: string; values: T[] }>
export type Widget_selectMany_output<T extends { type: string }> = T[]
export interface Widget_selectMany<T extends { type: string }> extends IWidget<'selectMany', Widget_selectMany_opts<T>, Widget_selectMany_serial<T>, Widget_selectMany_state<T>, Widget_selectMany_output<T>> {}
export class Widget_selectMany<T extends { type: string }> implements IRequest<'selectMany', Widget_selectMany_opts<T>, Widget_selectMany_serial<T>, Widget_selectMany_state<T>, Widget_selectMany_output<T>> {
    isOptional = false
    id: string
    type: 'selectMany' = 'selectMany'
    state: Widget_selectMany_state<T>
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public input: Widget_selectMany_opts<T>,
        serial?: Widget_selectMany_serial<T>,
    ) {
        this.id = serial?.id ?? nanoid()
        if (serial) {
            const values = serial.values_.map((v) => input.choices.find((c) => c.type === v)!).filter((v) => v != null)
            this.state = {
                type: 'selectMany',
                collapsed: serial.collapsed,
                id: this.id,
                query: serial.query,
                values: values
            }
        } else {
            this.state = {
                type: 'selectMany',
                collapsed: input.startCollapsed,
                id: this.id,
                query: '', values: input.default ?? [], }
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
export type Widget_selectManyOrCustom_opts  = ReqInput<{ default?: string[]; choices: string[] }>
export type Widget_selectManyOrCustom_serial = Widget_selectManyOrCustom_state
export type Widget_selectManyOrCustom_state  = StateFields<{ type: 'selectManyOrCustom', query: string; values: string[] }>
export type Widget_selectManyOrCustom_output = string[]
export interface Widget_selectManyOrCustom extends IWidget<'selectManyOrCustom',  Widget_selectManyOrCustom_opts, Widget_selectManyOrCustom_serial, Widget_selectManyOrCustom_state, Widget_selectManyOrCustom_output > {}
export class Widget_selectManyOrCustom implements IRequest<'selectManyOrCustom', Widget_selectManyOrCustom_opts, Widget_selectManyOrCustom_serial, Widget_selectManyOrCustom_state, Widget_selectManyOrCustom_output > {
    isOptional = false
    id: string
    type: 'selectManyOrCustom' = 'selectManyOrCustom'
    state: Widget_selectManyOrCustom_state
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public input: Widget_selectManyOrCustom_opts,
        serial?: Widget_selectManyOrCustom_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.state = serial ?? { type: 'selectManyOrCustom', collapsed: input.startCollapsed, id: this.id, query: '', values: input.default ?? [] }
        makeAutoObservable(this)
    }
    get serial(): Widget_selectManyOrCustom_serial { return this.state }
    get result(): Widget_selectManyOrCustom_output { return this.state.values }
}

// 🅿️ list ==============================================================================
export type Widget_list_opts<T extends Widget>  = ReqInput<{
    element: (ix:number) => T,
    min?: number,
    max?:number,
    defaultLength?:number
}>
export type Widget_list_serial<T extends Widget> = StateFields<{ type: 'list', active: true; items_: T['$Serial'][] }>
export type Widget_list_state<T extends Widget>  = StateFields<{ type: 'list', active: true; items: T[] }>
export type Widget_list_output<T extends Widget> = T['$Output'][]
export interface Widget_list<T extends Widget> extends IWidget<'list', Widget_list_opts<T>, Widget_list_serial<T>, Widget_list_state<T>, Widget_list_output<T>> {}
export class Widget_list<T extends Widget> implements IRequest<'list', Widget_list_opts<T>, Widget_list_serial<T>, Widget_list_state<T>, Widget_list_output<T>> {
    isOptional = false
    id: string
    type: 'list' = 'list'
    state: Widget_list_state<T>
    private _reference: T

    get items(): T[] { return this.state.items }
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public input: Widget_list_opts<T>,
        serial?: Widget_list_serial<T>,
    ) {
        this.id = serial?.id ?? nanoid()
        this._reference = input.element(0)
        if (serial) {
            const items = serial.items_.map((sub_) => builder._HYDRATE(sub_.type, this._reference.input, sub_)) // 🔴 handler filter if wrong type
            this.state = { type: 'list', id: this.id, active: serial.active, items }
        } else {
            const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)
            const defaultLen = clamp(input.defaultLength ?? 0, input.min ?? 0, input.max ?? 10)
            const items = defaultLen
                ? new Array(defaultLen).fill(0).map((_,ix) => input.element(ix))
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
    removemAllItems = () => this.state.items = this.state.items.slice(0, this.input.min ?? 0)
    collapseAllItems = () => this.state.items.forEach((i) => i.state.collapsed = true)
    expandAllItems = () => this.state.items.forEach((i) => i.state.collapsed = false)
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
        this.state.items.push(this.input.element(this.state.items.length))
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

export type Widget_listExt_opts<T extends Widget>  = ReqInput<{
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
export type Widget_listExt_serial<T extends Widget> = StateFields<{ type: 'listExt', active: true; items_: ({item_: T['$Serial']} & ItemExt)[] } & RootExt>
export type Widget_listExt_state <T extends Widget> = StateFields<{ type: 'listExt', active: true; items:  ({item:  T           } & ItemExt)[] } & RootExt>
export type Widget_listExt_output<T extends Widget> = RootExt & { items: (ItemExt & {item: T['$Output'] })[] }
export interface Widget_listExt  <T extends Widget> extends     IWidget<'listExt', Widget_listExt_opts<T>, Widget_listExt_serial<T>, Widget_listExt_state<T>, Widget_listExt_output<T>> {}
export class Widget_listExt      <T extends Widget> implements IRequest<'listExt', Widget_listExt_opts<T>, Widget_listExt_serial<T>, Widget_listExt_state<T>, Widget_listExt_output<T>> {
    isOptional = false
    id: string
    type: 'listExt' = 'listExt'
    state: Widget_listExt_state<T>
    private _reference: T

    // INIT -----------------------------------------------------------------------------
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public input: Widget_listExt_opts<T>,
        serial?: Widget_listExt_serial<T>,
    ) {
        this.id = serial?.id ?? nanoid()
        this._reference = input.element({width:100, height:100, ix: 0}).item
        if (serial) {
            const items:  WithExt<T>[] = serial.items_.map(({item_, ...ext}) => {
                const item:T = builder._HYDRATE(item_.type, this._reference.input, item_)
                return {item, ...ext}
            })
            this.state = { type: 'listExt', id: this.id, active: serial.active, items, width: serial.width, height: serial.height }
        } else {
            const w = input.width ?? 100
            const h = input.height ?? 100
            const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)
            const defaultLen = clamp(input.defaultLength ?? 0, input.min ?? 0, input.max ?? 10)
            const items: WithExt<T>[] = defaultLen
                ? new Array(defaultLen).fill(0).map((_,ix) => {
                    const partial: WithPartialExt<T> = input.element({width: w, height: h, ix})
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
        const newItemPartial = this.input.element({width: this.state.width, height: this.state.height, ix: this.state.items.length})
        const newItem: WithExt<T> = { ...itemExtDefaults, ...newItemPartial}
        this.state.items.push(newItem)
    }
    removemAllItems = () => this.state.items = this.state.items.slice(0, this.input.min ?? 0)
    collapseAllItems = () => this.state.items.forEach((i) => i.item.state.collapsed = true)
    expandAllItems = () => this.state.items.forEach((i) => i.item.state.collapsed = false)
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

// 🅿️ group ==============================================================================
export type Widget_group_opts <T extends { [key: string]: Widget }> = ReqInput<{ items: () => T, topLevel?: boolean, verticalLabels?: boolean }>
export type Widget_group_serial<T extends { [key: string]: Widget }> = StateFields<{ type: 'group', active: true; values_: {[k in keyof T]: T[k]['$Serial']}, collapsed?: boolean }>
export type Widget_group_state <T extends { [key: string]: Widget }> = StateFields<{ type: 'group', active: true; values: T, vertical?: boolean }>
export type Widget_group_output<T extends { [key: string]: Widget }> = { [k in keyof T]: ReqResult<T[k]> }
export interface Widget_group<T extends { [key: string]: Widget }> extends IWidget<'group', Widget_group_opts<T>, Widget_group_serial<T>, Widget_group_state<T>, Widget_group_output<T>> {}
export class Widget_group<T extends { [key: string]: Widget }> implements IRequest<'group', Widget_group_opts<T>, Widget_group_serial<T>, Widget_group_state<T>, Widget_group_output<T>> {
    isOptional = false
    id: string
    type: 'group' = 'group'
    state: Widget_group_state<T>
    /** all [key,value] pairs */
    get entries() { return Object.entries(this.state.values) as [string, any][] }
    /** the dict of all child widgets */
    get values() { return this.state.values }
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public input: Widget_group_opts<T>,
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
                    this.state.values[key] = this.builder._HYDRATE(newType, newInput, prevValue_)
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
export type Widget_groupOpt_opts <T extends { [key: string]: Widget }> = ReqInput<{ default?: boolean; items: () => T, topLevel?: false }>
export type Widget_groupOpt_serial<T extends { [key: string]: Widget }> = StateFields<{ type: 'groupOpt', active: boolean; values_: {[K in keyof T]: T[K]['$Serial']}, }>
export type Widget_groupOpt_state <T extends { [key: string]: Widget }> = StateFields<{ type: 'groupOpt', active: boolean; values: T, }>
export type Widget_groupOpt_output<T extends { [key: string]: Widget }> = Maybe<{ [k in keyof T]: ReqResult<T[k]> }>
export interface Widget_groupOpt<T extends { [key: string]: Widget }> extends IWidget<'groupOpt', Widget_groupOpt_opts<T>, Widget_groupOpt_serial<T>, Widget_groupOpt_state<T>, Widget_groupOpt_output<T>> {}
export class Widget_groupOpt<T extends { [key: string]: Widget }> implements IRequest<'groupOpt', Widget_groupOpt_opts<T>, Widget_groupOpt_serial<T>, Widget_groupOpt_state<T>, Widget_groupOpt_output<T>> {
    isOptional = true
    id: string
    type: 'groupOpt' = 'groupOpt'
    state: Widget_groupOpt_state<T>
    /** all [key,value] pairs */
    get entries() { return Object.entries(this.state.values) as [string, any][] }
    /** the dict of all child widgets */
    get values() { return this.state.values }
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public input: Widget_groupOpt_opts<T>,
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
                    this.state.values[key] = this.builder._HYDRATE(newType, newInput, prevValue_)
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
export type Widget_choice_opts <T extends { [key: string]: Widget }> = ReqInput<{ default?: keyof T; items: () => T }>
export type Widget_choice_serial<T extends { [key: string]: Widget }> = StateFields<{ type: 'choice', active: boolean; pick: keyof T & string, values_: {[K in keyof T]: T[K]['$Serial']} }>
export type Widget_choice_state <T extends { [key: string]: Widget }> = StateFields<{ type: 'choice', active: boolean; pick: keyof T & string, values: T }>
export type Widget_choice_output<T extends { [key: string]: Widget }> = { [k in keyof T]?: ReqResult<T[k]> }
export interface Widget_choice  <T extends { [key: string]: Widget }> extends    IWidget<'choice',  Widget_choice_opts<T>, Widget_choice_serial<T>, Widget_choice_state<T>, Widget_choice_output<T>> {}
export class Widget_choice      <T extends { [key: string]: Widget }> implements IRequest<'choice', Widget_choice_opts<T>, Widget_choice_serial<T>, Widget_choice_state<T>, Widget_choice_output<T>> {
    isOptional = false
    id: string
    type: 'choice' = 'choice'
    state: Widget_choice_state<T>
    possibleChoices:string[]
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public input: Widget_choice_opts<T>,
        serial?: Widget_choice_serial<T>,
    ) {
        this.id = serial?.id ?? nanoid()
        const _items = input.items()
        this.possibleChoices=Object.keys(_items)
        if (serial){
            this.state = { type:'choice', id: this.id, active: serial.active, collapsed: serial.collapsed, values: {} as any, pick: serial.pick }
            const prevValues_ = serial.values_??{}
            for (const key in _items) {
                // 🔴 👇 this was a hacky fix for the perf problem
                // 🔴 if (key !== serial.pick) continue
                const newItem = _items[key]
                const prevValue_ = prevValues_[key]
                const newInput = newItem.input
                const newType = newItem.type
                if (prevValue_ && newType === prevValue_.type) {
                    this.state.values[key] = this.builder._HYDRATE(newType, newInput, prevValue_)
                } else {
                    this.state.values[key] = newItem
                }
            }
        } else {
            const defaultPick: keyof T & string = (input.default as string ?? Object.keys(_items)[0]  ??'error')
            this.state = { type: 'choice', id: this.id, active: true, values: _items, pick: defaultPick }
        }
        makeAutoObservable(this)
    }

    /** return the key of the selected item */
    get pick() { return this.state.pick }
    get child(){
        return this.state.values[this.state.pick]
    }
    get serial(): Widget_choice_serial<T> {
        const out: { [key: string]: any } = {}
        for (const key in this.state.values) {
            // 🔴 👇 this was a hacky fix for the perf problem
            // 🔴  if (key !== this.state.pick) continue
            out[key] = this.state.values[key].serial
        }
        return { type: 'choice', id: this.id, active: this.state.active, values_: out as any, collapsed: this.state.collapsed, pick: this.state.pick }
    }
    get result(): Widget_choice_output<T> {
        const out: { [key: string]: any } = {}
        for (const key in this.state.values) {
            if (key !== this.state.pick) continue
            out[key] = this.state.values[key].result
        }
        return out as any
    }
}


// 🅿️ choices ==============================================================================
export type Widget_choices_opts <T extends { [key: string]: Widget }> = ReqInput<{ items: () => T, defaultActiveBranches?: {[k in keyof T]?: boolean}  }>
export type Widget_choices_serial<T extends { [key: string]: Widget }> = StateFields<{ type: 'choices', active: true; branches: {[k in keyof T]?: boolean}, values_: {[k in keyof T]: T[k]['$Serial']} }>
export type Widget_choices_state <T extends { [key: string]: Widget }> = StateFields<{ type: 'choices', active: true; branches: {[k in keyof T]?: boolean}, values: T }>
export type Widget_choices_output<T extends { [key: string]: Widget }> = { [k in keyof T]?: ReqResult<T[k]> }
export interface Widget_choices<T extends { [key: string]: Widget }> extends IWidget<'choices', Widget_choices_opts<T>, Widget_choices_serial<T>, Widget_choices_state<T>, Widget_choices_output<T>> {}
export class Widget_choices<T extends { [key: string]: Widget }> implements IRequest<'choices', Widget_choices_opts<T>, Widget_choices_serial<T>, Widget_choices_state<T>, Widget_choices_output<T>> {
    isOptional = false
    id: string
    type: 'choices' = 'choices'
    state: Widget_choices_state<T>
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public input: Widget_choices_opts<T>,
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
                    this.state.values[key] = this.builder._HYDRATE(newType, newInput, prevValue_)
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
export type Widget_enum_opts<T extends KnownEnumNames>  = ReqInput<{ default?: Requirable[T]; enumName: T }>
export type Widget_enum_serial<T extends KnownEnumNames> = Widget_enum_state<T>
export type Widget_enum_state<T extends KnownEnumNames>  = StateFields<{ type: 'enum', active: true; val: Requirable[T] }>
export type Widget_enum_output<T extends KnownEnumNames> = Requirable[T]
export interface Widget_enum<T extends KnownEnumNames> extends IWidget<'enum', Widget_enum_opts<T>, Widget_enum_serial<T>, Widget_enum_state<T>, Widget_enum_output<T>> {}
export class Widget_enum<T extends KnownEnumNames> implements IRequest<'enum', Widget_enum_opts<T>, Widget_enum_serial<T>, Widget_enum_state<T>, Widget_enum_output<T>> {
    isOptional = false
    id: string
    type: 'enum' = 'enum'
    state: Widget_enum_state<T>
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public input: Widget_enum_opts<T>,
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
export type Widget_enumOpt_opts<T extends KnownEnumNames>  = ReqInput<{ default?: Requirable[T]; enumName: T }>
export type Widget_enumOpt_serial<T extends KnownEnumNames> = Widget_enumOpt_state<T>
export type Widget_enumOpt_state<T extends KnownEnumNames>  = StateFields<{ type: 'enumOpt', active: boolean; val: Requirable[T] }>
export type Widget_enumOpt_output<T extends KnownEnumNames> = Maybe<Requirable[T]>
export interface Widget_enumOpt<T extends KnownEnumNames> extends IWidget<'enumOpt', Widget_enumOpt_opts<T>, Widget_enumOpt_serial<T>, Widget_enumOpt_state<T>, Widget_enumOpt_output<T>> {}
export class Widget_enumOpt<T extends KnownEnumNames> implements IRequest<'enumOpt', Widget_enumOpt_opts<T>, Widget_enumOpt_serial<T>, Widget_enumOpt_state<T>, Widget_enumOpt_output<T>> {
    isOptional = true
    id: string
    type: 'enumOpt' = 'enumOpt'
    state: Widget_enumOpt_state<T>
    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public input: Widget_enumOpt_opts<T>,
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



WidgetDI.Widget_color              = Widget_color
WidgetDI.Widget_str                = Widget_str
WidgetDI.Widget_strOpt             = Widget_strOpt
WidgetDI.Widget_prompt             = Widget_prompt
WidgetDI.Widget_promptOpt          = Widget_promptOpt
WidgetDI.Widget_seed               = Widget_seed
WidgetDI.Widget_int                = Widget_int
WidgetDI.Widget_float              = Widget_float
WidgetDI.Widget_bool               = Widget_bool
WidgetDI.Widget_inlineRun          = Widget_inlineRun
WidgetDI.Widget_intOpt             = Widget_intOpt
WidgetDI.Widget_floatOpt           = Widget_floatOpt
WidgetDI.Widget_markdown           = Widget_markdown
WidgetDI.Widget_custom             = Widget_custom
WidgetDI.Widget_size               = Widget_size
WidgetDI.Widget_matrix             = Widget_matrix
WidgetDI.Widget_loras              = Widget_loras
WidgetDI.Widget_image              = Widget_image
WidgetDI.Widget_imageOpt           = Widget_imageOpt
WidgetDI.Widget_selectOneOrCustom  = Widget_selectOneOrCustom
WidgetDI.Widget_selectMany         = Widget_selectMany
WidgetDI.Widget_selectManyOrCustom = Widget_selectManyOrCustom
WidgetDI.Widget_selectOne          = Widget_selectOne
WidgetDI.Widget_list               = Widget_list
WidgetDI.Widget_group              = Widget_group
WidgetDI.Widget_groupOpt           = Widget_groupOpt
WidgetDI.Widget_choice             = Widget_choice
WidgetDI.Widget_choices            = Widget_choices
WidgetDI.Widget_enum               = Widget_enum
WidgetDI.Widget_enumOpt            = Widget_enumOpt
WidgetDI.Widget_listExt            = Widget_listExt
WidgetDI.Widget_orbit              = Widget_orbit
