import { parser } from './grammar.parser'

import { foldNodeProp, foldInside, indentNodeProp } from '@codemirror/language'
import { styleTags, tags as t } from '@lezer/highlight'

// ----------------------------------------------------------------
let parserWithMetadata = parser.configure({
    props: [
        styleTags({
            String: t.string,
            Identifier: t.variableName,
            Boolean: t.bool,
            // this needs to be red
            LightnendExpression: t.heading3,
            WeightedExpression: t.heading4,
            Permutations: t.heading1,
            Lora: t.heading2,
            LineComment: t.lineComment,
            Wildcards: t.heading5,
            '( )': t.paren,
        }),
        indentNodeProp.add({
            Application: (context) => context.column(context.node.from) + context.unit,
        }),
        foldNodeProp.add({
            Application: foldInside,
            WeightedExpression: foldInside,
            Permutations: foldInside,
        }),
    ],
})

// ----------------------------------------------------------------
import { LRLanguage } from '@codemirror/language'

export const exampleLanguage = LRLanguage.define({
    parser: parserWithMetadata,
    languageData: {
        commentTokens: { line: ';' },
    },
})

// ----------------------------------------------------------------
import { completeFromList } from '@codemirror/autocomplete'

export const exampleCompletion = exampleLanguage.data.of({
    autocomplete: completeFromList([
        { label: 'defun', type: 'keyword' },
        { label: 'defvar', type: 'keyword' },
        { label: 'let', type: 'keyword' },
        { label: 'cons', type: 'function' },
        { label: 'car', type: 'function' },
        { label: 'cdr', type: 'function' },
    ]),
})

// ----------------------------------------------------------------
import { LanguageSupport } from '@codemirror/language'

export function mycustomlanguage() {
    return new LanguageSupport(exampleLanguage, [exampleCompletion])
}
