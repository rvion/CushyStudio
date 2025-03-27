import type { SelectProps } from '../../select/SelectProps'
import type { Field_selectOne } from './FieldSelectOne'
import type { SelectKey } from './SelectOneKey'
import type { SelectOption } from './SelectOption'

import { SelectUI } from '../../select/SelectUI'
import { makeLabelFromPrimitiveValue } from '../../utils/makeLabelFromFieldName'

export const WidgetSelectOne_SelectUI = obs(function WidgetSelectOne_SelectUI_<
   VALUE,
   KEY extends SelectKey,
>(p: {
   field: Field_selectOne<VALUE, KEY>
   selectProps?: Partial<SelectProps<SelectOption<VALUE, KEY> | undefined>>
}) {
   const field = p.field
   type OPTION = // prettier-ignore
      // when set:
      | SelectOption<VALUE, KEY>
      // when not-set:
      | undefined
   return (
      <div tw='w-full flex-1'>
         <SelectUI<OPTION>
            // 💬 2024-09-16 rvion: still necessary ?
            // | probably not; todo: remove
            key={field.ϟuid}
            // 💬 2024-09-16 rvion: weird/tmporary class name here
            // | this is just so we outline the input with a red border
            //                                                                     VVVVVVVVVVVVVVVVV
            tw={[field.ϟownTypeSpecificProblems && !field.ϟisInsideDisabledBranch && 'rsx-field-error']}
            // 💬 2024-09-16 rvion:
            // | since 2024-09-12, we can't use the value anymore
            // | since the value may not be set anymore, we need to use
            // | the unchecked version of it
            // |               VVVVVVVVVVVVVVVVVVVVVVVV
            value={() => field.selectedOption_unchecked}
            options={() => field.options}
            getLabelText={(t): string => {
               if (t == null) return field.ϟconfig.placeholder ?? '(Empty)'
               return t.label ?? makeLabelFromPrimitiveValue(t.id)
            }}
            //
            OptionLabelUI={field.ϟconfig.OptionLabelUI}
            getSearchQuery={() => field.query}
            setSearchQuery={(query) => (field.query = query)}
            disableLocalFiltering={field.ϟconfig.disableLocalFiltering}
            equalityCheck={(a, b) => a?.id === b?.id}
            placeholder={field.ϟconfig.placeholder}
            readonly={field.ϟconfig.readonly}
            slotAnchorContentUI={field.ϟconfig.SlotAnchorContentUI}
            onCleared={
               field.ϟcanBeToggledWithinParent
                  ? (): void => {
                       field.ϟdisableSelfWithinParent()
                       field.ϟtouch()
                       p.selectProps?.onCleared?.()
                    }
                  : undefined
            }
            onOptionToggled={(option) => {
               console.log(`[🤠] option`, option, field.selectedId, option?.id === field.selectedId)
               field.ϟtouch()
               if (option == null || field.selectedId === option.id) return field.unset()
               field.selectedId = option.id
            }}
            {...p.selectProps}
            revealProps={{
               ...p.selectProps?.revealProps,
               onHidden: (reason) => {
                  field.ϟtouch()
                  p.selectProps?.revealProps?.onHidden?.(reason)
               },
            }}
         />
      </div>
   )
})
