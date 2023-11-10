import { DecoratorNode, LexicalNode, NodeKey, SerializedLexicalNode } from 'lexical'
import { ReactNode } from 'react'
import { BreakNodeUI } from './BreakNodeUI'

export type PossibleBreakType = 'basic'
export type BreakNodeJSON = SerializedLexicalNode & { breakType: PossibleBreakType; type: 'break' }
export class BreakNode extends DecoratorNode<ReactNode> {
    constructor(public breakType: PossibleBreakType, key?: NodeKey) {
        super(key)
    }

    static getType(): 'break' {
        return 'break'
    }

    static clone(node: BreakNode): BreakNode {
        return new BreakNode(node.breakType, node.__key)
    }

    exportJSON(): BreakNodeJSON {
        return { type: BreakNode.getType(), breakType: this.breakType, version: 1 }
    }

    importJSON(json: BreakNodeJSON): BreakNode {
        return new BreakNode(json.breakType)
    }

    static importJSON(json: BreakNodeJSON): BreakNode {
        return new BreakNode(json.breakType)
    }

    isIsolated(): boolean { return true } // prettier-ignore
    isInline(): boolean { return true } // prettier-ignore
    isKeyboardSelectable(): boolean { return true } // prettier-ignore
    createDOM(): HTMLElement { return document.createElement('span') } // prettier-ignore
    updateDOM(): false { return false } // prettier-ignore
    decorate(): ReactNode { return <BreakNodeUI node={this} /> } // prettier-ignore
}

export function $createBreakNode(breakType: PossibleBreakType): BreakNode {
    return new BreakNode(breakType)
}

export function $isBreakNode(node: LexicalNode | null | undefined): node is BreakNode {
    return node instanceof BreakNode
}
