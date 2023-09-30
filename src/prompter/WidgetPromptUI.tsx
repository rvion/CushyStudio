import { $createParagraphNode, $createTextNode, $getRoot, EditorState, LexicalEditor } from 'lexical'

import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin'
import { TreeView } from '@lexical/react/LexicalTreeView'
import { observer } from 'mobx-react-lite'
import { useSt } from '../front/FrontStateCtx'
import { wildcards } from '../wildcards/wildcards'
import { CushyCompletionPlugin } from './CushyCompletionPlugin'
import { CushyDebugPlugin, getFinalJSON } from './CushyDebugPlugin'
import theme from './theme/WidgetLexicalTheme'
import { $createBooruNode, BooruNode } from './nodes/_BooruNode'
import { $createEmbeddingNode, EmbeddingNode } from './nodes/_EmbeddingNode'
import { $createLoraNode, LoraNode } from './nodes/_LoraNode'
import { $createWildcardNode, WildcardNode } from './nodes/_WildcardNode'
import { CushyShortcutPlugin } from './CushyShortcutPlugin'

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
            console.log('[💬] LEXICAL: initial value is', p.get())
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
                <CushyShortcutPlugin />
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
                        const { debug, items } = getFinalJSON(editorState)
                        console.log(debug)
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
