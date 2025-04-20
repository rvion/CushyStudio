import type { Field } from '../../csuite/model/Field'
import type { FieldPattern, FieldPattern_Flat } from './RenderRule'

import { isField } from '../../csuite/fields/WidgetUI.DI'

const neverMatcher = 'zzzzzzz'

export function normalizePattern<FIELD extends Field>(
   pattern: FieldPattern<FIELD>,
   nestedWithin?: Maybe<string>,
): FieldPattern_Flat<FIELD> {
   if (nestedWithin) return normalizePatternWithPrefix(pattern, nestedWithin)
   return toRawFieldSelector(pattern)
}

export function toRawFieldSelector(pattern: FieldPattern<Field>) {
   if (typeof pattern === 'boolean') return pattern ? '' : neverMatcher
   if (typeof pattern === 'string') return pattern
   if (isField(pattern)) return `#${pattern.zUid}`
   if (Array.isArray(pattern))
      return pattern.length === 0 //
         ? neverMatcher
         : `{${pattern.map((f) => `#${f.zUid}`).join('|')}}`
   pattern satisfies never
   throw new Error(`Invalid pattern: ${pattern}`)
}

export function normalizePatternWithPrefix<FIELD extends Field>(
   pattern: FieldPattern<FIELD>,
   nestedWithin: string,
): FieldPattern_Flat<FIELD> {
   if (typeof pattern === 'boolean') return pattern ? `${nestedWithin}>` : neverMatcher
   if (typeof pattern === 'string') {
      const normalized = toRawFieldSelector(pattern)
      if (normalized.startsWith('&')) return `${nestedWithin}${normalized.slice(1)}`
      return `${nestedWithin}>${pattern}`
   }
   if (isField(pattern)) return `#${pattern.zUid}`
   if (Array.isArray(pattern))
      return pattern.length === 0 //
         ? neverMatcher
         : `{${pattern.map((f) => `#${f.zUid}`).join('|')}}`

   pattern satisfies never
   throw new Error(`Invalid pattern: ${pattern}`)
}
