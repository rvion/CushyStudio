import type { TypescriptBuffer } from './TypescriptBuffer'
import type { IStandaloneCodeEditor } from '../ui/TypescriptOptions'

import { Spinner } from '@fluentui/react-components'
import MonacoEditor, { Monaco } from '@monaco-editor/react'
import { observer } from 'mobx-react-lite'
import { ProjectToolbarUI } from '../ui/ToolbarUI'

export const TypescriptEditorUI = observer(function TypescriptEditorUI_(p: {
    //
    buffer: TypescriptBuffer
}) {
    const buff = p.buffer
    const textModel = buff.textModel
    if (textModel == null) return <Spinner />
    return (
        <div className='col' style={{ height: '100%' }}>
            <ProjectToolbarUI />
            <div className='grow'>
                <MonacoEditor
                    // width='100vw'
                    // height='100%'
                    path={p.buffer.monacoPath}
                    keepCurrentModel
                    options={{ automaticLayout: true }}
                    theme='vs-dark'
                    onChange={(e) => buff.udpateCodeFromEditor(e)}
                    onMount={(editor: IStandaloneCodeEditor, _monaco: Monaco) => {
                        editor.updateOptions({ wordWrap: 'off' })
                        editor.setModel(textModel)
                    }}
                />
            </div>
        </div>
    )
})
