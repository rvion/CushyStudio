import { DecoratorNode, LexicalNode, NodeKey, SerializedLexicalNode } from 'lexical'
import { ReactNode } from 'react'
import { EmbeddingNodeUI } from './EmbeddingNodeUI'

export type EmbeddingNodeJSON = SerializedLexicalNode & { embeddingName: string; type: 'embedding' }
export class EmbeddingNode extends DecoratorNode<ReactNode> {
    constructor(public embeddingName: string, key?: NodeKey) {
        super(key)
    }

    static getType(): 'embedding' {
        return 'embedding'
    }

    static clone(node: EmbeddingNode): EmbeddingNode {
        return new EmbeddingNode(node.embeddingName, node.__key)
    }

    exportJSON(): EmbeddingNodeJSON {
        return { type: EmbeddingNode.getType(), embeddingName: this.embeddingName, version: 1 }
    }

    importJSON(json: EmbeddingNodeJSON): EmbeddingNode {
        return new EmbeddingNode(json.embeddingName)
    }

    static importJSON(json: EmbeddingNodeJSON): EmbeddingNode {
        return new EmbeddingNode(json.embeddingName)
    }

    isIsolated(): boolean { return true } // prettier-ignore
    isInline(): boolean { return true } // prettier-ignore
    isKeyboardSelectable(): boolean { return true } // prettier-ignore
    createDOM(): HTMLElement { return document.createElement('span') } // prettier-ignore
    updateDOM(): false { return false } // prettier-ignore
    decorate(): ReactNode { return <EmbeddingNodeUI node={this} /> } // prettier-ignore
}

export function $createEmbeddingNode(id: string): EmbeddingNode {
    return new EmbeddingNode(id)
}

export function $isEmbeddingNode(node: LexicalNode | null | undefined): node is EmbeddingNode {
    return node instanceof EmbeddingNode
}
