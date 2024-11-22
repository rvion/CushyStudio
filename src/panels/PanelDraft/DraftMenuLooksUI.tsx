import type { MenuEntry } from '../../csuite/menu/MenuEntry'
import type { DraftL } from '../../models/Draft'

import { BadgeUI } from '../../csuite/badge/BadgeUI'
import { MenuTemplate } from '../../csuite/menu/MenuTemplate'

export const DraftMenuLooks = new MenuTemplate<DraftMenuLooksProps>({
   title: 'View',
   entries: (p, b): MenuEntry[] => [
      b.SimpleMenuAction({
         icon: 'mdiArrowCollapseVertical',
         onClick: () => p.draft.collapseTopLevelFormEntries(),
         label: 'Collapse top level entries',
      }),
      b.SimpleMenuAction({
         icon: 'mdiArrowExpandVertical',
         onClick: () => p.draft.expandTopLevelFormEntries(),
         label: 'Expand top level entries',
      }),
      b.Divider,
      b.SimpleMenuAction({
         disabled: p.draft.file?.liteGraphJSON == null,
         onClick: () => cushy.layout.open('ComfyUI', { litegraphJson: p.draft.file.liteGraphJSON }),
         label: 'Open in ComfyUI',
      }),
      b.Divider,
      b.SimpleMenuAction({
         icon: 'mdiArrowExpandAll',
         onClick: () => (cushy.preferedFormLayout = 'auto'),
         active: cushy.preferedFormLayout == 'auto',
         label: 'Auto Layout',
         beforeShortcut: <BadgeUI autoHue>recommended</BadgeUI>,
      }),
      b.SimpleMenuAction({
         icon: 'mdiImageSizeSelectSmall',
         onClick: () => (cushy.preferedFormLayout = 'dense'),
         active: cushy.preferedFormLayout == 'dense',
         label: 'Dense Layout',
      }),
      b.SimpleMenuAction({
         icon: 'mdiImageSizeSelectLarge',
         onClick: () => (cushy.preferedFormLayout = 'mobile'),
         active: cushy.preferedFormLayout == 'mobile',
         label: 'Expanded Layout',
      }),
      b.Divider,
      b.SimpleMenuAction({
         icon: 'mdiCellphone',
         onClick: () =>
            cushy.setConfigValue('draft.mockup-mobile', !cushy.getConfigValue('draft.mockup-mobile')),
         active: cushy.isConfigValueEq('draft.mockup-mobile', true),
         label: 'Mobile',
      }),
      b.Divider,
      b.SubMenu({
         title: 'files',
         entries: () => [
            ...Object.keys(p.draft.app.script.data.metafile?.inputs ?? {}).map((t, ix) =>
               b.SimpleMenuAction({ label: t, onClick: () => console.log(t) }),
            ),
         ],
      }),
   ],
})

type DraftMenuLooksProps = {
   title: string
   draft: DraftL
   className?: string
}

// export const DraftMenuLooksUI = observer(function DraftMenuLookUI_(p: DraftMenuLooksProps) {
//    const draft = p.draft
//    const file = draft.file
//    const layout = cushy.preferedFormLayout
//    return (
//       <Dropdown
//          className={p.className}
//          title={'View'}
//          content={() => (
//             <>
//                {/* <MenuItem
//                   placement='topStart'
//                   onClick={() => (
//                      <div tw='bd1 overflow-auto' style={{ maxHeight: '30rem' }}>
//                         <ul>
//                            View{' '}
//                            {Object.keys(app.script.data.metafile?.inputs ?? {}).map((t, ix) => (
//                               <li key={ix}>{t}</li>
//                            ))}
//                         </ul>
//                      </div>
//                   )}
//                >
//                   <div tw='subtle'>{Object.keys(app.script.data.metafile?.inputs ?? {}).length} files</div>
//                </MenuItem> */}
//                <MenuItem
//                   icon='mdiArrowCollapseVertical'
//                   onClick={() => draft.collapseTopLevelFormEntries()}
//                   label='Collapse top level entries'
//                />
//                <MenuItem
//                   icon='mdiArrowExpandVertical'
//                   onClick={() => draft.expandTopLevelFormEntries()}
//                   label='Expand top level entries'
//                />
//                <MenuDividerUI_ />
//                {file?.liteGraphJSON && (
//                   <MenuItem
//                      onClick={() => cushy.layout.open('ComfyUI', { litegraphJson: file.liteGraphJSON })}
//                      label='Open in ComfyUI'
//                   />
//                )}
//                <MenuDividerUI_ />
//                <MenuItem //
//                   onClick={() => (cushy.preferedFormLayout = 'auto')}
//                   active={layout == 'auto'}
//                   icon='mdiArrowExpandAll'
//                   label='Auto Layout'
//                   beforeShortcut={<BadgeUI autoHue>recommended</BadgeUI>}
//                />

//                <MenuItem
//                   onClick={() => (cushy.preferedFormLayout = 'dense')}
//                   active={layout == 'dense'}
//                   icon='mdiImageSizeSelectSmall'
//                   label='Dense Layout'
//                />
//                <MenuItem
//                   onClick={() => (cushy.preferedFormLayout = 'mobile')}
//                   active={layout == 'mobile'}
//                   icon='mdiImageSizeSelectLarge'
//                   label='Expanded Layout'
//                />
//                <MenuDividerUI_ />
//                <MenuItem
//                   onClick={() =>
//                      cushy.setConfigValue('draft.mockup-mobile', !cushy.getConfigValue('draft.mockup-mobile'))
//                   }
//                   active={cushy.isConfigValueEq('draft.mockup-mobile', true)}
//                   icon='mdiCellphone'
//                   label='Mobile'
//                />
//             </>
//          )}
//       />
//    )
// })
