import type * as GrammarTerms from './grammar.parser.terms'
import type * as Lezer from '@lezer/common'
import type { SyntaxNode } from '@lezer/common'
import type { EditorView } from 'codemirror'

import { parser } from './grammar.parser'

type KnownNodeNames = keyof typeof GrammarTerms

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
    Artist:             Prompt_Artist
    ArtistName:         Prompt_ArtistName
    Wildcard:           Prompt_Wildcard

}

// 1. wrap text
export class PromptAST {
   /**
    * return all top level nodes except separators
    * (internally, the "true" top-level node is a single Prompt node
    * that contains all other nodes; this function return all its children)
    */
   get allTopLevelNodes(): Prompt_Node[] {
      const result: Prompt_Node[] = []
      return this.root.childrens
   }

   get allTopLevelNodesExceptSeparators(): Prompt_Node[] {
      return this.allTopLevelNodes.filter((node) => node.$kind !== 'Separator')
   }

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
        Artist            : Prompt_Artist,
        ArtistName        : Prompt_ArtistName,
        Wildcard          : Prompt_Wildcard,
    }

   toString = (): string => {
      const lines: string[] = []
      this.root.printSubTree(lines)
      return lines.join('\n')
   }

   print = (): void => {
      console.log(this.toString())
   }

   traverseGood = (p: {
      [k in keyof CLASSES]: (t: CLASSES[k]) => boolean
   }): void => this.root.traverseGood(p)

   root!: ManagedNode
   constructor(
      //
      public CONTENT: string,
      /** require if you want to update the text programmatically */
      public editorView?: Maybe<EditorView>,
   ) {
      this.tree = parser.parse(CONTENT)
      const stack: ManagedNode[] = []
      this.tree.iterate({
         enter: (nodeRef) => {
            // special case for root

            const parent = stack[stack.length - 1]
            const name = nodeRef.name as KnownNodeNames
            const ctor = this.knownNodes[name] || Prompt_Unknown
            // 🔶 typed as an
            const inst = new ctor(this, parent, nodeRef.node)
            stack.push(inst)

            if (parent == null && name !== 'Prompt')
               throw new Error(`[❌] root node must be "Prompt" but got "${name}"`)
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
   // uid = nanoid()

   /** retrieve the closest ancestor of given class */
   firstAncestor = <T extends KnownNodeNames>(kind: T): Maybe<CLASSES[T]> => {
      // eslint-disable-next-line consistent-this
      let current: Maybe<ManagedNode> = this
      while (current) {
         if (current.$kind === kind) return current as Maybe<CLASSES[T]>
         current = current.parent
      }
      return null
   }

   /** remove the node, replace it's content by '' */
   remove = (): void => {
      this.expression.editorView?.dispatch({ changes: { from: this.from, to: this.to, insert: '' } })
   }

   wrapWithWeighted = (weight: number): void => {
      this.expression.editorView?.dispatch(
         { changes: { from: this.to, to: this.to, insert: `)*${weight}` } },
         { changes: { from: this.from, to: this.from, insert: '(' } },
      )
   }

   abstract $kind: Name

   get from(): number {
      return this.node.from
   }

   get to(): number {
      return this.node.to
   }

   get text(): string {
      return this.expression.CONTENT.slice(this.from, this.to)
   }

   childrens: ManagedNode[] = []

   get ancestorsIncludingSelf(): ManagedNode[] {
      const result: ManagedNode[] = []
      // eslint-disable-next-line consistent-this
      let current: Maybe<ManagedNode> = this
      while (current) {
         result.push(current)
         current = current.parent
      }
      return result
   }

   printSubTree = (lines: string[]): void => {
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
   }): void => {
      this.iterate((node) => {
         const kind = node.$kind
         const fn = (p as any)[kind]
         if (fn) return fn(node)
         return true
      })
   }

   printSelfText = (): string => `"${this.text}"`

   setText = (newText: string): void => {
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
   appendText = (newText: string): void => {
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
   printSelfText = (): string => ``
}

export class Prompt_Lora extends ManagedNode<'Lora'> {
   $kind = 'Lora' as const

   printSelfText = (): string => `"${this.text}" (weight=${this.strength_clip})`

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
            this.getChild('String')?.content ??
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
         this.getChild('String')?.content ??
         ''
      )
   }
}
export class Prompt_Wildcard extends ManagedNode<'Wildcard'> {
   $kind = 'Wildcard' as const

   get name(): string {
      return (
         this.getChild('Identifier')?.text ?? //
         this.getChild('String')?.content ??
         ''
      )
   }
}

export class Prompt_Identifier extends ManagedNode<'Identifier'> {
   $kind = 'Identifier' as const
}

export class Prompt_Number extends ManagedNode<'Number'> {
   $kind = 'Number' as const

   get number(): number {
      return parseFloat(this.text)
   }

   set number(value: number) {
      this.setText(value.toString())
   }

   setNumber = (value: number): void => {
      this.setText(value.toString())
   }
}

export class Prompt_Separator extends ManagedNode<'Separator'> {
   $kind = 'Separator' as const
}

export class Prompt_Content extends ManagedNode<'Content'> {
   $kind = 'Content' as const
   printSelfText = (): string => ``
}

export class Prompt_WeightedExpression extends ManagedNode<'WeightedExpression'> {
   $kind = 'WeightedExpression' as const

   get contentText(): string {
      return this.getChild('Content')?.text ?? ''
   }

   get weight(): number {
      return this.getChild('Number')?.number ?? 1.1
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

   get content(): string {
      return this.text.slice(1, -1)
   }
}

export class Prompt_Tag extends ManagedNode<'Tag'> {
   $kind = 'Tag' as const
}

export class Prompt_TagName extends ManagedNode<'TagName'> {
   $kind = 'TagName' as const
}

export class Prompt_Artist extends ManagedNode<'Artist'> {
   $kind = 'Artist' as const
}

export class Prompt_ArtistName extends ManagedNode<'ArtistName'> {
   $kind = 'ArtistName' as const
}

export class Prompt_Unknown extends ManagedNode<any> {
   $kind = 'Unknown' as 'Unknown'
   constructor(expression: PromptAST, parent: Maybe<ManagedNode>, node: SyntaxNode) {
      super(expression, parent, node)
      console.log(`[❌] unknown node "${node.name}" at position ${node.from}-${node.to}`)
   }
}
