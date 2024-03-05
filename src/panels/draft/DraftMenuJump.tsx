import type { DraftL } from 'src/models/Draft'

import { observer } from 'mobx-react-lite'

import { Dropdown, MenuItem } from 'src/rsuite/Dropdown'

export const DraftMenuJumpUI = observer(function DraftMenuJumpUI_(p: {
    //
    title: string
    draft: DraftL
    className?: string
}) {
    const draft = p.draft
    const app = draft.app
    return (
        <Dropdown
            //
            className={p.className}
            startIcon={<span className='material-symbols-outlined'>menu</span>}
            title={'Drafts'} //`${layout}`}
        >
            <div tw='divider my-0'></div>
            {/* 🔴 PERF: TODO: make that lazyly instanciated. */}
            {app.drafts.map((d) => (
                <MenuItem key={d.id} onClick={() => d.openOrFocusTab()}>
                    {d.name}
                </MenuItem>
            ))}
        </Dropdown>
    )
})
