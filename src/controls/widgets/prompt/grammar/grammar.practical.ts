import type { EditorView } from 'codemirror'

import Lezer, { SyntaxNode } from '@lezer/common'

import { parser } from './grammar.parser'

type KnownNodeNames = keyof typeof import('./grammar.parser.terms')

// ----------------------------------------
// prettier-ignore
type CLASSES = {
    Prompt:             Prompt_Prompt
    Lora:               Prompt_Lora
    Identifier:         Prompt_Identifier
    Number:             Prompt_Number
    Separator:          Prompt_Separator
    Content:            Prompt_Content
    WeightedExpression: Prompt_WeightedExpression
    Break:              Prompt_Break
    Comment:            Prompt_Comment
    Embedding:          Prompt_Embedding
    Permutations:       Prompt_Permutations
    String:             Prompt_String
    Tag:                Prompt_Tag
    TagName:            Prompt_TagName
    Wildcard:           Prompt_Wildcard
}
// 1. wrap text
export class PromptAST {
    findAll = <T extends KnownNodeNames>(kind: T): CLASSES[T][] => {
        const result: CLASSES[T][] = []
        this.root.iterate((node) => {
            if (node.$kind === kind) result.push(node as CLASSES[T])
            return true
        })
        return result
    }

    tree: Lezer.Tree
    // prettier-ignore
    knownNodes: { [key in KnownNodeNames]: any } = {
        Prompt            : Prompt_Prompt,
        Lora              : Prompt_Lora,
        Identifier        : Prompt_Identifier,
        Number            : Prompt_Number,
        Separator         : Prompt_Separator,
        Content           : Prompt_Content,
        WeightedExpression: Prompt_WeightedExpression,
        Break             : Prompt_Break,
        Comment           : Prompt_Comment,
        Embedding         : Prompt_Embedding,
        Permutations      : Prompt_Permutations,
        String            : Prompt_String,
        Tag               : Prompt_Tag,
        TagName           : Prompt_TagName,
        Wildcard          : Prompt_Wildcard,
    }

    toString = () => {
        const lines: string[] = []
        this.root.printSubTree(lines)
        return lines.join('\n')
    }

    print = () => {
        console.log(this.toString())
    }

    traverseGood = (p: {
        [k in keyof CLASSES]: (t: CLASSES[k]) => boolean
    }) => this.root.traverseGood(p)

    root!: ManagedNode
    constructor(
        //
        public CONTENT: string,
        /** require if you want to update the text programmatically */
        public editorView?: Maybe<EditorView>,
    ) {
        this.tree = parser.parse(CONTENT)
        let stack: ManagedNode[] = []
        this.tree.iterate({
            enter: (nodeRef) => {
                // special case for root

                const parent = stack[stack.length - 1]
                const name = nodeRef.name as KnownNodeNames
                const ctor = this.knownNodes[name] || Prompt_Unknown
                // 🔶 typed as an
                const inst = new ctor(this, parent, nodeRef.node)
                stack.push(inst)

                if (parent == null && name !== 'Prompt') throw new Error(`[❌] root node must be "Prompt" but got "${name}"`)
                if (this.root != null && nodeRef.name === 'Prompt')
                    throw new Error(`[❌] root node already set to "${this.root.node.name}"`)
                if (nodeRef.name === 'Prompt') this.root = inst
            },
            leave(node) {
                stack.pop()
            },
        })
    }
}

// ----------------------------------------
// base node wrapper
abstract class ManagedNode<Name extends KnownNodeNames = any> {
    abstract $kind: Name
    get from() {
        return this.node.from
    }
    get to() {
        return this.node.to
    }
    get text(): string {
        return this.expression.CONTENT.slice(this.from, this.to)
    }
    childrens: ManagedNode[] = []

    get ancestorsIncludingSelf(): ManagedNode[] {
        let result: ManagedNode[] = []
        let current: Maybe<ManagedNode> = this
        while (current) {
            result.push(current)
            current = current.parent
        }
        return result
    }
    printSubTree = (lines: string[]) => {
        const depth = this.ancestorsIncludingSelf.length - 1
        lines.push(`${'  '.repeat(depth)}${this.node.name}: ${this.printSelfText()}`)
        this.childrens.forEach((child) => child.printSubTree(lines))
    }
    iterate = (
        //
        enter: (node: Prompt_Node) => boolean,
        leave?: (node: Prompt_Node) => void,
    ): void => {
        const val = enter(this as Prompt_Node /* closed union invariant */)
        if (!val) {
            leave?.(this as Prompt_Node)
            return
        } else {
            this.childrens.forEach((child) => child.iterate(enter, leave))
            leave?.(this as Prompt_Node)
        }
    }

    traverseGood = (p: {
        [k in keyof CLASSES]: (t: CLASSES[k]) => boolean
    }) => {
        this.iterate((node) => {
            const kind = node.$kind
            const fn = (p as any)[kind]
            if (fn) return fn(node)
            return true
        })
    }

    printSelfText = () => `"${this.text}"`

