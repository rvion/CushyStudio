import type { ServerState } from 'src/back/ServerState'
import type { Options } from 'prettier'

import { existsSync, readFileSync } from 'fs'
import { asRelativePath } from './fs/pathUtils'

import parserTypeScript from 'prettier/parser-typescript'
// import prettier from 'prettier/standalone'

export class CodePrettier {
    config: Options = {
        singleQuote: true,
        semi: false,
        trailingComma: 'all',
        printWidth: 130,
        jsxSingleQuote: true,
        tabWidth: 4,
    }

    constructor(public serverState: ServerState) {
        const possibleConfigPath = serverState.resolveFromRoot(asRelativePath('.prettierrc'))
        const exists = existsSync(possibleConfigPath)
        if (exists) {
            this.config = JSON.parse(readFileSync(possibleConfigPath, 'utf-8'))
        }
    }

    prettify = async (
        //
        source: string,
        parser = 'typescript',
    ): Promise<string> => {
        try {
            const prettier = await import('prettier')
            return prettier.format(source, { ...this.config, parser, plugins: [parserTypeScript] })
        } catch (error) {
            console.log(`❌ error when formating sourceCode: ${error}`)
            return source
        }
    }
}
