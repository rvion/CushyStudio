import '../logger/LoggerFront' // inject a global logger
import ReactDOM from 'react-dom/client'

import 'rsuite/dist/rsuite.min.css'
import './webview.css'
import { WebviewUI } from './WebviewUI'
import { CustomProvider } from 'rsuite'
import { useMemo } from 'react'
import { FrontState } from '../core-front/FrontState'
import { stContext } from '../core-front/stContext'
const Main = () => {
    const st = useMemo(() => new FrontState(), [FrontState])
    return (
        <CustomProvider theme='dark'>
            <stContext.Provider value={st}>
                <WebviewUI />
            </stContext.Provider>
        </CustomProvider>
    )
}

const root = document.getElementById('root') as HTMLElement
ReactDOM.createRoot(root).render(<Main />)
