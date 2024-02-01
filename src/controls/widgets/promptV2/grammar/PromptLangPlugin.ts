import { LanguageSupport } from '@codemirror/language'
import { exampleCompletion2 } from './XXCOMPLETION'
import { PromptLangCore } from './grammar.xxx'
import { regexpLinter } from './LINT'

export function PromptLangPlugin() {
    return new LanguageSupport(
        //
        PromptLangCore,
        [exampleCompletion2, regexpLinter],
    )
}
