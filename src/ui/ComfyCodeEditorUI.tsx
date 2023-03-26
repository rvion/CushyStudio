import type { TypescriptBuffer } from './code/TypescriptBuffer'
import type { IStandaloneCodeEditor } from './TypescriptOptions'

import { Spinner } from '@fluentui/react-components'
import MonacoEditor, { Monaco } from '@monaco-editor/react'
import { observer } from 'mobx-react-lite'

export const TypescriptEditorUI = observer(function ComfyCodeEditorUI_(p: {
    //
    buffer: TypescriptBuffer
}) {
    const buff = p.buffer
    const textModel = buff.textModel
    if (textModel == null) return <Spinner />
    return (
        <MonacoEditor //
            height='100vh'
            path={p.buffer.path}
            keepCurrentModel
            theme='vs-dark'
            onChange={(e) => buff.udpateCode(e)}
            // beforeMount={(monaco: Monaco) => client.editor.setupMonaco(monaco)}
            onMount={(editor: IStandaloneCodeEditor, _monaco: Monaco) => {
                editor.updateOptions({ wordWrap: 'off' })
                editor.setModel(textModel)
            }}
        />
    )
})

// if (client.editor.curr) editor.setModel(client.editor.curr)
// client.editor.editorRef.current = editor
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
