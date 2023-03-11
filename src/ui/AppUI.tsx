import 'rc-dock/dist/rc-dock-dark.css'

import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'

import { ComfyBackendInfos } from '../core/ComfyBackendInfos'
import { AppLayoutUI } from './AppLayoutUI'
import { stContext } from './stContext'

export const AppUI = observer(function AppUI_() {
    const backend = useMemo(() => new ComfyBackendInfos(), [])

    if (backend.manager)
        return (
            <stContext.Provider value={backend.manager}>
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
            </div>
        </div>
    )
})
