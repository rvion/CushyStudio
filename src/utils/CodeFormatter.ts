import type { Options } from 'prettier'

import typescript from 'prettier/plugins/typescript'
import estree from 'prettier/plugins/estree'
import { STATE } from 'src/front/state'

// ❓import { existsSync, readFileSync } from 'fs'
// ❓import { asRelativePath } from './fs/pathUtils'

export class CodePrettier {
    config: Options = {
        singleQuote: true,
        semi: false,
        trailingComma: 'all',
        printWidth: 130,
        jsxSingleQuote: true,
        tabWidth: 4,
    }

    constructor(public st: STATE) {
        // [PERF] this works, but is it needed 🤔
        // ❓ const possibleConfigPath = st.resolveFromRoot(asRelativePath('.prettierrc'))
        // ❓ const exists = existsSync(possibleConfigPath)
        // ❓ if (exists) {
        // ❓     this.config = JSON.parse(readFileSync(possibleConfigPath, 'utf-8'))
        // ❓ }
    }

    prettify = async (source: string, parser = 'typescript'): Promise<string> => {
        return source
        // ❓ try {
        // ❓     const prettier = await import('prettier')
        // ❓     return prettier.format(source, {
        // ❓         plugins: [typescript, estree],
        // ❓         ...this.config,
        // ❓         parser,
        // ❓     })
        // ❓ } catch (error) {
        // ❓     console.log(`❌ error when formating sourceCode: ${error}`)
        // ❓     return source
        // ❓ }
    }
}
