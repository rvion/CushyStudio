import { DecoratorNode, LexicalNode, NodeKey, SerializedLexicalNode } from 'lexical'
import { ReactNode } from 'react'
import { DanbooruTag } from '../booru/BooruLoader'

export type BooruNodeJSON = SerializedLexicalNode & { payload: DanbooruTag; type: 'booru' }
export class BooruNode extends DecoratorNode<ReactNode> {
    constructor(
        public booru: DanbooruTag,
        key?: NodeKey,
    ) {
        super(key)
    }

    static getType(): 'booru' {
        return 'booru'
    }

    static clone(node: BooruNode): BooruNode {
        return new BooruNode(node.booru, node.__key)
    }

    exportJSON(): BooruNodeJSON {
        return { type: BooruNode.getType(), payload: this.booru, version: 1 }
    }

    importJSON(json: BooruNodeJSON): BooruNode {
        return new BooruNode(json.payload)
    }

    isIsolated(): boolean { return true } // prettier-ignore
    isInline(): boolean { return true } // prettier-ignore
    isKeyboardSelectable(): boolean { return true } // prettier-ignore
    createDOM(): HTMLElement { return document.createElement('span') } // prettier-ignore
    updateDOM(): false { return false } // prettier-ignore
    decorate(): ReactNode { return <span className='bg-teal-800 mr-1'>{this.booru.text}</span> } // prettier-ignore
}

export function $createBooruNode(booru: DanbooruTag): BooruNode {
    return new BooruNode(booru)
}

export function $isBooruNode(node: LexicalNode | null | undefined): node is BooruNode {
    return node instanceof BooruNode
}
