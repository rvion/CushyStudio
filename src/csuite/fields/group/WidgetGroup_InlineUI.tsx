import type { Field_group } from './FieldGroup'

export const WidgetGroup_InlineUI = obs(function WidgetGroup_InlineUI_<T extends Field_group>(p: {
   className?: string
   field: T
}) {
   const field = p.field
   const children = field.zChildrenActive
   return (
      <div tw={[field.zConfig.className, p.className, 'flex']}>
         {children.map((child, ix) => {
            return <child.UI key={child.zMountKey} />
         })}
      </div>
   )
})
