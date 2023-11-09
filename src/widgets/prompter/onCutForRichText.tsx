import { $insertDataTransferForRichText, copyToClipboard } from '@lexical/clipboard'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { mergeRegister, objectKlassEquals } from '@lexical/utils'
import {
    $getSelection,
    $isNodeSelection,
    $isRangeSelection,
    COMMAND_PRIORITY_CRITICAL,
    COMMAND_PRIORITY_NORMAL,
    COPY_COMMAND,
    CUT_COMMAND,
    CommandPayloadType,
    LexicalEditor,
    PASTE_COMMAND,
    isSelectionCapturedInDecoratorInput,
} from 'lexical'
import { useEffect } from 'react'

export function CopyPastePlugin() {
    const [editor] = useLexicalComposerContext()
    useEffect(() => {
        return mergeRegister(
            editor.registerCommand(
                COPY_COMMAND,
                (event) => {
                    console.log('👋 --- COPY')
                    copyToClipboard(editor, objectKlassEquals(event, ClipboardEvent) ? (event as ClipboardEvent) : null)
                    return true
                },
                COMMAND_PRIORITY_NORMAL,
            ),
            editor.registerCommand(
                CUT_COMMAND,
                (event) => {
                    console.log('👋 --- CUT')
                    onCutForRichText(event, editor)
                    return true
                },
                COMMAND_PRIORITY_NORMAL,
            ),
            editor.registerCommand(
                PASTE_COMMAND,
                (event) => {
                    console.log('👋 --- PASTE')
                    // const [, files, hasTextContent] = eventFiles(event)
                    // if (files.length > 0 && !hasTextContent) {
                    //     editor.dispatchCommand(DRAG_DROP_PASTE, files)
                    //     return true
                    // }

                    // if inputs then paste within the input ignore creating a new node on paste event
                    if (isSelectionCapturedInDecoratorInput(event.target as Node)) return false

                    const selection = $getSelection()
                    if ($isRangeSelection(selection)) {
                        onPasteForRichText(event, editor)
                        return true
                    }

                    return false
                },
                COMMAND_PRIORITY_NORMAL,
            ),
        )
    }, [editor])

    return null
}

export async function onCutForRichText(event: CommandPayloadType<typeof CUT_COMMAND>, editor: LexicalEditor): Promise<void> {
    await copyToClipboard(editor, objectKlassEquals(event, ClipboardEvent) ? (event as ClipboardEvent) : null)
    editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
            selection.removeText()
        } else if ($isNodeSelection(selection)) {
            selection.getNodes().forEach((node) => node.remove())
        }
    })
}

function onPasteForRichText(event: CommandPayloadType<typeof PASTE_COMMAND>, editor: LexicalEditor): void {
    event.preventDefault()
    editor.update(
        () => {
            const selection = $getSelection()
            const clipboardData = event instanceof InputEvent || event instanceof KeyboardEvent ? null : event.clipboardData
            if (clipboardData != null && $isRangeSelection(selection)) {
                $insertDataTransferForRichText(clipboardData, selection, editor)
            }
        },
        {
            tag: 'paste',
        },
    )
}
