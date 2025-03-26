import { csuiteConfig } from '../config/configureCsuite'
import { CreateButton, FixedSlot, type SelectPopupProps } from './SelectPopupUI'

export const SelectPopupUI_NoResults = obs(function SelectPopupUI_NoResults<OPTION>(
   p: SelectPopupProps<OPTION>,
): React.ReactNode {
   const select = p.selectState

   return select.filteredOptions.length === 0 //
      ? (select.p.slotPlaceholderWhenNoResults ?? (
           <FixedSlot>
              {csuiteConfig.i18n.ui.select.noResults}
              {p.createOption != null && p.createOption.isActive?.() !== false && (
                 <>
                    {' '}
                    - <CreateButton select={select} />
                 </>
              )}
           </FixedSlot>
        ))
      : null
})
