import type { DraftL } from 'src/models/Draft'

import { observer } from 'mobx-react-lite'

import { showItemInFolder } from 'src/app/layout/openExternal'
import { KEYS } from 'src/app/shortcuts/shorcutKeys'
import { Dropdown, MenuItem } from 'src/rsuite/Dropdown'
import { Loader } from 'src/rsuite/shims'
import { useSt } from 'src/state/stateContext'
import { openInVSCode } from 'src/utils/electron/openInVsCode'

export const DraftMenuActionsUI = observer(function DraftMenuActionsUI_(p: {
    //
    title: string
    draft: DraftL
    className?: string
}) {
    const st = useSt()
    const draft = p.draft
    const file = draft.file
    const app = draft.app
    return (
        <Dropdown
            //
            className={p.className}
            startIcon={<span className='material-symbols-outlined'>menu</span>}
            title={'Actions'} //`${layout}`}
        >
            <div tw='divider my-0'></div>
            <MenuItem
                // active={app.isFavorite}
                onClick={() => app.setFavorite(!app.isFavorite)}
                icon={
                    <span tw={[app.isFavorite ? 'text-yellow-500' : null]} className='material-symbols-outlined'>
                        star
                    </span>
                }
            >
                Favorite App
            </MenuItem>
            <MenuItem
                // active={draft.isFavorite}
                onClick={() => draft.setFavorite(!draft.isFavorite)}
                icon={
                    <span tw={[draft.isFavorite ? 'text-yellow-500' : null]} className='material-symbols-outlined'>
                        star
                    </span>
                }
            >
                Favorite Draft
            </MenuItem>
            <div tw='divider my-0'></div>
            <MenuItem
                shortcut={KEYS.duplicateCurrentDraft}
                icon={<span className='material-symbols-outlined text-green-500'>content_copy</span>}
                onClick={() => draft.duplicateAndFocus()}
            >
                Duplicate Draft
            </MenuItem>
            <MenuItem
                // shortcut={KEYS.duplicateCurrentDraft}
                icon={<span className='material-symbols-outlined text-green-500'>content_copy</span>}
                onClick={() => draft.app.createDraft()}
            >
                New empty Draft
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
            <MenuItem
                //
                onClick={() => {
                    const confirm = window.confirm('Are you sure you want to delete this draft?')
                    if (confirm) draft.delete()
                }}
                icon={<span className='material-symbols-outlined text-red-500'>delete</span>}
            >
                Delete
            </MenuItem>
            <MenuItem
                //
                onClick={() => {
                    const confirm = window.confirm('Are you sure you want to delete this draft?')
                    if (confirm) draft.update({ formSerial: {} as any })
                }}
                icon={<span className='material-symbols-outlined text-red-500'>delete</span>}
            >
                reset Form
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
        </Dropdown>
    )
})
