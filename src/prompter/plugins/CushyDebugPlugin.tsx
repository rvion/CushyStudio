import type { EditorState } from 'lexical'
import type { LoraNodeJSON } from '../nodes/LoraNode'
import type { BooruNodeJSON } from '../nodes/BooruNode'
import type { WildcardNodeJSON } from '../nodes/WildcardNode'
import type { EmbeddingNodeJSON } from '../nodes/EmbeddingNode'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { JSONHighlightedCodeUI } from '../../front/ui/TypescriptHighlightedCodeUI'

export const getFinalJSON = (
    editorState: EditorState,
): {
    items: PossibleSerializedNodes[]
    debug: string
} => {
    const json = editorState.toJSON()
    const items: PossibleSerializedNodes[] = []

    // console.log(json)
    const p0 = json.root.children[0]
    if (p0 == null || 'paragraph' !== p0.type) {
        console.log('❌ root.children[0] is not a paragraph')
        return { debug: '', items }
    }
    let debug = '{\n'
    for (const x of (p0 as any as { children: PossibleSerializedNodes[] }).children) {
        const itemJSON = convertToSimpleJSON(x)
        items.push(x)
        debug += '   ' + JSON.stringify(itemJSON) + ',\n'
    }
    debug += '}\n'
    return { items, debug }
}

export const CushyDebugPlugin = <T extends any>() => {
    const [editor] = useLexicalComposerContext()
    const editorState = editor.getEditorState()
    const { debug } = getFinalJSON(editorState)
    // return <JSONHighlightedCodeUI code={JSON.stringify(editor.toJSON())} />
    // return <JSONHighlightedCodeUI code={JSON.stringify(json, null, 4)} />
    // return <JSONHighlightedCodeUI code={readableStringify({ items }, 3, 0)} />
    return <JSONHighlightedCodeUI code={debug} />
}

type TextNodeJSON = { type: 'text'; text: string }
type ParagraphNodeJSON = { type: 'paragraph'; children: PossibleSerializedNodes[] }

// prettier-ignore
export type PossibleSerializedNodes =
    | BooruNodeJSON
    | LoraNodeJSON
    | WildcardNodeJSON
    | EmbeddingNodeJSON
    | TextNodeJSON
// | ParagraphNodeJSON

const convertToSimpleJSON = (node: PossibleSerializedNodes): { type: string; value: string } => {
    if (node.type === 'booru') return { type: 'booru', value: node.tag.text }
    if (node.type === 'lora') return { type: 'lora', value: JSON.stringify(node.loraDef) }
    if (node.type === 'wildcard') return { type: 'wildcard', value: node.payload }
    if (node.type === 'embedding') return { type: 'embedding', value: node.embeddingName }
    if (node.type === 'text') return { type: 'text', value: node.text }
    // if (node.type === 'paragraph') return { type: 'paragraph', value: node.children.map(convertToSimpleJSON) }
    return { type: 'unknown', value: node }
}
