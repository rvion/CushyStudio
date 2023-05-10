import '../logger/LoggerFront' // inject a global logger
import ReactDOM from 'react-dom/client'

import './webview.css'
import 'rsuite/dist/rsuite.min.css'
import { WebviewUI } from './WebviewUI'
import { CustomProvider } from 'rsuite'
import { useMemo } from 'react'
import { FrontState } from '../front/FrontState'
import { stContext } from '../front/stContext'
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
