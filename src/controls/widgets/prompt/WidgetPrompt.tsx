import type { PromptLangNodeName } from 'src/controls/widgets/prompt/grammar/grammar.types'
import type { SyntaxNodeRef } from '@lezer/common'
import type { FormBuilder } from '../../FormBuilder'
import type { IWidget, WidgetConfigFields, WidgetSerialFields, WidgetTypeHelpers } from '../../IWidget'
import type { Tree } from '@lezer/common'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { WidgetDI } from '../WidgetUI.DI'
import { hash } from 'ohash'
import { parser } from './grammar/grammar.parser'
import { $getWeightNumber, $getWildcardNamePos } from './cm-lang/LINT'

export type Widget_prompt_config = WidgetConfigFields<{ default?: string; textarea?: boolean; placeHolder?: string }>
export type Widget_prompt_serial = WidgetSerialFields<{ type: 'prompt'; val?: string }>
export type Widget_prompt_output = Widget_prompt // { text: string; tree: Tree }
export type Widget_prompt_types = {
    $Type: 'prompt'
    $Input: Widget_prompt_config
    $Serial: Widget_prompt_serial
    $Output: Widget_prompt_output
}

// STATE
export interface Widget_prompt extends WidgetTypeHelpers<Widget_prompt_types> {}
export class Widget_prompt implements IWidget<Widget_prompt_types> {
    get serialHash () { return hash(this.result) } // prettier-ignore
    get isVerticalByDefault(): boolean {
        if (this.config.textarea) return true
        return false
    }

    get isCollapsible() { return this.config.textarea ?? false } // prettier-ignore

    readonly id: string
    readonly type: 'prompt' = 'prompt'

    serial: Widget_prompt_serial

    constructor(public readonly form: FormBuilder, public readonly config: Widget_prompt_config, serial?: Widget_prompt_serial) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            type: 'prompt',
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
    get result(): Widget_prompt_output {
        return this
        // return {
        //     text: this.serial.val ?? this.config.default ?? '',
        //     tree: this.ast,
        // }
    }

    compile = (p: {
        /** for wildcards */
        seed?: number
        onLora: (lora: Enum_Load_Lora_lora_name) => void
    }) => {
        let textOUT = ''
        // const textToOutput: string[] = []
        const CONTENT = this.text
        const st = this.form.schema.st
        const tree = parser.parse(CONTENT ?? '')
        const cursor = tree.cursor()

        let weights = 1

        cursor.iterate(
            // enter
            (ref: SyntaxNodeRef) => {
                const toktype = ref.name as PromptLangNodeName
                const _lastChar = textOUT[textOUT.length - 1] ?? ''
                const _space = _lastChar === ' ' ? '' : ' '
                // const TXT = () => CONTENT.slice(node.from, node.to)
                // TODO: if (toktype === 'booru') text += `${_space}${tok.tag.text}`
                if (toktype === 'WeightedExpression') {
                    const [from, to] = $getWeightNumber(ref)
                    const numberTxt = CONTENT.slice(from, to)
                    const float = parseFloat(numberTxt)
                    weights *= float
                }
                if (toktype === 'Identifier') {
                    textOUT +=
                        weights == 1 //
                            ? `${_space}${CONTENT.slice(ref.from, ref.to)}`
                            : `${_space}(${CONTENT.slice(ref.from, ref.to)}:${weights})`
                    return false
                }
                if (toktype === 'String') {
                    textOUT +=
                        weights == 1 //
                            ? `${_space}${CONTENT.slice(ref.from + 1, ref.to - 1)}`
                            : `${_space}(${CONTENT.slice(ref.from + 1, ref.to - 1)}:${weights})`
                    return false
                }
                if (toktype === 'Embedding') {
                    const [from, to] = $getWildcardNamePos(ref)
                    const embeddingName = CONTENT.slice(from, to) as Embeddings
                    textOUT += `${_space}embedding:${embeddingName}`
                    return false
                }
                if (toktype === 'Wildcards') {
                    const [from, to] = $getWildcardNamePos(ref)
                    const wildcardName = CONTENT.slice(from, to)
                    const options = (st.wildcards as any)[wildcardName]
                    if (!Array.isArray(options)) {
                        console.log(`[❌] invalid wildcard`)
                        return false
                    }
                    const picked = st.chooseRandomly(wildcardName, p.seed ?? Math.floor(Math.random() * 99999999), options)
                    textOUT +=
                        weights == 1 //
                            ? `${_space}${picked}`
                            : `${_space}(${picked}:${weights})`
                    return false
                }
                if (toktype === 'Lora') {
                    const [from, to] = $getWildcardNamePos(ref)
                    const loraName = CONTENT.slice(from, to) as Enum_LoraLoader_lora_name
                    // 🔴
                    // 🔴const next = run.nodes.LoraLoader({
                    // 🔴    model: ckpt,
                    // 🔴    clip: clip,
                    // 🔴    lora_name: loraName,
                    // 🔴    strength_clip: weights, // tok.loraDef.strength_clip,
                    // 🔴    strength_model: weights, // tok.loraDef.strength_model,
                    // 🔴})

                    const associatedText = st.getLoraAssociatedTriggerWords(loraName)
                    if (associatedText) textOUT += ` ${associatedText}`

                    // 🔴 clip = next._CLIP
                    // 🔴 ckpt = next._MODEL
                }
            },
            // leave
            (ref) => {
                const toktype = ref.name as PromptLangNodeName
                if (toktype === 'WeightedExpression') {
                    const [from, to] = $getWeightNumber(ref)
                    const numberTxt = CONTENT.slice(from, to)
                    const float = parseFloat(numberTxt)
                    weights /= float
                }
            },
        )
        return textOUT
    }
}

// DI
WidgetDI.Widget_prompt = Widget_prompt
