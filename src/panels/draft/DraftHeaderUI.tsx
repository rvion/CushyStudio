import type { DraftL } from '../../models/Draft'

import { observer } from 'mobx-react-lite'

import { DraftIllustrationUI } from '../../cards/fancycard/DraftIllustration'
import { Button } from '../../csuite/button/Button'
import { Frame } from '../../csuite/frame/Frame'
import { DraftMenuActionsUI } from './DraftMenuActionsUI'
import { DraftMenuJumpUI } from './DraftMenuJump'
import { DraftMenuLooksUI } from './DraftMenuLooksUI'
import { PublishAppBtnUI } from './PublishAppBtnUI'
import { RunOrAutorunUI } from './RunOrAutorunUI'

export const DraftHeaderUI = observer(function DraftHeaderUI_(p: {
    //
    draft: DraftL
    className?: string
}) {
    const { draft } = p
    const app = draft.appRef.item
    return (
        <Frame
            style={{ zIndex: 99 /*boxShadow: '0 0 0.5rem oklch(var(--p)/.3)'*/ }}
            className={p.className}
            tw='_DraftHeaderUI flex sticky top-0 z-50'
        >
            <div tw='flex gap-1 mt-1 flex-grow relative'>
                <DraftIllustrationUI revealAppIllustrationOnHover draft={draft} size='7.3rem' />
                <div tw='flex flex-col gap-1 flex-grow'>
                    <div tw='flex text-sm gap-1'>
                        <span tw='font-bold'>{app.name}</span>
                    </div>
                    <div className='flex items-center gap-2 justify-between'>
                        <input
                            tw='cushy-basic-input flex-grow'
                            onChange={(ev) => draft.update({ title: ev.target.value })}
                            value={draft.data.title ?? 'no title'}
                        />
                    </div>
                    <RunOrAutorunUI tw='flex-shrink-0' draft={draft} />
                    <div tw='flex gap-0.5'>
                        <DraftMenuActionsUI draft={draft} title={'Actions' /* app.name */} />
                        <DraftMenuJumpUI draft={draft} title='Drafts' />
                        {/* --------------------------------- */}
                        <div tw='flex-grow'></div>
                        <PublishAppBtnUI app={app} />
                        <DraftMenuLooksUI draft={draft} title={app.name} />
                        {/* --------------------------------- */}
                        <Button
                            subtle
                            square
                            size='input'
                            icon='mdiUnfoldMoreHorizontal'
                            onClick={draft.expandTopLevelFormEntries}
                        />
                        <Button
                            subtle
                            square
                            size='input'
                            icon='mdiUnfoldLessHorizontal'
                            onClick={draft.collapseTopLevelFormEntries}
                        />
                    </div>
                </div>
            </div>
        </Frame>
    )
})
