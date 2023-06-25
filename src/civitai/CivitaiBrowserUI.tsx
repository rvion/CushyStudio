// import { observer } from 'mobx-react-lite'
// import { useMemo } from 'react'
// import { Image } from '../front/ui/Image'
// import { Text } from '../front/ui/Text'
// import { useSt } from '../front/ui/WorkspaceContext'
// import { Civitai } from './CivitaiSpec'
// import { Panel } from 'rsuite'

// export const CivitaiUI = observer(function CivitaiUI_() {
//     const c = useMemo(() => new Civitai(), [])
//     const x = useSt()
//     return (
//         <Panel>
//             <Text size={300}>Civitai</Text>

//             <div className='row gap'>
//                 <F
//                     // contentBefore={<I.Search24Filled />}
//                     placeholder='rechercher'
//                     value={c.query}
//                     onChange={(ev) => (c.query = (ev.target as any).value)}
//                     // onChange={(ev: React.ChangeEventHandler<HTMLInputElement>) => (c.query = ev.target.value)}
//                 ></F>
//                 <VSCodeButton
//                     // icon={<I.Search24Filled />}
//                     onClick={async () => {
//                         const res = await c.search({ query: c.query, page: '1' })
//                         console.log(res)
//                     }}
//                 ></VSCodeButton>
//             </div>
//             {c.results && (
//                 <div
//                     style={{
//                         height: '40rem',
//                         // display: 'flex',
//                         overflow: 'auto',
//                     }}
//                 >
//                     {c.results.items.map((i) => {
//                         const v0 = i.modelVersions[0]
//                         const v0Imgs = v0.images
//                         const img0 = v0Imgs[0]
//                         return (
//                             <VSCodePanelView>
//                                 {/* <CardHeader>{i.name}</CardHeader> */}
//                                 <div>{i.name}</div>
//                                 {/* <div>{i.id}</div> */}
//                                 <div>{i.modelVersions.length} version</div>
//                                 {/* <CardPreview> */}
//                                 <Image key={img0.url} height={100} width={100} src={img0.url} />
//                                 {/* </CardPreview> */}
//                             </VSCodePanelView>
//                         )
//                     })}
//                 </div>
//             )}
//         </Panel>
//     )
// })

// // const x = <Panel>
// //     <CardHeader>{i.name}</CardHeader>
// //     <CardPreview>
// //     {/* {i.modelVersions[0].images.map(i => <Image width={200} fit='contain' src={i.url}/>)} */}
// //     </CardPreview >
// //     </Panel>
// // </Panel>
