import type { DraftL } from '../../models/Draft'

import { observer } from 'mobx-react-lite'

import { BadgeUI } from '../../csuite/badge/BadgeUI'
import { Dropdown } from '../../csuite/dropdown/Dropdown'
import { MenuDividerUI_ } from '../../csuite/dropdown/MenuDivider2'
import { MenuItem } from '../../csuite/dropdown/MenuItem'
import { useSt } from '../../state/stateContext'

export const DraftMenuLooksUI = observer(function DraftMenuLookUI_(p: {
   title: string
   draft: DraftL
   className?: string
}) {
   const st = useSt()
   const draft = p.draft
   const file = draft.file
   const layout = st.preferedFormLayout
   return (
      <Dropdown
         className={p.className}
         title={'View'}
         content={() => (
            <>
               <MenuItem
                  icon='mdiArrowCollapseVertical'
                  onClick={() => draft.collapseTopLevelFormEntries()}
                  label='Collapse top level entries'
               />
               <MenuItem
                  icon='mdiArrowExpandVertical'
                  onClick={() => draft.expandTopLevelFormEntries()}
                  label='Expand top level entries'
               />
               <MenuDividerUI_ />
               {file?.liteGraphJSON && (
                  <MenuItem
                     onClick={() => st.layout.open('ComfyUI', { litegraphJson: file.liteGraphJSON })}
                     label='Open in ComfyUI'
                  />
               )}
               <MenuDividerUI_ />
               <MenuItem //
                  onClick={() => (st.preferedFormLayout = 'auto')}
                  active={layout == 'auto'}
                  icon='mdiArrowExpandAll'
                  label='Auto Layout'
                  beforeShortcut={<BadgeUI autoHue>recommended</BadgeUI>}
               />
               <MenuItem
                  onClick={() => (st.preferedFormLayout = 'dense')}
                  active={layout == 'dense'}
                  icon='mdiImageSizeSelectSmall'
                  label='Dense Layout'
               />
               <MenuItem
                  onClick={() => (st.preferedFormLayout = 'mobile')}
                  active={layout == 'mobile'}
                  icon='mdiImageSizeSelectLarge'
                  label='Expanded Layout'
               />
               <MenuDividerUI_ />
               <MenuItem
                  onClick={() =>
                     st.setConfigValue('draft.mockup-mobile', !st.getConfigValue('draft.mockup-mobile'))
                  }
                  active={st.isConfigValueEq('draft.mockup-mobile', true)}
                  icon='mdiCellphone'
                  label='Mobile'
               />
            </>
         )}
      />
   )
})
