import { DecoratorNode, LexicalNode, NodeKey, SerializedLexicalNode } from 'lexical'
import { ReactNode } from 'react'

export type UserNodeJSON = SerializedLexicalNode & { tag: string; type: 'user' }
export class UserNode extends DecoratorNode<ReactNode> {
    constructor(
        public tag: string,
        key?: NodeKey,
    ) {
        super(key)
    }

    static getType(): 'user' {
        return 'user'
    }

    static clone(node: UserNode): UserNode {
        return new UserNode(node.booru, node.__key)
    }

    exportJSON(): UserNodeJSON {
        return { type: UserNode.getType(), tag: this.tag, version: 1 }
    }

    importJSON(json: UserNodeJSON): UserNode {
        return new UserNode(json.tag)
    }

    static importJSON(json: UserNodeJSON): UserNode {
        return new UserNode(json.tag)
    }

    isIsolated(): boolean { return true } // prettier-ignore
    isInline(): boolean { return true } // prettier-ignore
    isKeyboardSelectable(): boolean { return true } // prettier-ignore
    createDOM(): HTMLElement { return document.createElement('span') } // prettier-ignore
    updateDOM(): false { return false } // prettier-ignore
    decorate(): ReactNode { return <span className='bg-purple-800'>{this.booru.text}</span> } // prettier-ignore
}

export function $createUserNode(tag: string, key?: NodeKey): UserNode {
    return new UserNode(tag, key);
}

export function $isUserNode(node: LexicalNode | null | undefined): node is UserNode {
    return node instanceof UserNode
}
