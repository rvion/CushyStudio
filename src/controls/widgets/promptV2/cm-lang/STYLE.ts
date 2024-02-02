import { parser } from '../grammar/grammar.parser'

import { foldNodeProp, foldInside, indentNodeProp } from '@codemirror/language'
import { styleTags, tags as t } from '@lezer/highlight'

export const parserWithMetadata = parser.configure({
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
            LoraName: t.bool,
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
