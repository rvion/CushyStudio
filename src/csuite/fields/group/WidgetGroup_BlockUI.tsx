import type { Field_group } from './FieldGroup'

import { ListOfFieldsContainerUI } from '../../form/WidgetsContainerUI'

export const WidgetGroup_BlockUI = obs(function WidgetGroup_BlockUI_(p: {
   //
   className?: Maybe<string>
   field: Field_group
}) {
   const field = p.field
   const children = field.ϟchildrenActive
   const isHorizontal = field.ϟconfig.layout === 'H'

   return (
      <ListOfFieldsContainerUI //
         layout={p.field.ϟconfig.layout}
         tw={[field.ϟconfig.className, p.className]}
      >
         {children.map((child, ix) => {
            const shouldJustifyLabel = isHorizontal ? false : field.ϟconfig.justifyLabel
            return (
               <child.UI
                  key={child.ϟmountKey}
                  Indent={(p.field.ϟconfig.layout === 'H' ? ix === 0 : true) ? undefined : null}
               />
            )
         })}
      </ListOfFieldsContainerUI>
   )
})
