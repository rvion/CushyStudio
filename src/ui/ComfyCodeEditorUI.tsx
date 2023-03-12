import MonacoEditor, { Monaco } from '@monaco-editor/react'
import { observer } from 'mobx-react-lite'
import { virtualFilesystem } from './files'
import { c__ } from './samples/c'
import { useSt } from './stContext'
import { IStandaloneCodeEditor, TypescriptOptions } from './TypescriptOptions'

export const ComfyCodeEditorUI = observer(function ComfyCodeEditorUI_(p: { path?: string }) {
    const client = useSt()
    return (
        <MonacoEditor //
            height='100vh'
            path={p.path}
            keepCurrentModel
            theme='vs-dark'
            onChange={(value) => {
                if (value == null) return
                client.project.udpateCode(value) // 🔴
            }}
            beforeMount={(monaco: Monaco) => client.editor.setupMonaco(monaco)}
            onMount={(editor: IStandaloneCodeEditor, monaco: Monaco) => {
                client.editor.editorRef.current = editor
                const prevMonaco = client.editor.monacoRef.current
                if (prevMonaco !== monaco) {
                    console.log('🔴 invalid monacoRef.current')
                    console.log('🔴', prevMonaco)
                    console.log('🔴', monaco)
                    throw new Error('monacoRef.current!==monaco')
                }
                // for (const file of Object.values(virtualFilesystem)) {
                //     const uri = monaco.Uri.parse(`file:///${file.name}`)
                //     const model = monaco.editor.createModel(file.value, 'typescript', uri)
                // }
                // const aModel = monaco.editor.getModel(monaco.Uri.parse(`file:///a.ts`))
                // // st.file = aModel
                // client.project.udpateCode(virtualFilesystem['a.ts'].value)
                // editor.setModel(aModel)
            }}
        />
    )
})
