export type PromptLangNodeName =
   | 'Separator'
   | 'WeightedExpression'
   | 'Permutations'
   | 'Lora'
   | 'Tag'
   | 'Embedding'
   | 'Wildcard'
   | 'Separator'
   | 'Break'
   | 'Identifier'
   | 'Number'
   | 'String'

export const nodeName = (_: PromptLangNodeName): PromptLangNodeName => _
