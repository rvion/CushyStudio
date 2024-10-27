import type { NO_PROPS } from '../../csuite/types/NO_PROPS'

import { observer } from 'mobx-react-lite'

import { Button } from '../../csuite/button/Button'
import { Panel, type PanelHeader } from '../../router/Panel'
import { useSt } from '../../state/stateContext'
import { CreateAppBtnUI } from '../PanelWelcome/CreateAppBtnUI'

export const PanelMarketplace = new Panel({
   name: 'Marketplace',
   widget: (): React.FC<NO_PROPS> => PanelMarketplaceUI,
   header: (p): PanelHeader => ({ title: 'Marketplace' }),
   def: (): NO_PROPS => ({}),
   icon: 'mdiCubeScan',
   category: 'app',
})

export const PanelMarketplaceUI = observer(function PanelMarketplaceUI_(p: NO_PROPS) {
   const st = useSt()
   // const form = useMemo(
   //         CushyRepository.form(
   //             (ui) => ({
   //                 query: ui.string(),
   //                 installed: ui.bool(),
   //             }),
   //             { name: 'marketplace-form' },
   //         ),
   //     [],
   // )
   const mkp = st.marketplace
   const published = mkp.publishedApps()
   const selected = mkp.selectedApp
   return (
      <div>
         <div tw='flex gap-2 p-2'>
            <input
               onChange={(e) => (mkp.query.value = e.target.value)}
               className='csuite-basic-input'
               value={mkp.query.value}
               placeholder='Search'
               type='text'
            />
            <div className='flex-1'></div>
            <CreateAppBtnUI />
            {/* <FormUI form={form} /> */}
         </div>
         <div className='flex gap-1'>
            <div tw=''>
               {published.ui((x) => (
                  <div tw='flex flex-col gap-1'>
                     {x.data?.map((d) => (
                        <Button size='sm' key={d.id}>
                           <img src='' alt='' />
                           <div>
                              <div>{d.name}</div>
                              {/* 🔴 TODO: creator profile */}
                              {/* <div>
                                            by{' '}
                                            {mkp.getUserInfoViaDB(d.user_id).ui((z) => (
                                                <RevealUI>
                                                    <div>{z?.id}</div>
                                                    <JsonViewUI value={z} />
                                                </RevealUI>
                                            ))}
                                        </div> */}
                           </div>
                        </Button>
                     ))}
                  </div>
               ))}
            </div>
            <div>
               {/* {published.ui((x) => (
                        <div>
                            {x.data?.map((d) => (
                                <div key={d.name}>{d.name}</div>
                            ))}
                        </div>
                    ))} */}
            </div>
         </div>
         🟢
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
