import type { LoraNodeJSON } from '../nodes/LoraNode'
import type { BooruNodeJSON } from '../nodes/booru/BooruNode'
import type { WildcardNodeJSON } from '../nodes/wildcards/WildcardNode'
import type { EmbeddingNodeJSON } from '../nodes/EmbeddingNode'
import type { UserNodeJSON } from '../nodes/usertags/UserNode'
import type { ActionNodeJSON } from '../nodes/ActionNode'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { JSONHighlightedCodeUI } from '../../misc/TypescriptHighlightedCodeUI'
import { getFinalJSON } from './getFinalJSON'

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
type LineBreakJSON = { type: 'linebreak' }

// prettier-ignore
export type PossibleSerializedNodes =
    | BooruNodeJSON
    | LoraNodeJSON
    | WildcardNodeJSON
    | EmbeddingNodeJSON
    | TextNodeJSON
    | LineBreakJSON
    | UserNodeJSON
    | ActionNodeJSON
// | ParagraphNodeJSON
