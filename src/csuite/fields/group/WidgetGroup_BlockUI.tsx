import type { Field_group } from './FieldGroup'

import { observer } from 'mobx-react-lite'

import { ListOfFieldsContainerUI } from '../../form/WidgetsContainerUI'

export const WidgetGroup_BlockUI = observer(function WidgetGroup_BlockUI_(p: {
   //
   className?: Maybe<string>
   field: Field_group
}) {
   const field = p.field
   const children = field.childrenActive
   const isHorizontal = field.config.layout === 'H'

   return (
      <ListOfFieldsContainerUI //
         layout={p.field.config.layout}
         tw={[field.config.className, p.className]}
      >
         {children.map((child, ix) => {
            const shouldJustifyLabel = isHorizontal ? false : field.config.justifyLabel
            return (
               <child.UI
                  key={child.mountKey}
                  Indent={(p.field.config.layout === 'H' ? ix === 0 : true) ? undefined : null}
               />
            )
         })}
      </ListOfFieldsContainerUI>
   )
})
