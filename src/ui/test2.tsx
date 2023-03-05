import React, { useState } from 'react'
import ReactDOM from 'react-dom'

import Editor from '@monaco-editor/react'
import { KnownFiles, virtualFilesystem } from './files'

const defaultFile: KnownFiles = 'a.ts'

export function Test2() {
    const [fileName, setFileName] = useState(defaultFile)
    const file = virtualFilesystem[fileName]

    return (
        <>
            <div className='col menu'>
                <h3>Files</h3>
                <button disabled={fileName === 'a.ts'} onClick={() => setFileName('a.ts')}>
                    a.ts
                </button>
                <button disabled={fileName === 'b.ts'} onClick={() => setFileName('b.ts')}>
                    b.ts
                </button>
                <button disabled={fileName === 'c.ts'} onClick={() => setFileName('c.ts')}>
                    c.ts
                </button>
            </div>
            <Editor //
                height='100vh'
                theme='vs-dark'
                path={file.name}
                defaultLanguage={file.language}
                defaultValue={file.value}
            />
        </>
    )
}
