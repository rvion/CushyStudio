import MonacoEditor from '@monaco-editor/react'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { virtualFilesystem } from './files'
import { MenuUI } from './MenuUI'

import { c__ } from './samples/c'
import { EditorState } from './EditorState'
import { TypescriptOptions } from './TypescriptOptions'

export const ComfyScriptUI = observer(function ComfyScriptUI_() {
    const st = useMemo(() => new EditorState(), [])
    return (
        <div className='col'>
            <div className='appbar row items-center gap px'>Menu</div>
            <div className='row'>
                <MenuUI st={st} />
                <MonacoEditor //
                    height='100vh'
                    theme='vs-dark'
                    onMount={(editor, monaco) => {
                        const compilerOptions: TypescriptOptions = {
                            // allowJs: true,
                            // allowSyntheticDefaultImports: true,
                            alwaysStrict: true,
                            module: monaco.languages.typescript.ModuleKind.ESNext,
                            target: monaco.languages.typescript.ScriptTarget.ESNext,
                            // lib: ['ES5'],
                        }
                        monaco.languages.typescript.typescriptDefaults.setCompilerOptions(compilerOptions)
                        monaco.languages.typescript.typescriptDefaults.addExtraLib(c__, 'global.d.ts')
                        for (const file of Object.values(virtualFilesystem)) {
                            const uri = monaco.Uri.parse(`file:///${file.name}`)
                            const model = monaco.editor.createModel(file.value, 'typescript', uri)
                        }
                        const aModel = monaco.editor.getModel(monaco.Uri.parse(`file:///a.ts`))
                        st.file = aModel
                        editor.setModel(aModel)
                    }}
                />
                <div className='menu'>
                    <div>Documentation</div>
                </div>
            </div>
            {/* <div>OK {st.file && st.file.getValue()}</div> */}
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
