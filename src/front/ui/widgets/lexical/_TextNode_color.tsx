import { EditorConfig, LexicalNode, NodeKey, TextNode } from 'lexical'

export class TextNode_color extends TextNode {
    __color: string

    constructor(text: string, color: string, key?: NodeKey) {
        super(text, key)
        this.__color = color
    }

    static getType(): string {
        return 'colored'
    }

    static clone(node: TextNode_color): TextNode_color {
        return new TextNode_color(node.__text, node.__color, node.__key)
    }

    isUnmergeable(): boolean {
        return true
    }

    createDOM(config: EditorConfig): HTMLElement {
        const element = super.createDOM(config)
        element.style.color = this.__color
        element.style.display = 'inline-block'
        return element
    }

    updateDOM(prevNode: TextNode_color, dom: HTMLElement, config: EditorConfig): boolean {
        const isUpdated = super.updateDOM(prevNode, dom, config)
        if (prevNode.__color !== this.__color) {
            dom.style.color = this.__color
            dom.style.display = 'inline-block'
        }
        return isUpdated
    }
}

export function $createColoredNode(text: string, color: string): TextNode_color {
    return new TextNode_color(text, color)
}

export function $isColoredNode(node: LexicalNode | null | undefined): node is TextNode_color {
    return node instanceof TextNode_color
}
