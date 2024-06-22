import type { DraftL } from '../../models/Draft'

import { observer } from 'mobx-react-lite'

import { showItemInFolder } from '../../app/layout/openExternal'
import { KEYS } from '../../app/shortcuts/shorcutKeys'
import { Dropdown } from '../../csuite/dropdown/Dropdown'
import { MenuDividerUI_ } from '../../csuite/dropdown/MenuDividerUI'
import { MenuItem } from '../../csuite/dropdown/MenuItem'
import { Loader } from '../../csuite/inputs/shims'
import { useSt } from '../../state/stateContext'
import { openInVSCode } from '../../utils/electron/openInVsCode'

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
            className={p.className}
            startIcon='mdiMenu'
            title='Actions'
            content={() => (
                <>
                    <MenuItem
                        onClick={() => app.setFavorite(!app.isFavorite)}
                        iconClassName={app.isFavorite ? 'text-yellow-500' : undefined}
                        icon='mdiStar'
                    >
                        Favorite App
                    </MenuItem>
                    <MenuItem
                        // active={draft.isFavorite}
                        onClick={() => draft.setFavorite(!draft.isFavorite)}
                        iconClassName={draft.isFavorite ? 'text-yellow-500' : null}
                        icon='mdiStar'
                    >
                        Favorite Draft
                    </MenuItem>
                    <div tw='divider my-0'></div>
                    <MenuItem
                        localShortcut={KEYS.duplicateCurrentDraft}
                        iconClassName='text-green-500'
                        icon='mdiContentCopy'
                        onClick={() => draft.duplicateAndFocus()}
                    >
                        Duplicate Draft
                    </MenuItem>
                    <MenuItem
                        // shortcut={KEYS.duplicateCurrentDraft}
                        iconClassName={'text-green-500'}
                        icon='mdiContentCopy'
                        onClick={() => draft.app.createDraft()}
                    >
                        New empty Draft
                    </MenuItem>
                    <MenuItem icon='mdiContentCopy' onClick={() => navigator.clipboard.writeText(draft.id)}>
                        Copy ID ({draft.id})
                    </MenuItem>
                    <MenuItem icon='mdiTagEdit' onClick={() => openInVSCode(st, file?.absPath ?? '')}>
                        Edit App Definition
                    </MenuItem>
                    <MenuItem icon='mdiOpenInApp' onClick={() => showItemInFolder(file.absPath)}>
                        Show Item In Folder
                    </MenuItem>
                    <MenuItem
                        label='Delete'
                        icon='mdiDelete'
                        iconClassName=' text-red-500'
                        onClick={() => {
                            const confirm = window.confirm('Are you sure you want to delete this draft?')
                            if (confirm) draft.delete()
                        }}
                    />
                    <MenuItem
                        label='reset Form'
                        icon='mdiDelete'
                        iconClassName=' text-red-500'
                        onClick={() => {
                            const confirm = window.confirm('Are you sure you want to delete this draft?')
                            if (confirm) draft.update({ formSerial: {} as any })
                        }}
                    />

                    <MenuDividerUI_ />
                    {/* <button disabled={app.isPublishing} tw='btn btn-ghost btn-square btn-sm' onClick={async () => {}}></button> */}
                    <MenuItem
                        loading={app.isPublishing}
                        icon='mdiPublish'
                        onClick={() => app.publish()}
                        label='Publish on app-store'
                    />

                    <div tw='divider my-0'>Debug</div>
                    <MenuItem
                        icon='mdiInformation'
                        onClick={() => st.layout.FOCUS_OR_CREATE('DraftJsonResult', { draftID: draft.id })}
                        size='sm'
                    >
                        Form result
                    </MenuItem>
                    <MenuItem
                        icon='mdiForest'
                        onClick={() => st.layout.FOCUS_OR_CREATE('DraftJsonSerial', { draftID: draft.id })}
                        size='sm'
                    >
                        Form state
                    </MenuItem>
                    <MenuItem
                        icon='mdiCodeArray'
                        onClick={() => st.layout.FOCUS_OR_CREATE('Script', { scriptID: draft.app.script.id })}
                        size='sm'
                    >
                        App code
                    </MenuItem>
                </>
            )}
        />
    )
})
