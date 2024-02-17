import type { Tree } from '@lezer/common'
import type { FormBuilder } from '../../FormBuilder'
import type { IWidget, WidgetConfigFields, WidgetSerialFields, WidgetTypeHelpers } from '../../IWidget'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { hash } from 'ohash'
import { WidgetDI } from '../WidgetUI.DI'
import { compilePrompt } from './_compile'
import { parser } from './grammar/grammar.parser'

export type Widget_prompt_config = WidgetConfigFields<{ default?: string; textarea?: boolean; placeHolder?: string }>
export type Widget_prompt_serial = WidgetSerialFields<{ type: 'prompt'; val?: string }>
export type Widget_prompt_output = Widget_prompt // { text: string; tree: Tree }
export type Widget_prompt_types = {
    $Type: 'prompt'
    $Input: Widget_prompt_config
    $Serial: Widget_prompt_serial
    $Output: Widget_prompt_output
}

export type CompiledPrompt = {
    positivePrompt: string
    negativePrompt: string
    debugText: string[]
}

// STATE
export interface Widget_prompt extends WidgetTypeHelpers<Widget_prompt_types> {}
export class Widget_prompt implements IWidget<Widget_prompt_types> {
    get serialHash () { return hash(this.serial.val) } // prettier-ignore
    isVerticalByDefault = true

    get isCollapsible() { return this.config.textarea ?? false } // prettier-ignore

    readonly id: string
    readonly type: 'prompt' = 'prompt'

    serial: Widget_prompt_serial

    constructor(public readonly form: FormBuilder, public readonly config: Widget_prompt_config, serial?: Widget_prompt_serial) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            type: 'prompt',
            val: config.default,
            collapsed: config.startCollapsed,
            id: this.id,
        }
        makeAutoObservable(this)
    }

    // the raw unparsed text
    get text() {
        return this.serial.val ?? ''
    }
    // the parsed tree
    get ast(): Tree {
        return parser.parse(this.serial.val ?? '')
    }
    get value(): Widget_prompt_output {
        return this
        // return {
        //     text: this.serial.val ?? this.config.default ?? '',
        //     tree: this.ast,
        // }
    }

    compile = (p: {
        /** for wildcard */
        seed?: number
        onLora: (lora: Enum_Load_Lora_lora_name) => void
        /** @default true */
        printWildcards?: boolean
    }): CompiledPrompt =>
        compilePrompt({
            st: cushy,
            text: this.text,
            //
            onLora: p.onLora,
            seed: p.seed,
            printWildcards: p.printWildcards,
        })
}

// DI
WidgetDI.Widget_prompt = Widget_prompt
