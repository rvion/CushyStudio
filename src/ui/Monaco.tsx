import { Monaco, TypescriptOptions } from './TypescriptOptions'

import { loader } from '@monaco-editor/react'
import { logger } from '../logger/Logger'

// import * as monaco from 'monaco-editor'

// @ts-ignore
// import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
// import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
// import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
// import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'

// @ts-ignore
// import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

// self.MonacoEnvironment = {
//     getWorker(_, label) {
//         // if (label === 'json') return new jsonWorker()
//         // if (label === 'css' || label === 'scss' || label === 'less') return new cssWorker()
//         // if (label === 'html' || label === 'handlebars' || label === 'razor') return new htmlWorker()
//         if (label === 'typescript' || label === 'javascript') return new tsWorker()

//         return new editorWorker()
//     },
// }

loader.config({
    // load monaco from the cdn
    paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.36.1/min/vs' },
})

let _setGlobalMonaco: (monaco: Monaco) => void
export const globalMonaco = new Promise<Monaco>((resove, _rejects) => {
    _setGlobalMonaco = resove
})

export const ensureMonacoReady = () => {
    loader.init().then((monaco) => {
        logger.info(`👁️`, `monaco ready`)
        const compilerOptions: TypescriptOptions = {
            strict: true,
            module: monaco.languages.typescript.ModuleKind.ESNext,
            target: monaco.languages.typescript.ScriptTarget.ESNext,
            moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        }
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions(compilerOptions)
        logger.info(`👁️`, `typescript ready (${monaco.languages.typescript.typescriptVersion})`)
        _setGlobalMonaco(monaco)
    })
}

// const setupMonaco = (monaco: Monaco) => {
//     // console.log('[👁] setup typescript...')
//     globalMonaco = monaco
// }
