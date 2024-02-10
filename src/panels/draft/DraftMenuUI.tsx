import type { DraftL } from 'src/models/Draft'

import { observer } from 'mobx-react-lite'

import { showItemInFolder } from 'src/app/layout/openExternal'
import { Dropdown, MenuItem } from 'src/rsuite/Dropdown'
import { Loader } from 'src/rsuite/shims'
import { useSt } from 'src/state/stateContext'
import { openInVSCode } from 'src/utils/electron/openInVsCode'
import { shortcutsDef } from 'src/app/shortcuts/shortcuts'
import { KEYS } from 'src/app/shortcuts/shorcutKeys'

export const DraftMenuUI = observer(function DraftMenuUI_(p: { title: string; draft: DraftL; className?: string }) {
    const st = useSt()
    const draft = p.draft
    const file = draft.file
    const layout = st.preferedFormLayout
    const app = draft.app
    return (
        <Dropdown
            //
            className={p.className}
            appearance='subtle'
            startIcon={<span className='material-symbols-outlined'>menu</span>}
            title={p.title} //`${layout}`}
        >
            <div tw='divider my-0'></div>
            {/* <MenuItem
                // tw='btn btn-ghost btn-square btn-sm'
                icon={<span className='material-symbols-outlined'>open_in_new</span>}
                onClick={() => {
                    st.layout.FOCUS_OR_CREATE('Draft', { draftID: draft.id }, 'LEFT_PANE_TABSET')
                }}
            >
                Open in a new tab
            </MenuItem> */}
            {/* duplicate draft btn */}
            <MenuItem
                active={app.isFavorite}
                onClick={() => app.setFavorite(!app.isFavorite)}
                icon={
                    <span tw={[app.isFavorite ? 'text-yellow-500' : null]} className='material-symbols-outlined'>
                        star
                    </span>
                }
            >
                Favorite
            </MenuItem>
            <MenuItem
                shortcut={KEYS.duplicateCurrentDraft}
                icon={<span className='material-symbols-outlined'>content_copy</span>}
                onClick={() => draft.duplicateAndFocus()}
            >
                Duplicate Draft
            </MenuItem>
            <MenuItem
                icon={<span className='material-symbols-outlined'>content_copy</span>}
                onClick={() => navigator.clipboard.writeText(draft.id)}
            >
                Copy ID ({draft.id})
            </MenuItem>
            <MenuItem
                icon={<span className='material-symbols-outlined'>edit</span>}
                onClick={() => openInVSCode(st, file?.absPath ?? '')}
            >
                Edit App Definition
            </MenuItem>
            <MenuItem
                //
                onClick={() => showItemInFolder(file.absPath)}
                icon={<span className='material-symbols-outlined'>open_in_browser</span>}
            >
                Show Item In Folder
            </MenuItem>

            <div tw='divider my-0' />
            {/* <button disabled={app.isPublishing} tw='btn btn-ghost btn-square btn-sm' onClick={async () => {}}></button> */}
            <MenuItem
                icon={app.isPublishing ? <Loader /> : <span className='material-symbols-outlined'>publish</span>}
                onClick={async () => await app.publish()}
            >
                Publish on app-store
            </MenuItem>
            <div tw='divider my-0'>Debug</div>
            <MenuItem
                icon={<span className='material-symbols-outlined'>info</span>}
                onClick={() => st.layout.FOCUS_OR_CREATE('DraftJsonResult', { draftID: draft.id })}
                size='sm'
            >
                Form result
            </MenuItem>
            <MenuItem
                icon={<span className='material-symbols-outlined'>dynamic_form</span>}
                onClick={() => st.layout.FOCUS_OR_CREATE('DraftJsonSerial', { draftID: draft.id })}
                size='sm'
            >
                Form state
            </MenuItem>
            <MenuItem
                icon={<span className='material-symbols-outlined'>code</span>}
                onClick={() => st.layout.FOCUS_OR_CREATE('Script', { scriptID: draft.app.script.id })}
                size='sm'
            >
                App code
            </MenuItem>
            <div tw='divider my-0'>UI</div>
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
