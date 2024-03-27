// import type { Package } from '../../cards/Pkg'

// import { observer } from 'mobx-react-lite'
// import { stringifyUnknown } from '../../utils/formatters/stringifyUnknown'
// import { ManifestError } from '../../cards/DeckManifest'
// import { RevealUI } from '../../rsuite/RevealUI'
// import { exhaust } from '../../utils/misc/ComfyUtils'
// // import { ActionPackStatusUI } from '../../cards/DeckStatusUI'
// import { PkgHeaderStyle } from './AppListStyles'

// export const PkgHeaderUI = observer(function ActionPackHeaderUI_(p: { pkg: Package }) {
//     const pkg = p.pkg
//     return (
//         <>
//             <div
//                 tw={[
//                     //
//                     PkgHeaderStyle,
//                     'cursor-pointer flex gap-1 pb-0.5 border-t border-t-base-300',
//                 ]}
//                 onClick={() => (pkg.folded = !pkg.folded)}
//             >
//                 <RevealUI tw='shrink-0  '>
//                     <img //
//                         style={{ height: `2rem` }}
//                         src={pkg.logo}
//                         alt='logo'
//                     />
//                     <div>🔴</div>
//                     {/* <div tw='flex flex-col'>
//                         {pkg.esbuildEntrypoints.map((e) => (
//                             <div key={e}>{e}</div>
//                         ))}
//                     </div> */}
//                 </RevealUI>

//                 <div tw='flex flex-grow items-center'>
//                     <div tw='flex-grow whitespace-nowrap overflow-hidden overflow-ellipsis'>{pkg.name}</div>
//                     {pkg.manifestError && (
//                         <RevealUI tw='shrink-0'>
//                             <div className='btn btn-sm btn-narrow text-base-content'>
//                                 <span className='material-symbols-outlined opacity-50'>error</span>
//                             </div>
//                             <PkgManifestErrorUI err={pkg.manifestError} />
//                         </RevealUI>
//                     )}
//                     {/* <ActionPackStatusUI tw='shrink-0' pack={pkg} /> */}
//                 </div>
//                 {/* FOLD INDICATOR */}
//                 <label className='swap swap-rotate'>
//                     <input
//                         type='checkbox'
//                         checked={pkg.folded}
//                         onChange={(ev) => {
//                             pkg.folded = !ev.target.checked
//                         }}
//                     />
//                     <span className='material-symbols-outlined swap-on'>keyboard_arrow_right</span>
//                     <span className='material-symbols-outlined swap-off'>keyboard_arrow_down</span>
//                 </label>
//             </div>
//         </>
//     )
// })

// export const PkgManifestErrorUI = observer(function PkgManifestErrorUI_(p: { err: Maybe<ManifestError> }) {
//     const err = p.err
//     if (err == null) return null
//     if (err.type === 'crash')
//         return (
//             <div tw='p-2 bg-error text-error-content'>
//                 <div>crash</div>
//                 <pre>{stringifyUnknown(err)}</pre>
//             </div>
//         )
//     if (err.type === 'no manifest')
//         return (
//             <div tw='p-2 bg-error text-error-content [width:fit-content]'>
//                 <div>manifest missing</div>
//                 {/* <pre>{stringifyUnknown(err)}</pre> */}
//             </div>
//         )

//     if (err.type === 'invalid manifest')
//         return (
//             <div tw='p-2 bg-error text-error-content [width:fit-content] '>
//                 <div>INVALID manifest</div>
//                 <ul>
//                     {err.errors.map((e, ix) => (
//                         <li key={ix}>
//                             {e.message} at '{e.path}'
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         )

//     exhaust(err)
//     return <div>❌ error</div>
// })