    setText = (newText: string) => {
        if (this.expression.editorView == null) throw new Error(`[❌] editorState is not set`)
        this.expression.editorView.dispatch({
            changes: [
                {
                    from: this.from,
                    to: this.to,
                    insert: newText,
                },
            ],
        })
    }
    appendText = (newText: string) => {
        if (this.expression.editorView == null) throw new Error(`[❌] editorState is not set`)
        this.expression.editorView.dispatch({
            changes: [
                {
                    from: this.to,
                    to: this.to,
                    insert: newText,
                },
            ],
        })
    }

    constructor(
        //
        public expression: PromptAST,
        public parent: Maybe<ManagedNode>,
        public node: SyntaxNode,
    ) {
        if (parent) parent.childrens.push(this)
    }

    getChild = <T extends KnownNodeNames>(kind: T, index?: number): Maybe<CLASSES[T]> => {
        if (index != null) return this.getChildren(kind)[index] // slow
        return this.childrens.find((child) => child.$kind === kind) as Maybe<CLASSES[T]>
    }
    getChildren = <T extends KnownNodeNames>(kind: T): CLASSES[T][] => {
        return this.childrens.filter((child) => child.$kind === kind) as CLASSES[T][]
    }
    getNthChild = <T extends KnownNodeNames>(kind: T, index: number): Maybe<CLASSES[T]> => {
        return this.getChildren(kind)[index]
    }
}

// prettier-ignore
export type Prompt_Node = CLASSES[keyof CLASSES]

// ----------------------------------------
// type safe node wrappers
export class Prompt_Prompt extends ManagedNode<'Prompt'> {
    $kind = 'Prompt' as const
    printSelfText = () => ``
}

export class Prompt_Lora extends ManagedNode<'Lora'> {
    $kind = 'Lora' as const
    printSelfText = () => `"${this.text}" (weight=${this.strength_clip})`
    get nameNode(): Maybe<Prompt_Identifier | Prompt_String> {
        return this.getChild('Identifier') ?? this.getChild('String')
    }
    get nameEndsAt(): Maybe<number> {
        if (this.nameNode == null) return null
        return this.nameNode.to
    }
    get name(): Enum_LoraLoader_lora_name {
        // prettier-ignore
        return (
            this.getChild('Identifier')?.text ?? //
            this.getChild('String')?.text ??
            ''
        ) as Enum_LoraLoader_lora_name
    }
    // strength_clip -----------
    get strength_clip(): number {
        return this.getChild('Number', 1)?.number ?? 1
    }
    set strength_clip(value: number) {
        this.getChild('Number', 1)?.setNumber(value)
    }

    // strength_model -----------
    get strength_model(): number {
        return this.getNthChild('Number', 0)?.number ?? 1
    }
    set strength_model(value: number) {
        this.getNthChild('Number', 0)?.setNumber(value)
    }
}

export class Prompt_Embedding extends ManagedNode<'Embedding'> {
    $kind = 'Embedding' as const
    get name(): string {
        return (
            this.getChild('Identifier')?.text ?? //
            this.getChild('String')?.text ??
            ''
        )
    }
}
export class Prompt_Wildcard extends ManagedNode<'Wildcard'> {
    $kind = 'Wildcard' as const
    get name(): string {
        return (
            this.getChild('Identifier')?.text ?? //
            this.getChild('String')?.text ??
            ''
        )
    }
}

export class Prompt_Identifier extends ManagedNode<'Identifier'> {
    $kind = 'Identifier' as const
}
export class Prompt_Number extends ManagedNode<'Number'> {
    $kind = 'Number' as const
    get number() {
        return parseFloat(this.text)
    }
    set number(value: number) {
        this.setText(value.toString())
    }
    setNumber = (value: number) => {
        this.setText(value.toString())
    }
}
export class Prompt_Separator extends ManagedNode<'Separator'> {
    $kind = 'Separator' as const
}
export class Prompt_Content extends ManagedNode<'Content'> {
    $kind = 'Content' as const
    printSelfText = () => ``
}
export class Prompt_WeightedExpression extends ManagedNode<'WeightedExpression'> {
    $kind = 'WeightedExpression' as const
    get contentText(): string {
        return this.getChild('Content')?.text ?? ''
    }
    get weight() {
        return this.getChild('Number')?.number ?? 1
    }
    set weight(value: number) {
        this.getChild('Number')?.setNumber(value)
    }
}
export class Prompt_Break extends ManagedNode<'Break'> {
    $kind = 'Break' as const
}
export class Prompt_Comment extends ManagedNode<'Comment'> {
    $kind = 'Comment' as const
}
export class Prompt_Permutations extends ManagedNode<'Permutations'> {
    $kind = 'Permutations' as const
}
export class Prompt_String extends ManagedNode<'String'> {
    $kind = 'String' as const
    get content() {
        return this.text.slice(1, -1)
    }
}
export class Prompt_Tag extends ManagedNode<'Tag'> {
    $kind = 'Tag' as const
}
export class Prompt_TagName extends ManagedNode<'TagName'> {
    $kind = 'TagName' as const
}

// ----------------------------------------
export class Prompt_Unknown extends ManagedNode<any> {
    $kind = 'Unknown' as 'Unknown'
    constructor(expression: PromptAST, parent: Maybe<ManagedNode>, node: SyntaxNode) {
        super(expression, parent, node)
        console.log(`[❌] unknown node "${node.name}" at position ${node.from}-${node.to}`)
    }
}
