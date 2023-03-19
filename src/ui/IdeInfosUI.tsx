import { Link } from '@fluentui/react-components'
import { observer } from 'mobx-react-lite'
import { DropZoneUI } from './DropZoneUI'
import { MenuUI } from './menu/MenuUI'

export const IdeInfosUI = observer(function IdeInfosUI_(p: {}) {
    // const client = useSt()
    return (
        <div className='col gap1 h100'>
            {/* <h1>
                <Link target='_blank' href='https://github.com/rvion/CushyStudio'>
                    CushyStudio
                </Link>
            </h1> */}
            {/* <VerticalGraph /> */}
            <MenuUI />
            <div className='grow'></div>
            <DropZoneUI />
        </div>
        //     <div className='row gap'>
        //         {/* <button>Open</button> */}
        //         {/* <button onClick={client.fetchObjectsSchema2}>Test</button> */}
        //     </div>
        //     <TreeValue title='server IP'>
        //         <input type='text' value={client.serverIP} onChange={(ev) => (client.serverIP = ev.target.value)} />
        //     </TreeValue>
        //     <TreeValue title='port'>
        //         <input
        //             type='number'
        //             value={client.serverPort}
        //             onChange={(ev) => (client.serverPort = parseInt(ev.target.value, 10))}
        //         />
        //     </TreeValue>
        //     <TreeValue title='websocket'>
        //         {client.wsStatusEmoji} {client.wsStatus}
        //         <button onClick={client.startWSClient}>Connect</button>
        //     </TreeValue>
        //     <TreeValue title='schema'>
        //         {client.schemaStatusEmoji} {client.schema.nodes.length} nodes;
        //         <button onClick={client.fetchObjectsSchema}>Load</button>
        //     </TreeValue>
        //     <TreeValue title='dts' onClick={client.editor.openLib}>
        //         {client.dtsStatusEmoji} {client.dts.length} chars;
        //         {/* <button onClick={() => {}}>Load</button> */}
        //     </TreeValue>
        //     <TreeValue onClick={client.editor.openSDK} title='SDK'>
        //         {client.editor.hasSDK() ? '🟢' : '🔴'} <div>0.1.0</div>
        //     </TreeValue>
        //     <TreeValue onClick={() => client.editor.openCODE()} title='code'>
        //         🟢 {client.project.code.length} chars
        //     </TreeValue>
        // </div>
    )
})
