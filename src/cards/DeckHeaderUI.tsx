import type { Deck } from './Deck'
import { observer } from 'mobx-react-lite'
import { ActionPackStatusUI } from './DeckStatusUI'
import { ActionPackStarsUI } from './DeckStarsUI'
import { FolderKind } from 'src/cards/updater'
import { Message } from 'rsuite'
import { stringifyUnknown } from 'src/utils/stringifyUnknown'
import { ManifestError } from './DeckManifest'
import { GithubUserUI } from './GithubAvatarUI'

export const DeckHeaderUI = observer(function ActionPackHeaderUI_(p: { deck: Deck }) {
    const deck = p.deck
    return (
        <div
            style={{ borderTop: '1px solid #1d1d1d' }}
            tw='cursor-pointer flex gap-1 hover:bg-gray-800 p-0.5'
            onClick={() => (deck.folded = !deck.folded)}
        >
            <img //
                style={{ height: `3rem` }}
                src={deck.logo}
                alt='pack logo'
            />

            <div tw='flex flex-grow'>
                <div tw='flex-grow'>
                    {/* manifest */}
                    <div>
                        <div tw='flex gap-2 items-baseline'>
                            <h3 tw='font-bold text-purple-400'>{deck.name}</h3>
                            {/* by <div tw='text-gray-400 flex justify-between w-full'>{deck.githubUserName}</div> */}
                            <GithubUserUI prefix='by' size='1rem' showName username={deck.githubUserName} />
                        </div>
                    </div>
                    <div className='flex-grow self-start italic'>
                        <b>{deck.cards.length} cards</b> - {deck.description}
                    </div>
                </div>
                {/* manifest */}
                <div>
                    <DeckManifestErrorUI err={deck.manifestError} />
                    {deck.BUILT_IN ? <div tw='text-gray-600'>built-in</div> : <ActionPackStatusUI pack={deck} />}
                    {deck.updater.status === FolderKind.FolderWithGit ? ( //
                        <ActionPackStarsUI tw='float-right' pack={deck} />
                    ) : null}
                </div>
                {/* <Message showIcon type={deck.manifestError.}>
                    {deck.manifestType === 'implicit' ? 'No Manifest found' : 'Manifest found'}
                    <pre>{stringifyUnknown(deck.manifestError)}</pre>
                </Message> */}
            </div>
        </div>
    )
})

export const DeckManifestErrorUI = observer(function DeckManifestErrorUI_(p: { err: Maybe<ManifestError> }) {
    const err = p.err
    if (err == null) return null
    if (err.type === 'crash')
        return (
            <Message header='crash' showIcon type='error'>
                <pre>{stringifyUnknown(err)}</pre>
            </Message>
        )
    if (err.type === 'no manifest')
        return (
            <Message tw='[width:fit-content]' header='manifest missing' showIcon type='error'>
                {/* <pre>{stringifyUnknown(err)}</pre> */}
            </Message>
        )

    if (err.type === 'invalid manifest')
        return (
            <Message tw='[width:fit-content]' header='INVALID manifest' showIcon type='error'>
                <ul>
                    {err.errors.map((e, ix) => (
                        <li key={ix}>
                            {e.message} at '{e.path}'
                        </li>
                    ))}
                </ul>
            </Message>
        )

    exhaust(err)
    return <div>❌ error</div>
})
