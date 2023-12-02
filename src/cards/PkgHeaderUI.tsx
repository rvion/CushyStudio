import type { Package } from './Pkg'

import { observer } from 'mobx-react-lite'
import { stringifyUnknown } from 'src/utils/formatters/stringifyUnknown'
import { ManifestError } from './DeckManifest'
import { RevealUI } from 'src/rsuite/RevealUI'
import { exhaust } from 'src/utils/misc/ComfyUtils'
import { ActionPackStatusUI } from './DeckStatusUI'
import { PkgHeaderStyle } from './AppListStyles'

export const PkgHeaderUI = observer(function ActionPackHeaderUI_(p: { pkg: Package }) {
    const pkg = p.pkg
    return (
        <>
            <div
                tw={[
                    //
                    PkgHeaderStyle,
                    'cursor-pointer flex gap-1 pb-0.5 border-t border-t-base-300',
                ]}
                onClick={() => (pkg.folded = !pkg.folded)}
            >
                <img //
                    style={{ height: `2rem` }}
                    src={pkg.logo}
                    alt='logo'
                />

                <div tw='flex flex-grow items-center'>
                    <div tw='flex-grow whitespace-nowrap overflow-hidden overflow-ellipsis'>{pkg.name}</div>
                    {pkg.manifestError && !p.pkg.isBuiltIn && (
                        <RevealUI tw='shrink-0'>
                            <div className='btn btn-sm btn-narrow text-base-content'>
                                <span className='material-symbols-outlined opacity-50'>error</span>
                            </div>
                            <PkgManifestErrorUI err={pkg.manifestError} />
                        </RevealUI>
                    )}
                    <ActionPackStatusUI tw='shrink-0' pack={pkg} />
                </div>
            </div>
        </>
    )
})

export const PkgManifestErrorUI = observer(function PkgManifestErrorUI_(p: { err: Maybe<ManifestError> }) {
    const err = p.err
    if (err == null) return null
    if (err.type === 'crash')
        return (
            <div tw='p-2 bg-error text-error-content'>
                <div>crash</div>
                <pre>{stringifyUnknown(err)}</pre>
            </div>
        )
    if (err.type === 'no manifest')
        return (
            <div tw='p-2 bg-error text-error-content [width:fit-content]'>
                <div>manifest missing</div>
                {/* <pre>{stringifyUnknown(err)}</pre> */}
            </div>
        )

    if (err.type === 'invalid manifest')
        return (
            <div tw='p-2 bg-error text-error-content [width:fit-content] '>
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
