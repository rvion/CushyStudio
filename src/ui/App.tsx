import { observer } from 'mobx-react-lite'
import { Test2 } from './test2'
import * as T from '/Users/loco/dev/intuition/node_modules/monaco-editor/esm/vs/editor/editor.api'

type TypescriptOptions = T.languages.typescript.CompilerOptions

export const App = observer(function App_(p: {}) {
    return (
        <div className='row'>
            {/* <div className='menu'>Project</div> */}
            {/* <EditorUI /> */}
            <Test2 />
        </div>
    )
})

// export const EditorUI = () => (
//     <Editor //
//         path='src/demo/demo1.ts'
//         onMount={(editor, monaco) => {
//             const compilerOptions: TypescriptOptions = {
//                 // allowJs: true,
//                 // allowSyntheticDefaultImports: true,
//                 alwaysStrict: true,
//                 // lib: ['ES5'],
//             }

//             const file1 = monaco.editor.createModel(`export const Comfy = 1`, 'typescript', monaco.Uri.parse('file:///test.ts'))
//             const model = monaco.editor.createModel(sample1, 'typescript', monaco.Uri.parse('file:///yolo.ts'))

//             const config = monaco.languages.typescript.typescriptDefaults.getCompilerOptions()

//             // monaco.languages.typescript.typescriptDefaults.addExtraLib({
//             //     filePath: 'dsl.ts',
//             //     content: `export const Comfy = 1`,
//             // })
//             // monaco.languages.typescript.typescriptDefaults.setCompilerOptions(compilerOptions)
//             // monaco.languages.typescript.javascriptDefaults.setCompilerOptions(compilerOptions)
//         }}
//         height='100vh'
//         defaultPath='file:///yolo.ts'
//         // defaultLanguage='typescript'
//         // defaultValue='// some comment'
//         // value={sample1}
//         language='typescript'
//         theme='vs-dark'
//     />
// )

// monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
//     target: monaco.languages.typescript.ScriptTarget.ES5,
//     lib: ["DOM", "ES5", "ScriptHost"] // these are the default libraries for the ES5 target
// });
