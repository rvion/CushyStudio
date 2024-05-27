import type { Timestamp } from '../../../cards/Timestamp'
import type { Form } from '../../Form'
import type { ISpec } from '../../ISpec'
import type { IWidget, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'
import type { Problem_Ext } from '../../Validation'
import type { Tree } from '@lezer/common'

import { nanoid } from 'nanoid'

import { makeAutoObservableInheritance } from '../../../utils/mobx-store-inheritance'
import { BaseWidget } from '../../BaseWidget'
import { registerWidgetClass } from '../WidgetUI.DI'
import { compilePrompt } from './_compile'
import { parser } from './grammar/grammar.parser'
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
export type Widget_prompt_config = WidgetConfigFields<
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
export type Widget_prompt_serial = WidgetSerialFields<{
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
    $Widget: Widget_prompt
}

// STATE
export interface Widget_prompt extends Widget_prompt_types {}
export class Widget_prompt extends BaseWidget implements IWidget<Widget_prompt_types> {
    // DefaultHeaderUI = () => createElement(WidgetPrompt_LineUI, { widget: this })
    // DefaultBodyUI = () => createElement(WidgetPromptUI, { widget: this })
    DefaultHeaderUI = WidgetPrompt_LineUI
    DefaultBodyUI = WidgetPromptUI
    readonly id: string

    readonly type: 'prompt' = 'prompt'

    get baseErrors(): Problem_Ext {
        return null
    }

    get hasChanges() {
        return (this.serial.val ?? '') !== (this.config.default ?? '')
    }
    reset() {
        // /!\ reset function need to go though the `set text()` setter
        // to ensure the UI is updated (code-mirror specificity here)
        this.text = this.config.default ?? ''
    }

    serial: Widget_prompt_serial

    constructor(
        //
        public readonly form: Form,
        public readonly parent: IWidget | null,
        public readonly spec: ISpec<Widget_prompt>,
        serial?: Widget_prompt_serial,
    ) {
        super()
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
    /* override */ background = true

    // sentinel value so we know when to trigger update effect in the UI to update
    // codemirror uncontrolled component
    _valueUpdatedViaAPIAt: Maybe<Timestamp> = null

    setText_INTERNAL = (next: string) => {
        if (this.serial.val === next) return
        this.serial.val = next
        this.bumpValue()
    }

    set text(next: string) {
        if (this.serial.val === next) return
        // widget prompt uses codemirror, and codemirror manage its internal state itsef.
        // making the widget "uncontrolled". Usual automagical mobx-reactivity may not always apply.
        // To allow CodeMirror editor to react to external value changes, we need to use an effect in the UI.
        // To know when to run the effect, we update `valueUpdatedViaAPIAt` here to trigger the effect.
        this._valueUpdatedViaAPIAt = Date.now() as Timestamp
        this.serial.val = next
        this.bumpValue()
    }

    // the raw unparsed text
    get text() {
        return this.serial.val ?? ''
    }
    // the parsed tree
    get ast(): Tree {
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
registerWidgetClass('prompt', Widget_prompt)
