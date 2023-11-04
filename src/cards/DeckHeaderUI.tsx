import type { Deck } from './Deck'
import { observer } from 'mobx-react-lite'
import { ActionPackStatusUI } from './DeckStatusUI'
import { ActionPackStarsUI } from './DeckStarsUI'
import { FolderKind } from 'src/front/updater'

export const DeckHeaderUI = observer(function ActionPackHeaderUI_(p: { deck: Deck }) {
    const deck = p.deck
    return (
        <div
            style={{ borderTop: '1px solid #1d1d1d' }}
            tw='cursor-pointer flex items-center gap-1 hover:bg-gray-800 p-0.5'
            onClick={() => (deck.folded = !deck.folded)}
        >
            <img tw='rounded' style={{ height: `2rem` }} src={deck.logo} alt='pack logo' />
            <div tw='flex-grow'>
                <div tw='flex'>
                    <div>
                        <div tw='font-bold text-sm'>{deck.name}</div>
                        <div tw='text-xs text-gray-400 flex justify-between w-full'>{deck.githubUserName}</div>
                    </div>
                    <div className='flex-grow'></div>
                    <div>
                        {deck.BUILT_IN ? <div tw='text-gray-600'>built-in</div> : <ActionPackStatusUI pack={deck} />}
                        {deck.updater.status === FolderKind.FolderWithGit ? ( //
                            <ActionPackStarsUI tw='float-right' pack={deck} />
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    )
})
