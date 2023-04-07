import * as vscode from 'vscode'

// https://github.com/Microsoft/vscode/issues/34344
// https://github.com/Microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin

import ts from 'typescript'

export async function transpileCode(source: string): Promise<string> {
    // const source = "let x: string  = 'string'"

    const code = source.replace('export default ', '')
    let result = ts.transpileModule(code, {
        compilerOptions: {
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ESNext,
        },
    })

    const out = JSON.stringify(result)
    console.log(Object.keys(result))
    return result.outputText

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
}
