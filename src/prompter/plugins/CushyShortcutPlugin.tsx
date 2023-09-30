import { KEY_ENTER_COMMAND } from 'lexical'
import { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useDraft } from '../../front/ui/useDraft'

// runs the form on cmd+enter within the editor

export function CushyShortcutPlugin() {
    const [editor] = useLexicalComposerContext()
    const draft = useDraft()
    useEffect(() => {
        return editor.registerCommand(
            KEY_ENTER_COMMAND,
            (ev) => {
                if (!ev?.metaKey) return false
                console.log(`👋👋👋👋👋👋👋`)
                ev?.stopImmediatePropagation()
                ev?.stopPropagation()
                ev?.preventDefault()
                draft.start()
                return true
            },
            4,
        )
    }, [editor])

    return null
}
