import type { Field } from '../model/Field'

import { Frame } from '../frame/Frame'
import { WidgetLabelCaretPlaceholderUI } from './WidgetLabelCaretPlaceholderUI'

export const LabelCaretWidth: '1rem' = '1rem'

export type WidgetLabelCaretProps = {
   caretClassName?: string
   /** @default true */
   placeholder?: boolean
   field: Field
}

export const WidgetLabelCaretUI = obs(function WidgetLabelCaretUI_(p: Z.UIProps & WidgetLabelCaretProps) {
   // (bird_d): This is always true in cushy, does not have an option.
   // if (!preferences.interface.value.widgetshowExpandCarets) return null
   if (p.field.ϟparent == null) return null

   const isProbablyCollapsible = p.Body != null
   // if (!isProbablyCollapsible) return <>🟢</>
   // return typeof p.Body
   // return <p.Body {...p} />
   // return p.Body ? '🟢' : '🔴' + Object.keys(p).join(', ')
   if (!p.field.ϟisCollapsed && !isProbablyCollapsible) {
      const showPlaceholder = p.placeholder ?? true
      if (showPlaceholder) return <WidgetLabelCaretPlaceholderUI className={p.caretClassName} />
      return null
   }
   return (
      <WidgetLabelCaretAlwaysUI //
         tw='text-sm'
         className={p.caretClassName}
         isCollapsed={p.field.ϟisCollapsed}
      />
   )
})

const WidgetLabelCaretAlwaysUI = obs(function WidgetLabelCaretAlways_({
   isCollapsed,
   className,
}: {
   className?: string
   isCollapsed: boolean
}) {
   // 🔴 TODO:caret

   return (
      <Frame
         className={className}
         tw={[
            //
            'UI-WidgetLabelCaret minh-widget self-start',
            'COLLAPSE-PASSTHROUGH shrink-0',
            'px-0.5',
         ]}
         // TODO(bird_d/variables/negative): isCollapsed should be isExpanded. We should try to always use a "positive" version of an action.
         icon={isCollapsed ? IKONS.mdiChevronRight : IKONS.mdiChevronDown}
         square
      />
   )
})
