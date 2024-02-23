import { observer } from 'mobx-react-lite'

import { Button } from 'src/rsuite/shims'
import { useSt } from 'src/state/stateContext'

// import { ActionPackStarsUI } from '../cards/DeckStarsUI'

export const Panel_Marketplace = observer(function Panel_Marketplace_(p: {}) {
    const st = useSt()
    return (
        <div>
            <div tw='p-2'>
                <Button onClick={() => {}} appearance='ghost' color='green' tw='w-full self-start'>
                    Create action
                </Button>
            </div>
            {/* {st.library.decks.map((pkg) => (
                <ErrorBoundary key={pkg.github} FallbackComponent={ErrorBoundaryFallback}>
                    <ActionPackUI key={pkg.github} pkg={pkg} />
                </ErrorBoundary>
            ))} */}
        </div>
    )
})

// export const ActionPackUI = observer(function ActionPackUI_(p: { pkg: Package }) {
//     const pkg = p.pkg
//     return (
//         <div tw='cursor-pointer hover:bg-gray-700 p-2' key={pkg.name} style={{ borderBottom: '1px solid #515151' }}>
//             <div tw='flex  gap-2'>
//                 <div tw='flex-grow'>
//                     <div tw='text-lg font-bold'>{pkg.name}</div>
//                     {/* <GithubUserUI size='1.5rem' username={pkg.githubUserName} showName /> */}
//                     <div tw='text-neutral-content'>{pkg.description}</div>
//                 </div>
//                 {/* {pack.isBuiltIn ? null : <ActionPackStarsUI pack={pack} />} */}
//             </div>
//             {/* <ActionPackStatusUI pack={pkg} /> */}
//             {pkg.installK.logs.length > 0 && (
//                 <div>
//                     <pre>{JSON.stringify(pkg.installK.logs)}</pre>
//                 </div>
//             )}
//         </div>
//     )
// })
