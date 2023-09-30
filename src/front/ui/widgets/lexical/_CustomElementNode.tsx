import { ElementNode, LexicalNode } from 'lexical'

export class CustomParagraphNode extends ElementNode {
    static getType(): string {
        return 'custom-paragraph'
    }

    static clone(node: CustomParagraphNode): CustomParagraphNode {
        return new CustomParagraphNode(node.__key)
    }

    createDOM(): HTMLElement {
        // Define the DOM element here
        const dom = document.createElement('span')
        return dom
    }

    updateDOM(prevNode: CustomParagraphNode, dom: HTMLElement): boolean {
        // Returning false tells Lexical that this node does not need its
        // DOM element replacing with a new copy from createDOM.
        return false
    }
}

export function $createCustomParagraphNode(): CustomParagraphNode {
    return new CustomParagraphNode()
}

export function $isCustomParagraphNode(node: LexicalNode | null | undefined): node is CustomParagraphNode {
    return node instanceof CustomParagraphNode
}
