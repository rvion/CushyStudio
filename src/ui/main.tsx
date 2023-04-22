import '../logger/LoggerFront' // inject a global logger
import ReactDOM from 'react-dom/client'

import 'rsuite/dist/rsuite.min.css'
import './webview.css'
import { WebviewUI } from './WebviewUI'
import { CustomProvider } from 'rsuite'

const root = document.getElementById('root') as HTMLElement
ReactDOM.createRoot(root).render(
    <CustomProvider theme='dark'>
        <WebviewUI />
    </CustomProvider>,
)
