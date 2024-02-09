import ReactDOM from 'react-dom/client'

import 'src/theme/tw.css'
import 'react-toastify/dist/ReactToastify.css'
import 'highlight.js/styles/stackoverflow-dark.css'
import 'src/theme/flexlayout.css'
import 'src/theme/index.css'
import 'src/theme/theme.css'
import 'src/theme/Tree.css'

import { MainUI } from '../widgets/misc/MainUI'

import 'src/controls/widgets/WidgetUI'

const root = document.getElementById('root') as HTMLElement
ReactDOM.createRoot(root).render(<MainUI />)
