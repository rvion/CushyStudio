import type { CovariantFC } from '../csuite'
import type { BaseSchema } from '../csuite/model/BaseSchema'
import type { FieldConfig } from '../csuite/model/FieldConfig'
import type { FieldSerial } from '../csuite/model/FieldSerial'
import type { Repository } from '../csuite/model/Repository'
import type { Problem_Ext } from '../csuite/model/Validation'
import type { Tree } from '@lezer/common'

import { registerFieldClass } from '../csuite/fields/WidgetUI.DI'
import { Field } from '../csuite/model/Field'
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
export type Field_prompt_config = FieldConfig<
    {
        default?: string
        placeHolder?: string
    },
    Field_prompt_types
>

// SERIAL FROM VALUE
export const Field_prompt_fromValue = (val: Field_prompt_value): Field_prompt_serial => ({
    $: 'prompt',
    val: val.text,
})

// SERIAL
export type Field_prompt_serial = FieldSerial<{
    $: 'prompt'
    val?: string
}>

// VALUE
export type Field_prompt_value = Field_prompt // { text: string; tree: Tree }

// TYPES
export type Field_prompt_types = {
    $Type: 'prompt'
    $Config: Field_prompt_config
    $Serial: Field_prompt_serial
    $Value: Field_prompt_value
    $Field: Field_prompt
}

// STATE
export class Field_prompt extends Field<Field_prompt_types> {
    // DefaultHeaderUI = () => createElement(WidgetPrompt_LineUI, { widget: this })
    // DefaultBodyUI = () => createElement(WidgetPromptUI, { widget: this })
    // DefaultHeaderUI = WidgetPrompt_LineUI
    // DefaultBodyUI = WidgetPromptUI

    get DefaultHeaderUI(): CovariantFC<{ field: Field_prompt }> {
        if (this.isCollapsed) return WidgetPrompt_LineUI
        return WidgetPromptUI
    }

    DefaultBodyUI = undefined // WidgetPromptUI

    get isCollapsible(): boolean {
        return true
    }

    static readonly type: 'prompt' = 'prompt'

    get ownProblems(): Problem_Ext {
        return null
    }

    get hasChanges(): boolean {
        return (this.serial.val ?? '') !== (this.config.default ?? '')
    }

    constructor(
        //
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: BaseSchema<Field_prompt>,
        serial?: Field_prompt_serial,
    ) {
        super(repo, root, parent, schema)
        this.init(serial, {
            DefaultBodyUI: false,
            DefaultHeaderUI: false,
        })
    }

    protected setOwnSerial(serial: Maybe<Field_prompt_serial>): void {
        this.serial.val = serial?.val ?? this.defaultValue
    }

    // sentinel value so we know when to trigger update effect in the UI to update
    // codemirror uncontrolled component
    _valueUpdatedViaAPIAt: Maybe<Timestamp> = null

    /** DO NOT CALL YOURSELF; use `field.text =` setter instead */
    setText_INTERNAL(next: string): void {
        if (this.serial.val === next) return
        this.runInValueTransaction(() => (this.serial.val = next))
    }

    setText(next: string): void {
        this.text = next
    }
    set text(next: string) {
        if (this.serial.val === next) return
        this.runInSerialTransaction(() => {
            // widget prompt uses codemirror, and codemirror manage its internal state itsef.
            // making the widget "uncontrolled". Usual automagical mobx-reactivity may not always apply.
            // To allow CodeMirror editor to react to external value changes, we need to use an effect in the UI.
            // To know when to run the effect, we update `valueUpdatedViaAPIAt` here to trigger the effect.
            this._valueUpdatedViaAPIAt = Date.now() as Timestamp
            this.serial.val = next
        })
    }

    // the raw unparsed text
    get text(): string {
        return this.serial.val ?? ''
    }

    // the parsed tree
    get ast(): PromptAST {
        return new PromptAST(this.text)
    }

    get ast_generic(): Tree {
        return parser.parse(this.serial.val ?? '')
    }

    get defaultValue(): string {
        return this.config.default ?? ''
    }

    get value(): Field_prompt_value {
        return this
        // return {
        //     text: this.serial.val ?? this.config.default ?? '',
        //     tree: this.ast,
        // }
    }

    set value(next: Field_prompt_value) {
        if (next !== this) throw new Error('not implemented')
        // do nothing, value it the instance itself
    }

    get animateResize(): false {
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
registerFieldClass('prompt', Field_prompt)
