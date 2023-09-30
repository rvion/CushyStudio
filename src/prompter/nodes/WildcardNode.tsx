import { DecoratorNode, LexicalNode, NodeKey, SerializedLexicalNode } from 'lexical'
import { ReactNode } from 'react'

export type WildcardNodeJSON = SerializedLexicalNode & { payload: string; type: 'wildcard' }
export class WildcardNode extends DecoratorNode<ReactNode> {
    constructor(
        public wildcardName: string,
        key?: NodeKey,
    ) {
        super(key)
    }

    static getType(): 'wildcard' {
        return 'wildcard'
    }

    static clone(node: WildcardNode): WildcardNode {
        return new WildcardNode(node.wildcardName, node.__key)
    }

    exportJSON(): WildcardNodeJSON {
        return { type: WildcardNode.getType(), payload: this.wildcardName, version: 1 }
    }

    importJSON(json: WildcardNodeJSON): WildcardNode {
        return new WildcardNode(json.payload)
    }

    static importJSON(json: WildcardNodeJSON): WildcardNode {
        return new WildcardNode(json.payload)
    }

    isIsolated(): boolean { return true } // prettier-ignore
    isInline(): boolean { return true } // prettier-ignore
    isKeyboardSelectable(): boolean { return true } // prettier-ignore
    createDOM(): HTMLElement { return document.createElement('span') } // prettier-ignore
    updateDOM(): false { return false } // prettier-ignore
    decorate(): ReactNode { return <span className='bg-yellow-800 mr-1'>{this.wildcardName}</span> } // prettier-ignore
}

export function $createWildcardNode(id: string): WildcardNode {
    return new WildcardNode(id)
}

export function $isWildcardNode(node: LexicalNode | null | undefined): node is WildcardNode {
    return node instanceof WildcardNode
}
