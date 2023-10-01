// misc
import { observer } from 'mobx-react-lite'
import { wildcards } from '../wildcards/wildcards'
import { useSt } from '../front/FrontStateCtx'

// lexical
import { $createParagraphNode, $createTextNode, $getRoot, EditorState, LexicalEditor } from 'lexical'
import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'

// theme
import theme from './theme/WidgetLexicalTheme'
import './theme/Popover.css'

// nodes
import { $createEmbeddingNode, EmbeddingNode } from './nodes/EmbeddingNode'
import { $createWildcardNode, WildcardNode } from './nodes/WildcardNode'
import { $createBooruNode, BooruNode } from './nodes/BooruNode'
import { $createLoraNode, LoraNode } from './nodes/LoraNode'

// plugins
import { CushyDebugPlugin, PossibleSerializedNodes, getFinalJSON } from './plugins/CushyDebugPlugin'
import { CushyCompletionPlugin } from './plugins/CushyCompletionPlugin'
import { CushyShortcutPlugin } from './plugins/CushyShortcutPlugin'
import { TreeViewPlugin } from './plugins/TreeViewPlugin'

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
        if (txt)
            p.set({
                text: txt,
                tokens: getFinalJSON(editorState).items,
            })
        // console.log(root, selection)
    })
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
    console.error(error)
}

export type WidgetPromptOutput = {
    text: string
    tokens: PossibleSerializedNodes[]
}
type EditorProps = {
    get: () => Maybe<WidgetPromptOutput>
    set: (v: WidgetPromptOutput) => void
    nullable?: boolean
    textarea?: boolean
}

export const WidgetPromptUI = observer((p: EditorProps) => {
    const st = useSt()
    // useEffect(() => {
    //     updateEditor(p.get())
    // })
    const initialConfig: InitialConfigType = {
        nodes: [EmbeddingNode, LoraNode, WildcardNode, BooruNode],
        editorState: () => {
            console.log('[💬] LEXICAL: mounting lexical widget')
            const initialValue: Maybe<WidgetPromptOutput> = p.get()
            console.log('[💬] LEXICAL: initial value is', initialValue)

            if (
                typeof initialValue === 'string' || // legacy
                initialValue == null //
            ) {
                $getRoot().append($createParagraphNode().append($createTextNode('')))
                return
            }

            const paragraph = $createParagraphNode()
            for (const x of initialValue.tokens) {
                if (x.type === 'booru') paragraph.append($createBooruNode(x.tag))
                else if (x.type === 'lora') paragraph.append($createLoraNode(x.loraDef))
                else if (x.type === 'wildcard') paragraph.append($createWildcardNode(x.payload))
                else if (x.type === 'embedding') paragraph.append($createEmbeddingNode(x.embeddingName))
                else if (x.type === 'text') paragraph.append($createTextNode(x.text))
            }
            $getRoot().append(paragraph)
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
            <CushyShortcutPlugin />
            <PlainTextPlugin
                contentEditable={
                    <ContentEditable
                        style={{ background: 'var(--rs-input-bg)', border: '1px solid #2e2e2e' }}
                        className='p-0.5 mr-0.5 rounded flex flex-grow border-gray-500 [min-width:8rem]'
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
                describeValue={(t) => ({ title: t.replaceAll('\\', '/').replace('.safetensors', ''), keywords: [t] })}
                createNode={(t) => {
                    // console.log('🟢, picked', t)
                    return $createLoraNode({ name: t, strength_clip: 1, strength_model: 1 })
                }}
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
                    editorState.read
                    const { debug, items } = getFinalJSON(editorState)
                    console.log(debug)
                    // console.log(editorState, editor, tags)
                    // p.set(editorState.)
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
