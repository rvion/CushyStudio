import {
    KEY_ENTER_COMMAND,
    KEY_ARROW_UP_COMMAND,
    KEY_ARROW_DOWN_COMMAND,
    $getSelection,
    $isRangeSelection,
    $createTextNode,
} from 'lexical'
import { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useDraft } from '../../misc/useDraft'

// runs the form on cmd+enter within the editor

export function CushyShortcutPlugin() {
    const [editor] = useLexicalComposerContext()
    const draft = useDraft()

    useEffect(() => {
        const handleEnterCommand = (ev: KeyboardEvent) => {
            if (!ev?.metaKey) return false
            console.log('👋👋👋👋👋👋👋')
            ev?.stopImmediatePropagation()
            ev?.stopPropagation()
            ev?.preventDefault()
            draft.start()
            return true
        }

        const handleAltUpCommand = (ev: KeyboardEvent) => {
            //TODO: most other SD environments have this as Ctrl+Up but that command appears to already be used in the lexical editor
            //maybe worth trying to find a way to override, but for now, ALT seems to work
            if (!ev?.altKey || ev?.key !== 'ArrowUp') return false
            console.log('👋👋👋👋👋👋👋 ALT + UP key combination pressed')
            ev?.stopImmediatePropagation()
            ev?.stopPropagation()
            ev?.preventDefault()
            if (editor.isEditable()) {
                editor.update(() => {
                    const selection = $getSelection()

                    if (!$isRangeSelection(selection)) return
                    //TODO: add a feature here to automatically expand selection to parenthesis if there are any
                    //so putting the cursor anywhere within a parameter like (the world tree:1.2) would increase the selection to encompass the parentheses
                    if (selection?.getNodes()[0].getType() != 'text')
                        //other types currently not supported
                        return
                    const newText = modifyWeight(selection.getTextContent(), true)
                    const newNode = $createTextNode(newText)
                    selection.insertNodes([newNode])
                    newNode.select(0, newText.length)
                })
            }
            return true
        }

        const handleAltDownCommand = (ev: KeyboardEvent) => {
            if (!ev?.altKey || ev?.key !== 'ArrowDown') return false
            console.log('👋👋👋👋👋👋👋 ALT + DOWN key combination pressed')
            ev?.stopImmediatePropagation()
            ev?.stopPropagation()
            ev?.preventDefault()
            if (editor.isEditable()) {
                editor.update(() => {
                    const selection = $getSelection()

                    if (!$isRangeSelection(selection)) return
                    if (selection?.getNodes()[0].getType() != 'text')
                        //other types currently not supported
                        return
                    const newText = modifyWeight(selection.getTextContent(), false)
                    const newNode = $createTextNode(newText)
                    selection.insertNodes([newNode])
                    newNode.select(0, newText.length)
                })
            }
            return true
        }

        const modifyWeight = (selection: string, increase: boolean) => {
            const hasWeight = /^\(.*\)$/.test(selection) // Check if selection is enclosed by ()

            if (hasWeight) {
                const weightRegex = /:(\d+(\.\d+)?)\)/ // Regex to match the weight value
                const match = selection.match(weightRegex)

                if (match) {
                    const currentWeight = parseFloat(match[1]) // Extract the weight value
                    const newWeight = increase ? (currentWeight + 0.1).toFixed(1) : (currentWeight - 0.1).toFixed(1) // Increase or decrease the weight

                    if (newWeight === '1.0') {
                        return selection.replace(weightRegex, '').replace('(', '').replace(')', '') // Remove the weight value and surrounding colon and parentheses
                    } else {
                        return selection.replace(weightRegex, `:${newWeight})`) // Replace the weight value with the new weight
                    }
                }
            }

            const defaultWeight = increase ? 1.1 : 0.9 // Default weight if no weight is present
            return `(${selection}:${defaultWeight})` // Add the weight to the selection
        }

        const enterCommandRegistration = editor.registerCommand(KEY_ENTER_COMMAND, handleEnterCommand, 4)
        const upCommandRegistration = editor.registerCommand(KEY_ARROW_UP_COMMAND, handleAltUpCommand, 4)
        const downCommandRegistration = editor.registerCommand(KEY_ARROW_DOWN_COMMAND, handleAltDownCommand, 4)

        return () => {
            enterCommandRegistration()
            upCommandRegistration()
            downCommandRegistration()
        }
    }, [editor])

    return null
}
