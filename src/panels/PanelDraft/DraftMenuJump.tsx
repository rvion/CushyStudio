import type { CushyAppL } from '../../models/CushyApp'
import type { DraftL } from '../../models/Draft'

import { observer } from 'mobx-react-lite'

import { Button } from '../../csuite/button/Button'
import { Dropdown } from '../../csuite/dropdown/Dropdown'
import { MenuItem } from '../../csuite/dropdown/MenuItem'
import { Frame } from '../../csuite/frame/Frame'
import { InputStringUI } from '../../csuite/input-string/InputStringUI'
import { _formatAsRelativeDateTime } from '../../updater/_getRelativeTimeString'

/* TODO(bird_d): In the future it might be good to define a plethora of datablock types and just have a DataBlockTemplateUI and feed it the type/data for a consistent look throughout the program. */
export const DraftMenuDataBlockUI = observer(function DraftMenuDataBlockUI_(p: {
    //
    title: string
    draft: DraftL
    className?: string
}) {
    return (
        <Frame line>
            <InputStringUI //
                getValue={() => p.draft.name}
                setValue={(val) => p.draft.update({ title: val })}
            />
            <Dropdown
                className={p.className}
                startIcon='mdiPencilBox'
                title={false}
                content={() => <DraftListUI app={p.draft.app} />}
                button={<Button tw='!gap-0 !px-0.5' icon='mdiPencilBox' suffixIcon={'mdiChevronDown'} />}
            />
        </Frame>
    )
})

const DraftListUI = observer(function DraftListUI_(p: { app: CushyAppL }) {
    return (
        <div>
            {p.app.lastExecutedDrafts.map(({ id, title, lastRunAt }) => {
                return (
                    <MenuItem
                        key={id}
                        onClick={() => {
                            const draft = cushy.db.draft.getOrThrow(id)
                            draft.openOrFocusTab()
                        }}
                    >
                        <div tw='flex items-center'>{title ?? id}</div>
                        <div tw='ml-auto text-xs italic text-gray-500'>{_formatAsRelativeDateTime(lastRunAt)}</div>
                    </MenuItem>
                )
            })}
        </div>
    )
})
