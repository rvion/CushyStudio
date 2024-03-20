import '../theme/tw.css'
import 'react-toastify/dist/ReactToastify.css'
import 'highlight.js/styles/stackoverflow-dark.css'
import '../theme/flexlayout.css'
import '../theme/index.css'
import '../theme/theme.css'
import '../theme/Tree.css'

import ReactDOM from 'react-dom/client'

import { MainUI } from '../widgets/misc/MainUI'

const root = document.getElementById('root') as HTMLElement
ReactDOM.createRoot(root).render(<MainUI />)
