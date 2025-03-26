import { CreateButton, FixedSlot, type SelectPopupProps } from './SelectPopupUI'

export const SelectPopupUI_Create = obs(function SelectPopupUI_Create<OPTION>(
   p: SelectPopupProps<OPTION>,
): React.ReactNode {
   const select = p.selectState

   return (
      select.filteredOptions.length > 0 &&
      p.createOption != null &&
      p.createOption.isActive?.() !== false && (
         <FixedSlot>
            <CreateButton select={select} />
         </FixedSlot>
      )
   )
})
