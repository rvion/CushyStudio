import {
    $createParagraphNode,
    $createTextNode,
    $getRoot,
    $getSelection,
    EditorState,
    KEY_ENTER_COMMAND,
    LexicalEditor,
} from 'lexical'
import { useEffect } from 'react'

import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin'
import { TreeView } from '@lexical/react/LexicalTreeView'
import { observer } from 'mobx-react-lite'
import { useSt } from '../../../../front/FrontStateCtx'
import { useDraft } from '../../useDraft'
import { CushyCompletionPlugin } from './CushyCompletionPlugin'
import theme from './WidgetLexicalTheme'
import { $createEmbeddingNode, EmbeddingNode } from './_EmbeddingNode'
import { $createLoraNode, LoraNode } from './_LoraNode'
import { $createWildcardNode, WildcardNode } from './_WildcardNode'
import { wildcards } from '../../../../wildcards/wildcards'
import { $createBooruNode, BooruNode } from './_BooruNode'
import { CushyDebugPlugin } from './CushyDebugPlugin'

// const theme = {
//     // Theme styling goes here
//     // ...
// }

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
function onChange(p: EditorProps, editorState: EditorState) {
    editorState.read(() => {
        // Read the contents of the EditorState here.
        const root = $getRoot()
        // const selection = $getSelection()
        const txt = root.__cachedText
        if (txt) p.set(txt)
        // console.log(root, selection)
    })
}

// Lexical React plugins are React components, which makes them
// highly composable. Furthermore, you can lazy load plugins if
// desired, so you don't pay the cost for plugins until you
// actually use them.
function MyCustomAutoFocusPlugin() {
    const [editor] = useLexicalComposerContext()

    useEffect(() => {
        // Focus the editor when the effect fires!
        editor.focus()
    }, [editor])

    return null
}

function MyCustomShortcutPlugin() {
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

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
    console.error(error)
}

type EditorProps = {
    // path: string
    get: () => string
    set: (v: string) => void
    nullable?: boolean
    textarea?: boolean
}

export const EditorUI = observer((p: EditorProps) => {
    const st = useSt()
    // useEffect(() => {
    //     updateEditor(p.get())
    // })
    const initialConfig: InitialConfigType = {
        nodes: [EmbeddingNode, LoraNode, WildcardNode, BooruNode],
        editorState: () => {
            console.log('[💬] LEXICAL: mounting lexical widget')
            $getRoot().append($createParagraphNode().append($createTextNode(p.get())))
            // $getRoot().append($createTextNode(p.get()))
            // const root = $getRoot()
            // const txt = p.get()
            // console.log('🟢>>>', txt)
            // // const txt = root.__cachedText
            // const txtNode = $createTextNode(txt ?? '')
            // root.append(txtNode)
        },
        namespace: 'MyEditor',
        theme: theme,
        onError,
    }

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className='flex flex-col'>
                <MyCustomShortcutPlugin />
                <PlainTextPlugin
                    contentEditable={
                        <ContentEditable
                            style={{ background: '#140d04', border: '1px solid #2e2e2e' }}
                            className='p-0.5 rounded  border-gray-500 [min-width:8rem]'
                        />
                    }
                    placeholder={null}
                    ErrorBoundary={LexicalErrorBoundary}
                />
                {/* https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/plugins/EmojiPickerPlugin/index.tsx */}

                <CushyCompletionPlugin
                    //
                    trigger=':'
                    getValues={() => st.schema.data.embeddings}
                    describeValue={(t) => ({ title: t, keywords: [t] })}
                    createNode={(t) => $createEmbeddingNode(t)}
                />
                <CushyCompletionPlugin
                    trigger='@'
                    getValues={() => st.schema.getLoras()}
                    describeValue={(t) => ({ title: t, keywords: [t] })}
                    createNode={(t) => $createLoraNode(t)}
                />

                <CushyCompletionPlugin
                    trigger='*'
                    getValues={() => Object.keys(wildcards)}
                    describeValue={(t) => ({ title: t, keywords: [t] })}
                    createNode={(t) => $createWildcardNode(t)}
                />
                <CushyCompletionPlugin
                    trigger='&'
                    getValues={() => st.danbooru.tags}
                    describeValue={(t) => ({ title: t.text, keywords: t.aliases })}
                    createNode={(t) => $createBooruNode(t)}
                />

                <OnChangePlugin
                    onChange={(editorState: EditorState, editor: LexicalEditor, tags: Set<string>) => {
                        onChange(p, editorState)
                        // console.log(editorState, editor, tags)
                        // p.set(editorState.)
                    }}
                />
                <HistoryPlugin />
                <CushyDebugPlugin />
                {/* <div className='text-xs bg-gray-700'>
                    <TreeViewPlugin />
                </div> */}
            </div>
            {/* <MyCustomAutoFocusPlugin /> */}
        </LexicalComposer>
    )
})

export const TreeViewPlugin = () => {
    const [editor] = useLexicalComposerContext()
    return (
        <TreeView
            treeTypeButtonClassName='debug-treetype-button'
            viewClassName='tree-view-output'
            timeTravelPanelClassName='debug-timetravel-panel'
            timeTravelButtonClassName='debug-timetravel-button'
            timeTravelPanelSliderClassName='debug-timetravel-panel-slider'
            timeTravelPanelButtonClassName='debug-timetravel-panel-button'
            editor={editor}
        />
    )
}
