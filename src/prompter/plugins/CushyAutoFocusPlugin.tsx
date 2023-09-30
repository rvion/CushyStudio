import { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

// Lexical React plugins are React components, which makes them
// highly composable. Furthermore, you can lazy load plugins if
// desired, so you don't pay the cost for plugins until you
// actually use them.
// Focus the editor when the effect fires!
export function CushyAutoFocusPlugin() {
    const [editor] = useLexicalComposerContext()
    useEffect(() => editor.focus(), [editor])
    return null
}
