import type { Package } from './Deck'

import { observer } from 'mobx-react-lite'
import { Popover, Whisper } from 'src/rsuite/shims'
// import { FolderGitStatus } from './FolderGitStatus'
import { stringifyUnknown } from 'src/utils/formatters/stringifyUnknown'
import { ManifestError } from './DeckManifest'
// import { ActionPackStarsUI } from './DeckStarsUI'
import { ActionPackStatusUI } from './DeckStatusUI'
import { exhaust } from 'src/utils/misc/ComfyUtils'
import { RevealUI } from 'src/rsuite/RevealUI'

export const DeckHeaderUI = observer(function ActionPackHeaderUI_(p: { pkg: Package }) {
    const pkg = p.pkg
    return (
        <>
            <div
                tw='cursor-pointer flex gap-1 hover:bg-base-300 bg-base-200 pb-0.5 border-t border-t-base-300'
                onClick={() => (pkg.folded = !pkg.folded)}
            >
                <img //
                    style={{ height: `2rem` }}
                    src={pkg.logo}
                    alt='logo'
                />
                <div tw='flex flex-grow items-center'>
                    <div tw='text-base-content flex-grow whitespace-nowrap'>{pkg.name}</div>
                    <div>
                        <div className='flex'>
                            {pkg.manifestError && !p.pkg.isBuiltIn && (
                                <RevealUI>
                                    <div className='btn btn-sm btn-narrow text-warning-content'>
                                        <span className='material-symbols-outlined opacity-50'>error</span>
                                    </div>
                                    <DeckManifestErrorUI err={pkg.manifestError} />
                                </RevealUI>
                            )}
                            <ActionPackStatusUI pack={pkg} />
                        </div>
                        {/* {deck.updater.status === FolderGitStatus.FolderWithGit ? ( //
                            <ActionPackStarsUI tw='float-right' pack={deck} />
                        ) : null} */}
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
