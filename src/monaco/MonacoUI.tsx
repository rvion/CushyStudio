import type { TypescriptFile } from './TypescriptFile'
import type { IStandaloneCodeEditor } from '../ui/TypescriptOptions'

import { Loader } from 'rsuite'
import MonacoEditor, { Monaco } from '@monaco-editor/react'
import { observer } from 'mobx-react-lite'
import { ProjectToolbarUI } from '../ui/ToolbarUI'

export const TypescriptEditorUI = observer(function TypescriptEditorUI_(p: {
    //
    buffer: TypescriptFile
}) {
    const buff = p.buffer
    const textModel = buff.textModel
    if (textModel == null) return <Loader />
    return (
        <div className='col' style={{ height: '100%' }}>
            <ProjectToolbarUI />
            <div className='grow'>
                <MonacoEditor
                    // width='100vw'
                    // height='100%'
                    path={p.buffer.conf.virtualPathTS}
                    keepCurrentModel
                    options={{ automaticLayout: true }}
                    theme='vs-dark'
                    onChange={(e) => buff.udpateFromEditor(e)}
                    onMount={(editor: IStandaloneCodeEditor, _monaco: Monaco) => {
                        editor.updateOptions({ wordWrap: 'off' })
                        editor.setModel(textModel)
                    }}
                />
            </div>
        </div>
    )
})
