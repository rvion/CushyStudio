import type { DraftL } from '../../models/Draft'

import { observer } from 'mobx-react-lite'

import { Dropdown } from '../../csuite/dropdown/Dropdown'
import { MenuDividerUI_ } from '../../csuite/dropdown/MenuDividerUI'
import { MenuItem } from '../../csuite/dropdown/MenuItem'
import { Ikon } from '../../csuite/icons/iconHelpers'
import { useSt } from '../../state/stateContext'

export const DraftMenuLooksUI = observer(function DraftMenuLookUI_(p: { title: string; draft: DraftL; className?: string }) {
    const st = useSt()
    const draft = p.draft
    const file = draft.file
    const layout = st.preferedFormLayout
    return (
        <Dropdown
            className={p.className}
            // startIcon={<span className='material-symbols-outlined'>looks</span>}
            title={'View'} //`${layout}`}
            content={() => (
                <>
                    <MenuItem icon='mdiArrowCollapseVertical' onClick={() => draft.collapseTopLevelFormEntries()}>
                        <Ikon.mdiArrowCollapseVertical />
                        Collapse top level entries
                    </MenuItem>
                    <MenuItem icon='mdiArrowExpandVertical' onClick={() => draft.expandTopLevelFormEntries()}>
                        Expand top level entries
                    </MenuItem>
                    <MenuDividerUI_ />
                    {file?.liteGraphJSON && (
                        <MenuItem onClick={() => st.layout.FOCUS_OR_CREATE('ComfyUI', { litegraphJson: file.liteGraphJSON })}>
                            Open in ComfyUI
                        </MenuItem>
                    )}
                    <MenuDividerUI_ />
                    <MenuItem
                        // icon={<span className='material-symbols-outlined'>open_with</span>}
                        onClick={() => (st.preferedFormLayout = 'auto')}
                        active={layout == 'auto'}
                    >
                        <Ikon.mdiArrowExpandAll />
                        Auto Layout
                        <div tw='badge badge-neutral'>recommended</div>
                    </MenuItem>
                    <MenuItem
                        // icon={<span className='material-symbols-outlined'>photo_size_select_small</span>}
                        onClick={() => (st.preferedFormLayout = 'dense')}
                        active={layout == 'dense'}
                    >
                        <Ikon.mdiImageSizeSelectSmall />
                        Dense Layout
                    </MenuItem>
                    <MenuItem
                        // icon={<span className='material-symbols-outlined'>panorama_wide_angle</span>}
                        onClick={() => (st.preferedFormLayout = 'mobile')}
                        active={layout == 'mobile'}
                    >
                        <Ikon.mdiImageSizeSelectLarge />
                        Expanded Layout
                    </MenuItem>
                    <MenuDividerUI_ />
                    <MenuItem
                        // icon={<span className='material-symbols-outlined'>mobile_screen_share</span>}
                        onClick={() => st.setConfigValue('draft.mockup-mobile', !st.getConfigValue('draft.mockup-mobile'))}
                        active={st.isConfigValueEq('draft.mockup-mobile', true)}
                    >
                        <Ikon.mdiCellphone />
                        Mobile
                    </MenuItem>
                </>
            )}
        />
    )
})
