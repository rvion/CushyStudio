import type { DraftL } from '../../models/Draft'

import { observer } from 'mobx-react-lite'

import { AppIllustrationUI } from '../../cards/fancycard/AppIllustrationUI'
import { DraftIllustrationUI } from '../../cards/fancycard/DraftIllustration'

export const DraftPopupV1UI = observer(function DraftPopupV1UI_(p: { draft: DraftL }) {
    const draft = p.draft
    return (
        <div className='MENU-ROOT'>
            <div className='MENU-HEADER'>
                <div //Container
                    tw='flex bg-base-200 p-1 rounded '
                >
                    <AppIllustrationUI size='2rem' app={draft.app} />
                    <div tw='flex-1 text-xs text-center self-center p-2'>{draft.app.name}</div>
                </div>
            </div>
            <div className='MENU-CONTENT'>
                <div //Container
                    tw='flex-column bg-base-300 p-1 rounded text-center items-center'
                >
                    <div tw='text-xs'>{draft.data.title}</div>
                    <div tw='flex self-center text-center justify-center p-1'>
                        <DraftIllustrationUI size='12rem' draft={draft} />
                    </div>
                </div>
            </div>
            <div tw='max-w-lg'>{draft.form?.render()}</div>
        </div>
    )
})
