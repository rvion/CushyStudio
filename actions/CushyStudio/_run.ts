/**
 * 📝 This file showcase how you can modularize your run definitions
 * so you can re-use parts to add subgraphs very easilly to any action
 *
 * ✅ please, don't use `import` import this file, except for `import types`
 */
import type { NodeBuilder } from 'src/back/NodeBuilder'
import type { Runtime } from 'src/back/Runtime'
import type { WidgetPromptOutput } from 'src/prompter/WidgetPromptUI'

export class Action_Helper {
    /**
     * here, I make sure both `flow` and `graph` are always
     * available in all subsequent methods
     */
    graph: NodeBuilder
    constructor(public flow: Runtime) {
        this.graph = this.flow.nodes
    }

    procesPromptResult = (
        promptResult: WidgetPromptOutput,
        startingClipAndModel: HasSingle_CLIP & HasSingle_MODEL,
    ): {
        text: string
        clipAndModel: HasSingle_CLIP & HasSingle_MODEL
    } => {
        let text = ''
        const positivePrompt = promptResult
        let clipAndModel = startingClipAndModel
        if (positivePrompt) {
            for (const tok of positivePrompt.tokens) {
                if (tok.type === 'booru') text += ` ${tok.tag.text}`
                else if (tok.type === 'text') text += ` ${tok.text}`
                else if (tok.type === 'embedding') text += ` embedding:${tok.embeddingName}`
                else if (tok.type === 'wildcard') {
                    const options = (this.flow.wildcards as any)[tok.payload]
                    if (Array.isArray(options)) text += ` ${this.flow.pick(options)}`
                } else if (tok.type === 'lora') {
                    clipAndModel = this.flow.nodes.LoraLoader({
                        model: clipAndModel,
                        clip: clipAndModel,
                        lora_name: tok.loraDef.name,
                        strength_clip: tok.loraDef.strength_clip,
                        strength_model: tok.loraDef.strength_model,
                    })
                }
            }
        }
        return {
            text,
            clipAndModel,
        }
    }
}
