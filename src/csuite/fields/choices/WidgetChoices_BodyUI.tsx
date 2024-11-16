import type { Field } from '../../model/Field'
import type { SchemaDict } from '../../model/SchemaDict'
import type { Field_choices } from './FieldChoices'

import { observer } from 'mobx-react-lite'

import { ListOfFieldsContainerUI } from '../../form/WidgetsContainerUI'
import { WidgetToggleUI } from '../../form/WidgetToggleUI'

export const WidgetChoices_BodyUI = observer(function WidgetChoices_BodyUI_<
   //
   T extends SchemaDict,
>(p: { field: Field_choices<T>; justify?: boolean; className?: string }) {
   const field = p.field
   const activeSubwidgets: {
      branch: string
      subWidget: Field
   }[] = Object.entries(field.activeBranchesDict) //
      .map(([branch, subWidget]) => ({ branch, subWidget }))

   // return activeSubwidgets.map((i) => i.branch).join(',')
   return (
      <ListOfFieldsContainerUI //
         layout={field.config.layout}
         tw={[field.config.className, p.className]}
      >
         {activeSubwidgets.map((val) => {
            const subWidget = val.subWidget
            if (subWidget == null) return <>❌ error</>
            return (
               <subWidget.UI //
                  key={val.branch}
                  Toogle={<WidgetToggleUI field={subWidget} />}
               />
            )
            // return (
            //     <WidgetWithLabelUI //
            //         justifyLabel={p.justify}
            //         key={val.branch}
            //         fieldName={val.branch}
            //         field={subWidget}
            //         // label={widget.isSingle ? false : undefined}
            //     />
            // )
         })}
      </ListOfFieldsContainerUI>
   )
})
