import type { Field_group } from './FieldGroup'

import { observer } from 'mobx-react-lite'

export const WidgetGroup_InlineUI = observer(function WidgetGroup_InlineUI_<T extends Field_group>(p: {
   className?: string
   field: T
}) {
   const field = p.field
   const children = field.childrenActive
   return (
      <div tw={[field.config.className, p.className, 'flex']}>
         {children.map((child, ix) => {
            return <child.UI key={child.mountKey} />
         })}
      </div>
   )
})
