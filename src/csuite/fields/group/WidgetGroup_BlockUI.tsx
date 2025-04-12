import type { Field_group } from './FieldGroup'

import { ListOfFieldsContainerUI } from '../../form/WidgetsContainerUI'

export const WidgetGroup_BlockUI = obs(function WidgetGroup_BlockUI_(p: {
   className?: Maybe<string>
   field: Field_group<any>
}) {
   const field = p.field
   const children = field.zChildrenActive

   return (
      <ListOfFieldsContainerUI //
         layout={p.field.zConfig.layout}
         tw={[field.zConfig.className, p.className]}
      >
         {children.map((child, ix) => {
            return (
               <child.UI //
                  key={child.zMountKey}
                  Indent={(p.field.zConfig.layout === 'H' ? ix === 0 : true) ? undefined : null}
               />
            )
         })}
      </ListOfFieldsContainerUI>
   )
})
