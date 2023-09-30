import { DecoratorNode, LexicalNode, NodeKey } from 'lexical'
import { ReactNode } from 'react'

export class EmbeddingNode extends DecoratorNode<ReactNode> {
    __id: string
    constructor(id: string, key?: NodeKey) {
        super(key)
        this.__id = id
    }

    static getType(): string {
        return 'embedding'
    }

    static clone(node: EmbeddingNode): EmbeddingNode {
        return new EmbeddingNode(node.__id, node.__key)
    }

    isIsolated(): boolean { return true } // prettier-ignore
    isInline(): boolean { return true } // prettier-ignore
    isKeyboardSelectable(): boolean { return true } // prettier-ignore
    createDOM(): HTMLElement { return document.createElement('span') } // prettier-ignore
    updateDOM(): false { return false } // prettier-ignore
    decorate(): ReactNode { return <span className='bg-red-800'>{this.__id}</span> } // prettier-ignore
}

export function $createEmbeddingNode(id: string): EmbeddingNode {
    return new EmbeddingNode(id)
}

export function $isEmbeddingNode(node: LexicalNode | null | undefined): node is EmbeddingNode {
    return node instanceof EmbeddingNode
}
