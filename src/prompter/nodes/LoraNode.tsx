import { DecoratorNode, LexicalNode, NodeKey, SerializedLexicalNode } from 'lexical'
import { ReactNode } from 'react'

export type LoraNodeJSON = SerializedLexicalNode & {
    // strength_clip: number
    // strength_model: number
    loraName: Enum_LoraLoader_Lora_name
    type: 'lora'
}
export class LoraNode extends DecoratorNode<ReactNode> {
    constructor(
        public loraName: Enum_LoraLoader_Lora_name,
        key?: NodeKey,
    ) {
        super(key)
    }

    static getType(): 'lora' {
        return 'lora'
    }

    static clone(node: LoraNode): LoraNode {
        return new LoraNode(node.loraName, node.__key)
    }

    exportJSON(): LoraNodeJSON {
        return {
            type: LoraNode.getType(),
            loraName: this.loraName,
            version: 1,
        }
    }

    importJSON(json: LoraNodeJSON): LoraNode {
        return new LoraNode(json.loraName)
    }

    static importJSON(json: LoraNodeJSON): LoraNode {
        return new LoraNode(json.loraName)
    }

    isIsolated(): boolean { return true } // prettier-ignore
    isInline(): boolean { return true } // prettier-ignore
    isKeyboardSelectable(): boolean { return true } // prettier-ignore
    createDOM(): HTMLElement { return document.createElement('span') } // prettier-ignore
    updateDOM(): false { return false } // prettier-ignore
    decorate(): ReactNode { return <span className='bg-blue-800 mr-1'>{this.loraName}</span> } // prettier-ignore
}

export function $createLoraNode(loraName: Enum_LoraLoader_Lora_name): LoraNode {
    return new LoraNode(loraName)
}

export function $isLoraNode(node: LexicalNode | null | undefined): node is LoraNode {
    return node instanceof LoraNode
}
