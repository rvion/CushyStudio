import { LanguageSupport } from '@codemirror/language'
import { PromptComletion1 } from './COMPLETION'
import { PromptLinter1 } from './LINT'
import { LRLanguage } from '@codemirror/language'
import { parserWithMetadata } from './STYLE'
import { PromptKeymap1 } from './COMMANDS'

export const PromptLangBase = LRLanguage.define({
    parser: parserWithMetadata,
    name: 'PromptLang',
    languageData: {
        commentTokens: { line: ';' },
    },
})

export function PromptLang() {
    return new LanguageSupport(
        //
        PromptLangBase,
        [
            //
            PromptComletion1,
            PromptLinter1,
        ],
    )
}
