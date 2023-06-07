// import { observer } from 'mobx-react-lite'
// import { useSt } from '../FrontStateCtx'
// import { ComfyNodeUI } from './NodeListUI'

// export const ShowUpdatingNodeUI = observer(function FooBarUI_(p: { msg: MessageFromExtensionToWebview }) {
//     const st = useSt()
//     // ensure it's an executing
//     const msg = p.msg
//     if (msg.type !== 'executing') return <>not an executing</>

//     return <>fixme</>
//     // // get graph
//     // const graph = st.XXXX.get(p.msg.uid)
//     // if (graph == null) return <>❓ No graph</>

//     // // get node
//     // const nodeID = msg.data.node
//     // const node = graph.nodesIndex.get(nodeID)
//     // if (node == null) {
//     //     return null
//     //     // return <>no node</>
//     // }

//     // // show the node
//     // return <ComfyNodeUI node={node} />
// })
