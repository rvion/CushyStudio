import { Ikon } from '../icons/iconHelpers'

export const WidgetLabelCaretPlaceholderUI = obs(function WidgetLabelCaretPlaceholderUI_(p: {
   className?: string
}) {
   return (
      <Ikon._
         className={p.className}
         tw={[
            //
            'UI-WidgetLabelCaret minh-widget self-start',
            'COLLAPSE-PASSTHROUGH shrink-0',
         ]}
      />
   )
})
