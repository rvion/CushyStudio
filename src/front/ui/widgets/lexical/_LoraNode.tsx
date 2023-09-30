import { DecoratorNode, LexicalNode, NodeKey, SerializedLexicalNode } from 'lexical'
import { ReactNode } from 'react'

export type LoraNodeJSON = SerializedLexicalNode & { payload: string; type: 'lora' }
export class LoraNode extends DecoratorNode<ReactNode> {
    constructor(
        public loraName: string,
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
        return { type: LoraNode.getType(), payload: this.loraName, version: 1 }
    }

    importJSON(json: LoraNodeJSON): LoraNode {
        return new LoraNode(json.payload)
    }

    isIsolated(): boolean { return true } // prettier-ignore
    isInline(): boolean { return true } // prettier-ignore
    isKeyboardSelectable(): boolean { return true } // prettier-ignore
    createDOM(): HTMLElement { return document.createElement('span') } // prettier-ignore
    updateDOM(): false { return false } // prettier-ignore
    decorate(): ReactNode { return <span className='bg-blue-800 mr-1'>{this.loraName}</span> } // prettier-ignore
}

export function $createLoraNode(id: string): LoraNode {
    return new LoraNode(id)
}

export function $isLoraNode(node: LexicalNode | null | undefined): node is LoraNode {
    return node instanceof LoraNode
}
