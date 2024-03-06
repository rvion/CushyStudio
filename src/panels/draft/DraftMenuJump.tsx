import type { CushyAppL } from 'src/models/CushyApp'
import type { DraftL } from 'src/models/Draft'

import { observer } from 'mobx-react-lite'

import { Dropdown, MenuItem } from 'src/rsuite/Dropdown'
import { _formatAsRelativeDateTime } from 'src/updater/_getRelativeTimeString'

export const DraftMenuJumpUI = observer(function DraftMenuJumpUI_(p: {
    //
    title: string
    draft: DraftL
    className?: string
}) {
    return (
        <Dropdown
            //
            className={p.className}
            startIcon={<span className='material-symbols-outlined'>menu</span>}
            title={'Drafts'} //`${layout}`}
        >
            <DraftListUI app={p.draft.app} />
        </Dropdown>
    )
})

const DraftListUI = observer(function DraftListUI_(p: { app: CushyAppL }) {
    return (
        <div>
            {/* 🔴 PERF: TODO: make that lazyly instanciated. */}
            {p.app.drafts2.map(({ id, title, lastRunAt }) => {
                return (
                    <MenuItem
                        key={id}
                        onClick={() => {
                            const draft = cushy.db.drafts.getOrThrow(id)
                            draft.openOrFocusTab()
                        }}
                    >
                        <div tw='flex items-center'>{title ?? id}</div>
                        <div tw='ml-auto'>{_formatAsRelativeDateTime(lastRunAt)}</div>
                    </MenuItem>
                )
            })}
        </div>
    )
})
