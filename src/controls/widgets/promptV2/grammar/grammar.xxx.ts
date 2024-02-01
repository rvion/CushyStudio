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
            LoraName: t.heading2,
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

export const PromptLangCore = LRLanguage.define({
    parser: parserWithMetadata,
    name: 'PromptLang',
    languageData: {
        commentTokens: { line: ';' },
    },
})
