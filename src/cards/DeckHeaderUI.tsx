import type { Deck } from './Deck'

import { observer } from 'mobx-react-lite'
import { Popover, Whisper } from 'rsuite'
import { FolderKind } from 'src/cards/updater'
import { stringifyUnknown } from 'src/utils/formatters/stringifyUnknown'
import { ManifestError } from './DeckManifest'
import { ActionPackStarsUI } from './DeckStarsUI'
import { ActionPackStatusUI } from './DeckStatusUI'

export const DeckHeaderUI = observer(function ActionPackHeaderUI_(p: { deck: Deck }) {
    const deck = p.deck
    return (
        <>
            <div
                style={{ borderTop: '1px solid #1d1d1d' }}
                tw='cursor-pointer flex gap-1 hover:bg-gray-800 bg-gray-800 p-0.5'
                onClick={() => (deck.folded = !deck.folded)}
            >
                <img //
                    style={{ height: `2rem` }}
                    src={deck.logo}
                    alt='logo'
                />

                <div tw='flex flex-grow'>
                    <div tw='flex-grow'>
                        {/* manifest */}
                        <div>
                            <div tw='flex gap-2 items-baseline'>
                                <div tw='font-bold'>{deck.name}</div>
                                {/* by <div tw='text-gray-400 flex justify-between w-full'>{deck.githubUserName}</div> */}
                            </div>
                        </div>
                        {/* <GithubUserUI prefix='by' size='1rem' showName username={deck.githubUserName} /> */}
                        {/* <div className='flex-grow self-start italic text-gray-500'>
                            {deck.description}
                        </div> */}
                    </div>
                    {/* manifest */}
                    <div>
                        <div className='flex gap-1'>
                            {deck.manifestError && (
                                <Whisper
                                    speaker={
                                        <Popover>
                                            <DeckManifestErrorUI err={deck.manifestError} />
                                        </Popover>
                                    }
                                >
                                    <span className='text-red-500 material-symbols-outlined'>error</span>
                                </Whisper>
                            )}
                            <ActionPackStatusUI pack={deck} />
                        </div>
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
        </>
    )
})

export const DeckManifestErrorUI = observer(function DeckManifestErrorUI_(p: { err: Maybe<ManifestError> }) {
    const err = p.err
    if (err == null) return null
    if (err.type === 'crash')
        return (
            <div tw='text-red-500'>
                <div>crash</div>
                <pre>{stringifyUnknown(err)}</pre>
            </div>
        )
    if (err.type === 'no manifest')
        return (
            <div tw='text-red-500 [width:fit-content]'>
                <div>manifest missing</div>
                {/* <pre>{stringifyUnknown(err)}</pre> */}
            </div>
        )

    if (err.type === 'invalid manifest')
        return (
            <div tw='[width:fit-content] text-red-500'>
                <div>INVALID manifest</div>
                <ul>
                    {err.errors.map((e, ix) => (
                        <li key={ix}>
                            {e.message} at '{e.path}'
                        </li>
                    ))}
                </ul>
            </div>
        )

    exhaust(err)
    return <div>❌ error</div>
})
