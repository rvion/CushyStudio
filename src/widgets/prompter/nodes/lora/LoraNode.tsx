import { $getRoot, DecoratorNode, LexicalNode, NodeKey, SerializedLexicalNode } from 'lexical'
import { observable, toJS } from 'mobx'
import { ReactNode } from 'react'
import { SimplifiedLoraDef } from 'src/presets/SimplifiedLoraDef'
import { LoraNodeUI } from './LoraNodeUI'

export type LoraNodeJSON = SerializedLexicalNode & {
    loraDef: SimplifiedLoraDef
    type: 'lora'
}
export class LoraNode extends DecoratorNode<ReactNode> {
    loraDef: SimplifiedLoraDef
    constructor(loraDef: SimplifiedLoraDef, key?: NodeKey) {
        super(key)
        this.loraDef = observable(loraDef)
    }

    static getType(): 'lora' {
        return 'lora'
    }

    static clone(node: LoraNode): LoraNode {
        return new LoraNode(node.loraDef, node.__key)
    }

    exportJSON(): LoraNodeJSON {
        return {
            type: LoraNode.getType(),
            loraDef: toJS(this.loraDef),
            version: 1,
        }
    }

    importJSON(json: LoraNodeJSON): LoraNode {
        return new LoraNode(json.loraDef)
    }

    static importJSON(json: LoraNodeJSON): LoraNode {
        return new LoraNode(json.loraDef)
    }

    isIsolated(): boolean { return true } // prettier-ignore
    isInline(): boolean { return true } // prettier-ignore
    isKeyboardSelectable(): boolean { return true } // prettier-ignore
    createDOM(): HTMLElement { return document.createElement('span') } // prettier-ignore
    updateDOM(): false { return false } // prettier-ignore
    decorate(): ReactNode { return <LoraNodeUI node={this} /> } // prettier-ignore
}

export function $createLoraNode(loraDef: SimplifiedLoraDef): LoraNode {
    return new LoraNode(loraDef)
}

export function $isLoraNode(node: LexicalNode | null | undefined): node is LoraNode {
    return node instanceof LoraNode
}
