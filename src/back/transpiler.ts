// this module could be shared, but I don't want the browser build to include typescript
// import * as vscode from 'vscode'

// https://github.com/Microsoft/vscode/issues/34344
// https://github.com/Microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin

import ts from 'typescript'

import { exec } from 'child_process'
import { AbsolutePath } from 'src/utils/fs/BrandedPaths'

export async function transpileCode(filePath: AbsolutePath): Promise<string> {
    const esbuildPath = `./node_modules/.bin/esbuild`
    const result = await new Promise<string>((resolve, reject) => {
        exec(`${esbuildPath} --bundle ${filePath}`, (err, stdout, stderr) => {
            if (err) {
                console.log('[🌭] transpile error', err, stdout, stderr)
                reject(err)
            } else resolve(stdout)
        })
    })
    return result
}

export async function transpileCodeOld(code: string): Promise<string> {
    let result = ts.transpileModule(code, {
        compilerOptions: {
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ESNext,
            // esModuleInterop: true,
            // moduleResolution: ts.ModuleResolutionKind.Node10,
        },
    })

    const out = JSON.stringify(result)
    // console.log(Object.keys(result))
    return 'var exports = {};\n' + result.outputText
}

// const extension = vscode.extensions.getExtension('vscode.typescript-language-features')
// if (!extension) throw new Error('TypeScript Language Service not available.')
// const tsServer = await extension.activate()
// if (tsServer && tsServer.getLanguageService) {
//     const service = tsServer.getLanguageService()
//     console.log('service:', service)
//     const transpiledCode = service.transpile(code)
//     return transpiledCode
// }
// throw new Error('TypeScript Language Service not available.')

// export async function transpileAndBUndleCode(code: string): Promise<string> {
//     // const source = "let x: string  = 'string'"

//     // const code = source.replace('export default ', '')
//     ts.bundlerModuleNameResolver()
//     let result = ts.transpileModule(code, {
//         compilerOptions: {
//             module: ts.ModuleKind.CommonJS,
//             target: ts.ScriptTarget.ESNext,
//         },
//     })

//     const out = JSON.stringify(result)
//     console.log(Object.keys(result))
//     return result.outputText

//     // const extension = vscode.extensions.getExtension('vscode.typescript-language-features')
//     // if (!extension) throw new Error('TypeScript Language Service not available.')
//     // const tsServer = await extension.activate()
//     // if (tsServer && tsServer.getLanguageService) {
//     //     const service = tsServer.getLanguageService()
//     //     console.log('service:', service)
//     //     const transpiledCode = service.transpile(code)
//     //     return transpiledCode
//     // }
//     // throw new Error('TypeScript Language Service not available.')
// }
