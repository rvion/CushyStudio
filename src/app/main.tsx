import '../theme/tw.css'
import 'react-toastify/dist/ReactToastify.css'
import 'highlight.js/styles/stackoverflow-dark.css'
import '../theme/flexlayout.css'
import '../theme/index.css'
import '../theme/daisy-tweaks.css'
import '../theme/codemirror.css'
import '../theme/form.css'
import '../theme/markdown.css'
import '../theme/Tree.css'
import '../theme/theme.css'
import '../csuite/input-number/InputNumberUI.css'
// make sure presenter is properly injected
import '../csuite-cushy/presenters/Presenter'

import ReactDOM from 'react-dom/client'

import { MainUI } from '../widgets/misc/MainUI'

const root = document.getElementById('root') as HTMLElement
ReactDOM.createRoot(root).render(<MainUI />)
