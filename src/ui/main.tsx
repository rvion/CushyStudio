import '../logger/LoggerFront' // inject a global logger
import ReactDOM from 'react-dom/client'

import './webview.css'
import { WebviewUI } from './WebviewUI'

const root = document.getElementById('root') as HTMLElement
ReactDOM.createRoot(root).render(<WebviewUI />)
