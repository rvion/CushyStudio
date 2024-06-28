import type { Entity } from '../csuite/model/Entity'
import type { FieldConfig } from '../csuite/model/FieldConfig'
import type { FieldSerial } from '../csuite/model/FieldSerial'
import type { ISchema } from '../csuite/model/ISchema'
import type { Problem_Ext } from '../csuite/model/Validation'
import type { Tree } from '@lezer/common'

import { nanoid } from 'nanoid'

import { registerWidgetClass } from '../csuite/fields/WidgetUI.DI'
import { BaseField } from '../csuite/model/BaseField'
import { compilePrompt } from './_compile'
import { parser } from './grammar/grammar.parser'
import { PromptAST } from './grammar/grammar.practical'
import { WidgetPrompt_LineUI, WidgetPromptUI } from './WidgetPromptUI'

export type CompiledPrompt = {
    /** e.g. "score_9 score_8 BREAK foo bar baz" */
    promptIncludingBreaks: string
    /**
     * only filled when prompt has `break`s
     * will return list of break-separated subprompts
     * e.g. ["score_9 score_8"], ["foo bar baz"]" */
    subPrompts: string[]
    debugText: string[]
}

// CONFIG
export type Widget_prompt_config = FieldConfig<
    {
        default?: string
        placeHolder?: string
    },
    Widget_prompt_types
>

// SERIAL FROM VALUE
export const Widget_prompt_fromValue = (val: Widget_prompt_value): Widget_prompt_serial => ({
    type: 'prompt',
    val: val.text,
})

// SERIAL
export type Widget_prompt_serial = FieldSerial<{
    type: 'prompt'
    val?: string
}>

// VALUE
export type Widget_prompt_value = Widget_prompt // { text: string; tree: Tree }

// TYPES
export type Widget_prompt_types = {
    $Type: 'prompt'
    $Config: Widget_prompt_config
    $Serial: Widget_prompt_serial
    $Value: Widget_prompt_value
    $Field: Widget_prompt
}

// STATE
export class Widget_prompt extends BaseField<Widget_prompt_types> {
    // DefaultHeaderUI = () => createElement(WidgetPrompt_LineUI, { widget: this })
    // DefaultBodyUI = () => createElement(WidgetPromptUI, { widget: this })
    DefaultHeaderUI = WidgetPrompt_LineUI
    DefaultBodyUI = WidgetPromptUI
    readonly id: string

    readonly type: 'prompt' = 'prompt'

    get baseErrors(): Problem_Ext {
        return null
    }

    get hasChanges(): boolean {
        return (this.serial.val ?? '') !== (this.config.default ?? '')
    }
    reset(): void {
        // /!\ reset function need to go though the `set text()` setter
        // to ensure the UI is updated (code-mirror specificity here)
        this.text = this.config.default ?? ''
    }

    serial: Widget_prompt_serial

    constructor(
        //
        entity: Entity,
        parent: BaseField | null,
        spec: ISchema<Widget_prompt>,
        serial?: Widget_prompt_serial,
    ) {
        super(entity, parent, spec)
        this.id = serial?.id ?? nanoid()
        const config = spec.config
        this.serial = serial ?? {
            type: 'prompt',
            val: config.default,
            collapsed: config.startCollapsed,
            id: this.id,
        }
        this.init({
            DefaultBodyUI: false,
            DefaultHeaderUI: false,
        })
    }

    // sentinel value so we know when to trigger update effect in the UI to update
    // codemirror uncontrolled component
    _valueUpdatedViaAPIAt: Maybe<Timestamp> = null

    setText_INTERNAL = (next: string) => {
        if (this.serial.val === next) return
        this.serial.val = next
        this.applyValueUpdateEffects()
    }

    set text(next: string) {
        if (this.serial.val === next) return
        // widget prompt uses codemirror, and codemirror manage its internal state itsef.
        // making the widget "uncontrolled". Usual automagical mobx-reactivity may not always apply.
        // To allow CodeMirror editor to react to external value changes, we need to use an effect in the UI.
        // To know when to run the effect, we update `valueUpdatedViaAPIAt` here to trigger the effect.
        this._valueUpdatedViaAPIAt = Date.now() as Timestamp
        this.serial.val = next
        this.applyValueUpdateEffects()
    }

    // the raw unparsed text
    get text() {
        return this.serial.val ?? ''
    }

    // the parsed tree
    get ast(): PromptAST {
        return new PromptAST(this.text)
    }

    get ast_generic(): Tree {
        return parser.parse(this.serial.val ?? '')
    }
    setValue(val: Widget_prompt_value) {
        this.value = val
    }
    set value(next: Widget_prompt_value) {
        if (next !== this) throw new Error('not implemented')
        // do nothing, value it the instance itself
    }
    get value(): Widget_prompt_value {
        return this
        // return {
        //     text: this.serial.val ?? this.config.default ?? '',
        //     tree: this.ast,
        // }
    }

    get animateResize() {
        // codemirror resize automatically every time a line is added
        // the animation is just annoying there.
        return false
    }

    compile = (p: {
        /** for wildcard */
        seed?: number
        onLora: (lora: Enum_LoraLoader_lora_name) => void
        /** @default true */
        printWildcards?: boolean
    }): CompiledPrompt =>
        compilePrompt({
            ctx: cushy,
            text: this.text,
            //
            onLora: p.onLora,
            seed: p.seed,
            printWildcards: p.printWildcards,
        })
}

// DI
registerWidgetClass('prompt', Widget_prompt)
