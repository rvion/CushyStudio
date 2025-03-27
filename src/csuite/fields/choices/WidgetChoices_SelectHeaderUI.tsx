import type { SchemaDict } from '../../model/SchemaDict'
import type { Field_choices } from './FieldChoices'

import { Button } from '../../button/Button'
import { csuiteConfig } from '../../config/configureCsuite'
import { SelectUI } from '../../select/SelectUI'

export const WidgetChoices_SelectHeaderUI = obs(function WidgetChoices_SelectLineUI_<
   T extends SchemaDict,
>(p: { field: Field_choices<T> }) {
   const field = p.field
   type Entry = { key: string; label: string }
   const choices: Entry[] = field.choicesWithLabels

   const isActive = !p.field.canBeToggledWithinParent || p.field.isEnabledWithinParent

   return (
      <div
         tw='relative flex flex-1 flex-row gap-2'
         onMouseDown={(ev) => {
            ev.preventDefault()
            ev.stopPropagation()
         }}
      >
         <SelectUI<Entry>
            key={`${isActive}`}
            tw='flex-grow'
            placeholder={p.field.config.placeholder ?? csuiteConfig.i18n.ui.field.empty}
            value={() =>
               isActive
                  ? field.activeBranchNames.map((key) => ({
                       key,
                       label: choices.find((v) => v.key === key)?.label ?? key,
                    }))
                  : []
            }
            options={() => choices}
            getLabelText={(v) => v.label}
            OptionLabelUI={(v) => (
               <div tw='flex flex-1 justify-between'>
                  <div tw='flex-1'>{v.label}</div>
                  {/* 👇 TODO: clean this */}
                  {/* {v.key in widget.serial.values_ && (
                            <div
                                tw='btn btn-square btn-sm'
                                onClick={(ev) => {
                                    ev.preventDefault()
                                    ev.stopPropagation()
                                }}
                            >
                                <span className='material-symbols-outlined'>delete</span>
                            </div>
                        )} */}
               </div>
            )}
            equalityCheck={(a, b) => a.key === b.key}
            multiple={field.config.multi ?? false}
            // closeOnPick={false}
            resetQueryOnPick={false}
            onOptionToggled={(v) => {
               if (p.field.canBeToggledWithinParent) p.field.enableSelfWithinParent()
               field.toggleBranch(v.key)
               p.field.ܒtouch()
            }}
         />
         {p.field.canBeToggledWithinParent && (
            <Button
               tw='flex-shrink flex-grow-0'
               size='input'
               borderless
               subtle
               square
               icon={IKONS.mdiClose}
               disabled={!isActive}
               onClick={() => {
                  field.disableSelfWithinParent()
                  p.field.ܒtouch()
               }}
            />
         )}
      </div>
   )
})
