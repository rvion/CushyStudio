import type { Field_string } from './FieldString'

import { memoized } from '../../hashUtils/hash'
import { RevealUI } from '../../reveal/RevealUI'
import { WidgetString_SmallInput } from './WidgetString_SmallInput'

export const WidgetString_Reveal = obs(function WidgetString_Reveal_({
   field,
   readonly,
}: {
   field: Field_string
   readonly?: boolean
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
               rv.anchorRef.focusOnMountOrNowIfMounted_EVEN_IF_FOCUS_ALREADY_INSIDE()
               rv.close()
            }
         }}
         placement='above-no-max-size'
         children={<div tw='overflow-ellipsis line-clamp-1 flex-grow'>{field.zValueUnchecked}</div>}
         content={content}
      />
   )
})
