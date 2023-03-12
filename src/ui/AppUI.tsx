import 'rc-dock/dist/rc-dock-dark.css'

import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'

import { ComfyServerInfos } from '../core/ComfyServerInfos'
import { AppLayoutUI } from './AppLayoutUI'
import { stContext } from './stContext'
import { ComfyClient } from '../core/ComfyClient'

export const AppUI = observer(function AppUI_() {
    const backend = useMemo(() => new ComfyServerInfos(), [])
    const client = useMemo(
        () =>
            new ComfyClient({
                serverIP: '192.168.1.19',
                serverPort: 8188,
                spec: {},
            }),
        [],
    )

    // if (backend.client)
    return (
        <stContext.Provider value={client}>
            <AppLayoutUI />
        </stContext.Provider>
    )

    return (
        <div className='welcome-screen'>
            <div className='welcome-popup col gap items-center'>
                <h1>Comfy IDE</h1>
                <div className='row items-baseline gap'>
                    <div style={{ width: '3rem', textAlign: 'right' }}>IP:</div>
                    <input
                        type='text'
                        value={backend.serverIP}
                        onChange={(ev) => {
                            backend.serverIP = ev.target.value
                        }}
                    />
                </div>
                <div className='row items-baseline gap'>
                    <div style={{ width: '3rem', textAlign: 'right' }}>Port:</div>
                    <input
                        type='text'
                        value={backend.serverPort}
                        onChange={(ev) => {
                            backend.serverPort = parseInt(ev.target.value, 10)
                        }}
                    />
                </div>
                <button className='primary large self-stretch' onClick={() => backend.connect()}>
                    Connect
                </button>
                <button className='primary large self-stretch' onClick={() => backend.connect()}>
                    Connect Test
                </button>
            </div>
        </div>
    )
})
