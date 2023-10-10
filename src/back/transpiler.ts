// this module could be shared, but I don't want the browser build to include typescript
// import * as vscode from 'vscode'

// https://github.com/Microsoft/vscode/issues/34344
// https://github.com/Microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin

import ts from 'typescript'

import { spawn } from 'child_process'
import { AbsolutePath } from 'src/utils/fs/BrandedPaths'
import os from 'os'

export async function transpileCode(filePath: AbsolutePath): Promise<string> {
    // Attempt to start esbuild from node_modules/.bin/esbuild
    const isWindows = os.platform() === 'win32'
    let esbuildPath: string
    let command: string
    let args: string[]
    if (isWindows) {
        esbuildPath = `./node_modules/esbuild/bin/esbuild`
        command = 'node'
        args = [esbuildPath, '--bundle', filePath]
    } else {
        esbuildPath = `./node_modules/.bin/esbuild`
        command = esbuildPath
        args = ['--bundle', filePath]
    }

    const result = await new Promise<string>((resolve, reject) => {
        const esbuildProcess = spawn(command, args)
        let output = ''

        esbuildProcess.stdout.on('data', (data) => {
            output += data
        })

        esbuildProcess.stderr.on('data', (data) => {
            console.log('[🌭] transpile error data:', data.toString())
        })

        esbuildProcess.on('error', (err) => {
            console.log('[🌭] transpile error', err)
            reject(err)
        })

        esbuildProcess.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`esbuild process exited with code ${code}`))
            } else {
                resolve(output)
            }
        })
    })

    // const result = await new Promise<string>((resolve, reject) => {
    //     exec(`${esbuildPath} --bundle ${filePath}`, (err, stdout, stderr) => {
    //         if (err) {
    //             console.log('[🌭] transpile error', err, stdout, stderr)
    //             reject(err)
    //         } else resolve(stdout)
    //     })
    // })
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
