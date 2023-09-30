import { DecoratorNode, LexicalNode, NodeKey } from 'lexical'
import { ReactNode } from 'react'

export class LoraNode extends DecoratorNode<ReactNode> {
    __id: string
    constructor(id: string, key?: NodeKey) {
        super(key)
        this.__id = id
    }

    static getType(): string {
        return 'lora'
    }

    static clone(node: LoraNode): LoraNode {
        return new LoraNode(node.__id, node.__key)
    }

    isIsolated(): boolean { return true } // prettier-ignore
    isInline(): boolean { return true } // prettier-ignore
    isKeyboardSelectable(): boolean { return true } // prettier-ignore
    createDOM(): HTMLElement { return document.createElement('span') } // prettier-ignore
    updateDOM(): false { return false } // prettier-ignore
    decorate(): ReactNode { return <span className='bg-blue-800'>{this.__id}</span> } // prettier-ignore
}

export function $createLoraNode(id: string): LoraNode {
    return new LoraNode(id)
}

export function $isLoraNode(node: LexicalNode | null | undefined): node is LoraNode {
    return node instanceof LoraNode
}
