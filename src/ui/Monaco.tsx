import { useEffect, useState } from 'react'
import { Monaco, TypescriptOptions } from './TypescriptOptions'

import { loader } from '@monaco-editor/react'

import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
// import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
// import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
// import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

self.MonacoEnvironment = {
    getWorker(_, label) {
        // if (label === 'json') return new jsonWorker()
        // if (label === 'css' || label === 'scss' || label === 'less') return new cssWorker()
        // if (label === 'html' || label === 'handlebars' || label === 'razor') return new htmlWorker()
        if (label === 'typescript' || label === 'javascript') return new tsWorker()

        return new editorWorker()
    },
}

loader.config({ monaco })

export let globalMonaco = null as Monaco | null

export const ensureMonacoReady = () => {
    const [monaco, setMonaco] = useState(null as Monaco | null)
    useEffect(() => {
        // loader.init().then(/* ... */)
        console.log('[🔵] setup Monaco...')
        loader.init().then((monaco) => {
            // console.log('here is the monaco instance:', monaco)
            console.log(`[🔵] monaco ready`)
            setupMonaco(monaco)
            globalMonaco = monaco
            setMonaco(monaco)
        })
    }, [])
    return monaco
}

const setupMonaco = (monaco: Monaco) => {
    if (globalMonaco === monaco) return
    console.log('[👁] setup typescript...')
    globalMonaco = monaco
    const compilerOptions: TypescriptOptions = {
        strict: true,
        module: monaco.languages.typescript.ModuleKind.ESNext,
        target: monaco.languages.typescript.ScriptTarget.ESNext,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    }
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions(compilerOptions)
    console.log(`[👁] typescript ready (${monaco.languages.typescript.typescriptVersion})`)
}
