import type { Field } from '../../model/Field'
import type { SchemaDict } from '../../model/SchemaDict'
import type { Field_choices } from './FieldChoices'

import { ListOfFieldsContainerUI } from '../../form/WidgetsContainerUI'
import { WidgetToggleUI } from '../../form/WidgetToggleUI'

export const WidgetChoices_BodyUI = obs(function WidgetChoices_BodyUI_(p: {
   field: Field_choices<SchemaDict>
   justify?: boolean
   className?: Maybe<string>
}) {
   const field = p.field
   const activeSubwidgets: { branch: string; subField: Maybe<Field> }[] = Object.entries(field._) //
      .map(([branch, subField]) => ({ branch, subField }))

   // return activeSubwidgets.map((i) => i.branch).join(',')
   return (
      <ListOfFieldsContainerUI //
         layout={field.config.layout}
         tw={[field.config.className, p.className]}
      >
         {activeSubwidgets.map((val) => {
            const subField = val.subField
            if (subField == null) return <>❌ error</>
            return (
               <subField.UI //
                  key={val.branch}
                  Toogle={<WidgetToggleUI field={subField} />}
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
