import MonacoEditor from '@monaco-editor/react'
import { observer } from 'mobx-react-lite'
import { virtualFilesystem } from './files'
import { c__ } from './samples/c'
import { useSt } from './EditorState'
import { TypescriptOptions } from './TypescriptOptions'

export const ComfyCodeEditorUI = observer(function ComfyCodeEditorUI_(p: {}) {
    const st = useSt()
    return (
        <MonacoEditor //
            height='100vh'
            theme='vs-dark'
            onMount={(editor, monaco) => {
                const compilerOptions: TypescriptOptions = {
                    strict: true,
                    module: monaco.languages.typescript.ModuleKind.ESNext,
                    target: monaco.languages.typescript.ScriptTarget.ESNext,
                    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
                }
                monaco.languages.typescript.typescriptDefaults.setCompilerOptions(compilerOptions)
                monaco.languages.typescript.typescriptDefaults.addExtraLib(c__, 'global.d.ts')
                console.log(monaco.languages.typescript.typescriptVersion)
                for (const file of Object.values(virtualFilesystem)) {
                    const uri = monaco.Uri.parse(`file:///${file.name}`)
                    const model = monaco.editor.createModel(file.value, 'typescript', uri)
                }
                const aModel = monaco.editor.getModel(monaco.Uri.parse(`file:///a.ts`))
                st.file = aModel
                editor.setModel(aModel)
            }}
        />
    )
})
