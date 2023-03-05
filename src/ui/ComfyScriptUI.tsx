import Editor from '@monaco-editor/react'
import { observer } from 'mobx-react-lite'
import { virtualFilesystem } from './files'
import { MenuUI } from './MenuUI'

export const ComfyScriptUI = observer(function ComfyScriptUI_() {
    return (
        <div className='row'>
            <MenuUI />
            <Editor //
                onMount={(editor, monaco) => {
                    for (const file of Object.values(virtualFilesystem)) {
                        const uri = monaco.Uri.parse(`file:///${file.name}`)
                        const model = monaco.editor.createModel(file.value, 'typescript', uri)
                    }
                    const aModel = monaco.editor.getModel(monaco.Uri.parse(`file:///a.ts`))
                    editor.setModel(aModel)
                }}
                height='100vh'
                theme='vs-dark'
            />
        </div>
    )
})
// path={file.name}
// defaultLanguage={file.language}
// defaultValue={file.value}
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
// monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
//     target: monaco.languages.typescript.ScriptTarget.ES5,
//     lib: ["DOM", "ES5", "ScriptHost"] // these are the default libraries for the ES5 target
// });

// type TypescriptOptions = T.languages.typescript.CompilerOptions

// const file1 = monaco.editor.createModel(
//     `export const Comfy = 1`,
//     'typescript',
//     monaco.Uri.parse('file:///test.ts'),
// )
// const model = monaco.editor.createModel(sample1, 'typescript', monaco.Uri.parse('file:///yolo.ts'))
// const config = monaco.languages.typescript.typescriptDefaults.getCompilerOptions()

// monaco.languages.typescript.typescriptDefaults.addExtraLib({
//     filePath: 'dsl.ts',
//     content: `export const Comfy = 1`,
// })
// monaco.languages.typescript.typescriptDefaults.setCompilerOptions(compilerOptions)
// monaco.languages.typescript.javascriptDefaults.setCompilerOptions(compilerOptions)

// const compilerOptions: TypescriptOptions = {
//     // allowJs: true,
//     // allowSyntheticDefaultImports: true,
//     alwaysStrict: true,
//     // lib: ['ES5'],
// }
