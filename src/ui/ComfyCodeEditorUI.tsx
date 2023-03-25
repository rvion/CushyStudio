import MonacoEditor, { Monaco } from '@monaco-editor/react'
import { observer } from 'mobx-react-lite'
import { useSt } from './WorkspaceContext'
import { IStandaloneCodeEditor } from './TypescriptOptions'

export const ComfyCodeEditorUI = observer(function ComfyCodeEditorUI_(p: { path?: string }) {
    const client = useSt()
    // 🔴 fix this later
    // if (client.schema.nodes.length === 0) return <WelcomeScreenUI />
    // useEffect
    return (
        <MonacoEditor //
            height='100vh'
            path={p.path}
            keepCurrentModel
            theme='vs-dark'
            onChange={(value) => {
                // console.log('🔴 onChange', value, ev)
                if (value == null) return
                client.script.udpateCode(value) // 🔴
            }}
            // beforeMount={(monaco: Monaco) => client.editor.setupMonaco(monaco)}
            onMount={(editor: IStandaloneCodeEditor, _monaco: Monaco) => {
                editor.updateOptions({
                    wordWrap: 'off',
                })
                if (client.editor.curr) editor.setModel(client.editor.curr)
                client.editor.editorRef.current = editor
                // const prevMonaco = globalMonaco
                // if (prevMonaco !== monaco) {
                //     console.log('🔴 invalid monacoRef.current')
                //     console.log('🔴', prevMonaco)
                //     console.log('🔴', monaco)
                //     throw new Error('monacoRef.current!==monaco')
                // }
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
