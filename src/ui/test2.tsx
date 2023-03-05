import Editor from '@monaco-editor/react'
import { KnownFiles, virtualFilesystem } from './files'
import { C } from '../compiler/entry'

const defaultFile: KnownFiles = 'a.ts'

export function ComfyScriptUI() {
    // const [fileName, setFileName] = useState(defaultFile)
    // const file = virtualFilesystem[fileName]

    return (
        <div className='row'>
            <div className='col menu gap'>
                <h3>Nodes</h3>
                {/* <button disabled={fileName === 'a.ts'} onClick={() => setFileName('a.ts')}>
                    a.ts
                </button>
                <button disabled={fileName === 'b.ts'} onClick={() => setFileName('b.ts')}>
                    b.ts
                </button>
                <button disabled={fileName === 'c.ts'} onClick={() => setFileName('c.ts')}>
                    c.ts
                </button> */}
                {[...C.nodes.values()].map((node) => {
                    return (
                        <div key={node.uid} className='node'>
                            <div>{node.constructor.name}</div>
                        </div>
                    )
                })}
            </div>
            <Editor //
                onMount={(editor, monaco) => {
                    // const compilerOptions: TypescriptOptions = {
                    //     // allowJs: true,
                    //     // allowSyntheticDefaultImports: true,
                    //     alwaysStrict: true,
                    //     // lib: ['ES5'],
                    // }
                    for (const file of Object.values(virtualFilesystem)) {
                        const uri = monaco.Uri.parse(`file:///${file.name}`)
                        console.log('🚀 ~ file: test2.tsx:37 ~ Test2 ~ uri:', uri)
                        const model = monaco.editor.createModel(file.value, 'typescript', uri)
                    }
                    const aModel = monaco.editor.getModel(monaco.Uri.parse(`file:///a.ts`))
                    editor.setModel(aModel)
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
                }}
                height='100vh'
                theme='vs-dark'
                // path={file.name}
                // defaultLanguage={file.language}
                // defaultValue={file.value}
            />
        </div>
    )
}

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
