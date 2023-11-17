import type { Deck } from './Deck'

import { observer } from 'mobx-react-lite'
import { Popover, Whisper } from 'src/rsuite/shims'
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
                tw='cursor-pointer flex gap-1 hover:bg-base-300 bg-base-200 p-0.5 border-t border-t-base-300'
                onClick={() => (deck.folded = !deck.folded)}
            >
                <img //
                    style={{ height: `2rem` }}
                    src={deck.logo}
                    alt='logo'
                />

                <div tw='flex flex-grow'>
                    <div tw='flex-grow'>
                        <div tw='text-base-content font-bold'>{deck.name}</div>
                    </div>
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
                                    <span className='text-error-content material-symbols-outlined'>error</span>
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
            <div tw='text-error-content'>
                <div>crash</div>
                <pre>{stringifyUnknown(err)}</pre>
            </div>
        )
    if (err.type === 'no manifest')
        return (
            <div tw='text-error-content [width:fit-content]'>
                <div>manifest missing</div>
                {/* <pre>{stringifyUnknown(err)}</pre> */}
            </div>
        )

    if (err.type === 'invalid manifest')
        return (
            <div tw='[width:fit-content] text-error-content'>
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
