import type { BooruNodeJSON } from './_BooruNode'
import type { EmbeddingNodeJSON } from './_EmbeddingNode'
import type { LoraNodeJSON } from './_LoraNode'
import type { WildcardNodeJSON } from './_WildcardNode'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { JSONHighlightedCodeUI } from '../../TypescriptHighlightedCodeUI'

export const CushyDebugPlugin = <T extends any>() => {
    const [editor] = useLexicalComposerContext()
    const editorState = editor.getEditorState()
    const json = editorState.toJSON()

    const items = []
    let out = '{\n'
    const p0 = json.root.children[0]
    if ('paragraph' !== p0.type) return <>❌ root.children[0] is not a paragraph</>
    for (const x of (p0 as any as { children: PossibleSerializedNodes[] }).children) {
        items.push(convertToSimpleJSON(x))
        out += '   ' + JSON.stringify(convertToSimpleJSON(x)) + ',\n'
    }
    out += '}\n'
    // const p00 = (p0 as any).children[0]

    // return <JSONHighlightedCodeUI code={JSON.stringify(editor.toJSON())} />
    // return <JSONHighlightedCodeUI code={JSON.stringify(json, null, 4)} />
    // return <JSONHighlightedCodeUI code={readableStringify({ items }, 3, 0)} />
    return <JSONHighlightedCodeUI code={out} />
}

type TextNodeJSON = { type: 'text'; text: string }
type ParagraphNodeJSON = { type: 'paragraph'; children: PossibleSerializedNodes[] }

// prettier-ignore
type PossibleSerializedNodes =
    | WildcardNodeJSON
    | EmbeddingNodeJSON
    | LoraNodeJSON
    | BooruNodeJSON
    | TextNodeJSON
    | ParagraphNodeJSON

const convertToSimpleJSON = (node: PossibleSerializedNodes): any => {
    if (node.type === 'booru') return { type: 'booru', value: node.payload.text }
    if (node.type === 'lora') return { type: 'lora', value: node.payload }
    if (node.type === 'wildcard') return { type: 'wildcard', value: node.payload }
    if (node.type === 'embedding') return { type: 'embedding', value: node.payload }
    if (node.type === 'text') return { type: 'text', value: node.text }
    if (node.type === 'paragraph') return { type: 'paragraph', value: node.children.map(convertToSimpleJSON) }
    return { type: 'unknown', value: node }
}
