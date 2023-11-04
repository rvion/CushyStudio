import type { Deck } from './Deck'
import { observer } from 'mobx-react-lite'
import { ActionPackStatusUI } from './DeckStatusUI'
import { ActionPackStarsUI } from './DeckStarsUI'
import { FolderKind } from 'src/front/updater'
import { Message } from 'rsuite'

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
                <div tw='flex items-center'>
                    {/* manifest */}
                    <div>
                        <div tw='font-bold'>{deck.name}</div>
                        <div tw='text-gray-400 flex justify-between w-full'>{deck.githubUserName}</div>
                    </div>
                    <div className='flex-grow self-start italic'>{deck.description}</div>
                    {/* manifest */}
                    <Message showIcon type={deck.manifestType === 'implicit' ? 'error' : 'success'}>
                        {deck.manifestType === 'implicit' ? 'No Manifest found' : 'Manifest found'}
                    </Message>
                    <div tw='w-3'></div>
                    <div tw='mr-3'>
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
