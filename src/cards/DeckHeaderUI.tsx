import type { Deck } from './Deck'
import { observer } from 'mobx-react-lite'
import { ActionPackStatusUI } from './DeckStatusUI'
import { ActionPackStarsUI } from './DeckStarsUI'
import { FolderKind } from 'src/front/updater'
import { Message } from 'rsuite'
import { stringifyUnknown } from 'src/utils/stringifyUnknown'
import { ManifestError } from './DeckManifest'

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
                    <div tw='w-3'></div>
                    <div tw='mr-3'>
                        {deck.BUILT_IN ? <div tw='text-gray-600'>built-in</div> : <ActionPackStatusUI pack={deck} />}
                        {deck.updater.status === FolderKind.FolderWithGit ? ( //
                            <ActionPackStarsUI tw='float-right' pack={deck} />
                        ) : null}
                    </div>
                </div>
                <DeckManifestErrorUI err={deck.manifestError} />
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
