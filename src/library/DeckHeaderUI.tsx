import type { Deck } from './Deck'
import { observer } from 'mobx-react-lite'
import { ActionPackStatusUI } from './DeckStatusUI'
import { ActionPackStarsUI } from './DeckStarsUI'
import { FolderKind } from 'src/front/updater'

export const DeckHeaderUI = observer(function ActionPackHeaderUI_(p: { pack: Deck }) {
    const pack = p.pack
    return (
        <div
            tw='cursor-pointer flex items-center gap-1 bg-gray-800 hover:bg-gray-800 p-0.5'
            onClick={() => (pack.folded = !pack.folded)}
        >
            <img tw='rounded' style={{ height: `2rem` }} src={pack.logo} alt='pack logo' />
            <div tw='flex-grow'>
                <div tw='flex'>
                    <div>
                        <div tw='font-bold text-sm'>{pack.name}</div>
                        <div tw='text-sm text-gray-400 flex justify-between w-full'>by {pack.githubUserName}</div>
                    </div>
                    <div className='flex-grow'></div>
                    <div>
                        {pack.BUILT_IN ? <div tw='text-gray-600'>built-in</div> : <ActionPackStatusUI pack={pack} />}
                        {pack.updater.status === FolderKind.FolderWithGit ? ( //
                            <ActionPackStarsUI tw='float-right' pack={pack} />
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    )
})
