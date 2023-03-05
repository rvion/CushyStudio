import { observer } from 'mobx-react-lite'
import Editor from '@monaco-editor/react'
import type * as T from '/Users/loco/dev/intuition/node_modules/monaco-editor/esm/vs/editor/editor.api'

type TypescriptOptions = T.languages.typescript.CompilerOptions

export const App = observer(function App_(p: {}) {
    return (
        <div className='row'>
            <div className='menu'>Project</div>
            <EditorUI />
            <div className='menu'>preview</div>
        </div>
    )
})

export const EditorUI = () => (
    <Editor //
        onMount={(editor, monaco) => {
            const compilerOptions: TypescriptOptions = {
                // allowJs: true,
                // allowSyntheticDefaultImports: true,
                alwaysStrict: true,
                jsxFactory: 'React.createElement',
            }

            monaco.languages.typescript.typescriptDefaults.setCompilerOptions(compilerOptions)
            // monaco.languages.typescript.javascriptDefaults.setCompilerOptions(compilerOptions)
        }}
        height='100vh'
        defaultLanguage='typescript'
        defaultValue='// some comment'
        language='typescript'
        theme='vs-dark'
    />
)

// monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
//     target: monaco.languages.typescript.ScriptTarget.ES5,
//     lib: ["DOM", "ES5", "ScriptHost"] // these are the default libraries for the ES5 target
// });
