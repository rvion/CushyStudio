import ReactDOM from 'react-dom/client'

import 'split-pane-react/esm/themes/default.css'
import 'rsuite/dist/rsuite.min.css'
import './webview.css'
import { Main } from './Main.1'

const root = document.getElementById('root') as HTMLElement
ReactDOM.createRoot(root).render(<Main />)
