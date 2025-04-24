import type { Field_prompt } from '../FieldPrompt'

import { memoized } from '../../csuite/hashUtils/hash'
import { RevealUI } from '../../csuite/reveal/RevealUI'

export const WidgetPromptUI2 = obs(function WidgetPromptUI2_(p: { field: Field_prompt }) {
   const field = p.field

   // 💬 2025-04-24 rvion: HOHO HOHO HO HO HO should be standard
   const content = memoized(
      field,
      'WidgetPromptUIBird_d',
      () => <uy.prompt.WidgetPromptUIBird_d field={field} />,
      [],
   )
   return (
      <RevealUI content={content} onRevealed={() => void (cushy.activePrompt = field)}>
         <div>{field.text}</div>
      </RevealUI>
   )
})
