// misc
import { observer } from 'mobx-react-lite'
import { useSt } from '../../state/stateContext'

// lexical
import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin'
import { $createLineBreakNode, $createParagraphNode, $createTextNode, $getRoot, EditorState, LexicalEditor } from 'lexical'

// theme
import './theme/Popover.css'
import theme from './theme/WidgetLexicalTheme'

// nodes
import { $createEmbeddingNode, EmbeddingNode } from './nodes/embedding/EmbeddingNode'
import { $createBooruNode, BooruNode } from './nodes/booru/BooruNode'
import { $createLoraNode, LoraNode } from './nodes/lora/LoraNode'
import { $createWildcardNode, WildcardNode } from './nodes/wildcards/WildcardNode'

// plugins
import { toJS } from 'mobx'
import { useMemo } from 'react'
import { Widget_prompt, Widget_promptOpt } from 'src/controls/Widget'
import { $createActionNode, ActionNode } from './nodes/actions/ActionNode'
import { $createUserNode, UserNode } from './nodes/usertags/UserNode'
import { CopyPastePlugin } from './CopyPastePlugin'
import { CompletionState } from './plugins/CompletionProviders'
import { CushyCompletionPlugin } from './plugins/CushyCompletionPlugin'
import { PossibleSerializedNodes } from './plugins/CushyDebugPlugin'
import { CushyShortcutPlugin } from './plugins/CushyShortcutPlugin'
import { getFinalJSON } from './plugins/getFinalJSON'

export type WidgetPromptOutput = {
    // text: string
    tokens: PossibleSerializedNodes[]
}

export const WidgetPromptUI = observer((p: { req: Widget_prompt | Widget_promptOpt }) => {
    const st = useSt()
    const req = p.req
    const cs = useMemo(
        () =>
            new CompletionState(st, {
                booru: true,
                embedding: true,
                lora: true,
                wildcard: true,
                user: true,
                action: true,
            }),
        [],
    )
    const initialConfig: InitialConfigType = {
        nodes: [EmbeddingNode, LoraNode, WildcardNode, BooruNode, UserNode, ActionNode],
        editorState: () => {
            console.log('[💬] LEXICAL: mounting lexical widget')
            const initialValue: WidgetPromptOutput = req.state
            console.log('[💬] LEXICAL: initial value is', { initialValue: toJS(initialValue) })

            if (
                typeof initialValue === 'string' || // legacy
                initialValue == null //
            ) {
                $getRoot().append($createParagraphNode().append($createTextNode(initialValue ?? '')))
                return
            }

            const paragraph = $createParagraphNode()
            for (const x of initialValue.tokens) {
                if (x.type === 'booru') paragraph.append($createBooruNode(x.tag))
                else if (x.type === 'lora') paragraph.append($createLoraNode(x.loraDef))
                else if (x.type === 'wildcard') paragraph.append($createWildcardNode(x.payload))
                else if (x.type === 'embedding') paragraph.append($createEmbeddingNode(x.embeddingName))
                else if (x.type === 'user') paragraph.append($createUserNode(x.tag))
                else if (x.type === 'action') paragraph.append($createActionNode(x.tag, ''))
                else if (x.type === 'linebreak') paragraph.append($createLineBreakNode())
                else if (x.type === 'text') paragraph.append($createTextNode(x.text))
            }
            $getRoot().append(paragraph)
        },
        namespace: 'MyEditor',
        theme: theme,
        onError,
    }

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <CopyPastePlugin />
            <CushyShortcutPlugin />
            <PlainTextPlugin
                contentEditable={
                    <ContentEditable
                        // TRACK IF THE INPUT IS FOCUSED ------------------------
                        onBlur={(ev) => {
                            if (
                                st.currentPromptFocused && //
                                st.currentPromptFocused &&
                                st.currentPromptFocused === ev.target
                            )
                                st.currentPromptFocused = null
                        }}
                        onFocus={(ev) => {
                            if (
                                ev.target && //
                                st.currentPromptFocused !== ev.target
                            )
                                st.currentPromptFocused = ev.target
                        }}
                        // -----------------------------------------------------
                        style={{
                            minHeight: '3rem',
                            background: 'var(--rs-input-bg)',
                            border: '1px solid #2e2e2e',
                        }}
                        className='p-0.5 mr-0.5 rounded flex flex-grow border-gray-500 [min-width:8rem]'
                    />
                }
                placeholder={null}
                ErrorBoundary={LexicalErrorBoundary}
            />
            {/* https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/plugins/EmojiPickerPlugin/index.tsx */}

            <CushyCompletionPlugin cs={cs} />
            {/* <PrompterConfigUI /> */}
            <OnChangePlugin
                onChange={(editorState: EditorState, editor: LexicalEditor, tags: Set<string>) => {
                    onChange(req, editorState)
                }}
            />
            <HistoryPlugin />
            {/* <CushyDebugPlugin /> */}
            {/* <div className='flex-grow'>
                <TreeViewPlugin />
            </div> */}
            {/* <MyCustomAutoFocusPlugin /> */}
        </LexicalComposer>
    )
})

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
function onChange(
    //
    req: Widget_prompt | Widget_promptOpt,
    editorState: EditorState,
) {
    editorState.read(() => {
        // Read the contents of the EditorState here.
        const root = $getRoot()
        // const selection = $getSelection()
        const txt = root.__cachedText
        if (txt) {
            // req.state.text = txt
            req.state.tokens = getFinalJSON(editorState).items
            if (req instanceof Widget_promptOpt) req.state.active = true
        } else {
            req.state.tokens = getFinalJSON(editorState).items
        }
        // .set({
        //         active: true,
        //         text: txt,
        //         tokens: getFinalJSON(editorState).items,
        //     })
        // console.log(root, selection)
    })
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
    console.error(error)
}
