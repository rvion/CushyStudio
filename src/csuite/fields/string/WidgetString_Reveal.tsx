import type { Field_string } from './FieldString'

import { memoized } from '../../hashUtils/hash'
import { RevealUI } from '../../reveal/RevealUI'
import { WidgetString_SmallInput } from './WidgetString_SmallInput'

export const WidgetString_Reveal = obs(function WidgetString_Reveal_({
   field,
   readonly,
   placeholder,
}: {
   field: Field_string
   readonly?: boolean
   placeholder?: string
}) {
   const content = memoized(
      field,
      'content',
      () => <WidgetString_SmallInput field={field} readonly={readonly} />,
      [],
   )
   return (
      <RevealUI
         onAnchorKeyDown={(ev, rv) => {
            if (ev.key === 'Enter') {
               ev.stopPropagation()
               rv.anchorRef.focusFirstInputLikeOnMountOrNowIfMounted_EVEN_IF_FOCUS_ALREADY_INSIDE()
               rv.close()
            }
         }}
         showTriggers={{ keyboardEnterOrLetterWhenAnchorFocused: true, anchorClick: true }}
         placement='above-no-max-size'
         children={
            <div tabIndex={1} tw='overflow-ellipsis line-clamp-1 flex-grow'>
               {field.zValueUnchecked || (placeholder ?? <div tw='italic opacity-50'>no title</div>)}
            </div>
         }
         content={content}
      />
   )
})
