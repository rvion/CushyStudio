import { observer } from 'mobx-react-lite'

import { KEYS } from '../app/shortcuts/shorcutKeys'
import { AppIllustrationUI } from '../cards/fancycard/AppIllustrationUI'
import { DraftIllustrationUI } from '../cards/fancycard/DraftIllustration'
import { Dropdown } from '../csuite/dropdown/Dropdown'
import { MenuDivider, MenuItem } from '../csuite/dropdown/MenuItem'
import { useSt } from '../state/stateContext'
import { _formatAsRelativeDateTime } from '../updater/_getRelativeTimeString'

export const MenuAppsUI = observer(function MenuAppsUI_(p: {}) {
    const st = useSt()
    return (
        <Dropdown
            title='Apps'
            content={() => (
                <>
                    <MenuItem
                        onClick={() => st.layout.FOCUS_OR_CREATE('Marketplace', {}, 'RIGHT_PANE_TABSET')}
                        icon={<span className='material-symbols-outlined'>cloud_download</span>}
                        shortcut={KEYS.openPage_Marketplace}
                        label='Civitai'
                    />
                    <MenuDivider>Recently Used Drafts</MenuDivider>
                    <RecentDrafMenuEntriesUI />
                    <MenuDivider>Recently Used Apps</MenuDivider>
                    <RecentAppMenuEntriesUI />
                </>
            )}
        />
    )
})

export const RecentDrafMenuEntriesUI = observer(function RecentDrafMenuEntriesUI_(p: {}) {
    return (
        <>
            {cushy.db.draft
                .select((t) => t.orderBy('lastRunAt', 'desc').limit(10))
                .map((draft) => (
                    <MenuItem
                        key={draft.id}
                        onClick={() => draft.openOrFocusTab()}
                        icon={<DraftIllustrationUI draft={draft} size='2rem' />}
                        // label={draft.name}
                    >
                        <div tw='text' style={{ lineHeight: '1rem' }}>
                            <div>{draft.name}</div>
                            <div tw='italic text-sm text-gray-500 flex gap-1'>
                                <AppIllustrationUI app={draft.app} size='1rem' /> {draft.app.name}
                            </div>
                        </div>
                        <div tw='ml-auto text-xs italic text-gray-500'>{_formatAsRelativeDateTime(draft.data.lastRunAt)}</div>
                    </MenuItem>
                ))}
        </>
    )
})

export const RecentAppMenuEntriesUI = observer(function RecentAppMenuEntriesUI_(p: {}) {
    return (
        <>
            {cushy.db.cushy_app
                .select((t) => t.orderBy('lastRunAt', 'desc').limit(5))
                .map((app) => (
                    <MenuItem
                        onClick={() => app.openLastOrCreateDraft()}
                        icon={<AppIllustrationUI app={app} size='1.5rem' />}
                        // label={app.name}
                    >
                        <div tw='flex items-center'>{app.name}</div>
                        <div tw='ml-auto text-xs italic text-gray-500'>{_formatAsRelativeDateTime(app.data.lastRunAt)}</div>
                    </MenuItem>
                ))}
        </>
    )
})
