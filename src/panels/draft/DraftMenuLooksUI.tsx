import type { DraftL } from 'src/models/Draft'

import { observer } from 'mobx-react-lite'

import { Dropdown, MenuItem } from 'src/rsuite/Dropdown'
import { useSt } from 'src/state/stateContext'

export const DraftMenuLooksUI = observer(function DraftMenuLookUI_(p: { title: string; draft: DraftL; className?: string }) {
    const st = useSt()
    const draft = p.draft
    const file = draft.file
    const layout = st.preferedFormLayout
    const app = draft.app
    return (
        <Dropdown
            className={p.className}
            // startIcon={<span className='material-symbols-outlined'>looks</span>}
            title={'UI'} //`${layout}`}
        >
            {/* <div tw='divider my-0'>UI</div> */}
            <MenuItem
                onClick={draft.collapseTopLevelFormEntries}
                icon={<span className='material-symbols-outlined'>unfold_less</span>}
            >
                Collapse top level entries
            </MenuItem>
            <MenuItem
                onClick={draft.expandTopLevelFormEntries}
                icon={<span className='material-symbols-outlined'>unfold_more</span>}
            >
                Expand top level entries
            </MenuItem>
            <div tw='divider my-0' />
            {file?.liteGraphJSON && (
                <MenuItem onClick={() => st.layout.FOCUS_OR_CREATE('ComfyUI', { litegraphJson: file.liteGraphJSON })}>
                    Open in ComfyUI
                </MenuItem>
            )}
            <div tw='divider my-0' />
            <MenuItem
                icon={<span className='material-symbols-outlined'>open_with</span>}
                onClick={() => (st.preferedFormLayout = 'auto')}
                active={layout == 'auto'}
            >
                Auto Layout
                <div tw='badge badge-neutral'>recommended</div>
            </MenuItem>
            <MenuItem
                icon={<span className='material-symbols-outlined'>photo_size_select_small</span>}
                onClick={() => (st.preferedFormLayout = 'dense')}
                active={layout == 'dense'}
            >
                Dense Layout
            </MenuItem>
            <MenuItem
                icon={<span className='material-symbols-outlined'>panorama_wide_angle</span>}
                onClick={() => (st.preferedFormLayout = 'mobile')}
                active={layout == 'mobile'}
            >
                Expanded Layout
            </MenuItem>
            <div tw='divider my-0' />
            <MenuItem
                icon={<span className='material-symbols-outlined'>mobile_screen_share</span>}
                onClick={() => st.setConfigValue('draft.mockup-mobile', !st.getConfigValue('draft.mockup-mobile'))}
                active={st.isConfigValueEq('draft.mockup-mobile', true)}
            >
                Mobile
            </MenuItem>
        </Dropdown>
    )
})
