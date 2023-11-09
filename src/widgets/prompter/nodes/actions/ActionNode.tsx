import { DecoratorNode, LexicalNode, NodeKey, SerializedLexicalNode } from 'lexical'
import { observable } from 'mobx'
import { ReactNode } from 'react'
import { ActionTagMethod } from 'src/cards/Card'
import { ActionNodeUI } from './ActionNodeUI'

export type ActionTag = {
    key: string
    action: ActionTagMethod
}

export type ActionTagInst = {
    tag: ActionTag
    param: string
}

export type ActionNodeJSON = SerializedLexicalNode & { tag: ActionTagInst; type: 'action' }
export class ActionNode extends DecoratorNode<ReactNode> {
    tag: ActionTagInst
    constructor(tag: ActionTagInst, key?: NodeKey) {
        super(key)
        this.tag = observable(tag)
    }

    setParam(v: string): void {
        this.param = v
    }

    static getType(): 'action' {
        return 'action'
    }

    static clone(node: ActionNode): ActionNode {
        return new ActionNode(node.tag, node.__key)
    }

    exportJSON(): ActionNodeJSON {
        return { type: ActionNode.getType(), tag: this.tag, version: 1 }
    }

    importJSON(json: ActionNodeJSON): ActionNode {
        return new ActionNode(json.tag)
    }

    static importJSON(json: ActionNodeJSON): ActionNode {
        return new ActionNode(json.tag)
    }

    isIsolated(): boolean { return true } // prettier-ignore
    isInline(): boolean { return true } // prettier-ignore
    isKeyboardSelectable(): boolean { return true } // prettier-ignore
    createDOM(): HTMLElement { return document.createElement('span') } // prettier-ignore
    updateDOM(): false { return false } // prettier-ignore
    decorate(): ReactNode { return <ActionNodeUI node={this} /> } // prettier-ignore
}

export function $createActionNode(tag: ActionTagInst, key?: NodeKey): ActionNode {
    return new ActionNode(tag, key)
}

export function $isActionNode(node: LexicalNode | null | undefined): node is ActionNode {
    return node instanceof ActionNode
}
