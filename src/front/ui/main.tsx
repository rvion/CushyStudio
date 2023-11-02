import ReactDOM from 'react-dom/client'

// import 'flexlayout-react/style/dark.css'
import 'flexlayout-react/style/dark.css'
import 'highlight.js/styles/stackoverflow-light.css'
import 'highlight.js/styles/stackoverflow-dark.css'

import 'rsuite/dist/rsuite.min.css'
// import 'src/theme/theme-rvion.css'

import './webview.css'
import 'src/theme/theme.css'
import 'src/theme/card.css'

import { Main } from './MainUI'

const root = document.getElementById('root') as HTMLElement
ReactDOM.createRoot(root).render(<Main />)
