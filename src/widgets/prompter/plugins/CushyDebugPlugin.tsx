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
