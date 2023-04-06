import * as vscode from 'vscode'

export async function transpileCode(code: string): Promise<string> {
    const extension = vscode.extensions.getExtension('vscode.typescript-language-features')
    if (!extension) throw new Error('TypeScript Language Service not available.')
    const tsServer = await extension.activate()
    if (tsServer && tsServer.getLanguageService) {
        const service = tsServer.getLanguageService()
        console.log('service:', service)
        const transpiledCode = service.transpile(code)
        return transpiledCode
    }
    throw new Error('TypeScript Language Service not available.')
}
