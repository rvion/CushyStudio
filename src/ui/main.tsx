import '../logger/LoggerFront' // inject a global logger
import ReactDOM from 'react-dom/client'

import './webview.css'
import 'rsuite/dist/rsuite.min.css'
import { WebviewUI } from './layout/AppUI'
import { CustomProvider } from 'rsuite'
import { useMemo } from 'react'
import { FrontState } from '../front/FrontState'
import { stContext } from '../front/FrontStateCtx'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

const Main = () => {
    const st = useMemo(() => new FrontState(), [FrontState])
    return (
        <CustomProvider theme='dark'>
            <stContext.Provider value={st}>
                <DndProvider backend={HTML5Backend}>
                    <WebviewUI />
                </DndProvider>
            </stContext.Provider>
        </CustomProvider>
    )
}

const root = document.getElementById('root') as HTMLElement
ReactDOM.createRoot(root).render(<Main />)
