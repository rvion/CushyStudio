import ReactDOM from 'react-dom/client'

// import 'flexlayout-react/style/dark.css'
// import 'flexlayout-react/style/underline.css'
// import 'rsuite/dist/rsuite.min.css'
// import 'src/theme/theme-rvion.css'

import './index.css'
import 'src/theme/flexlayout.css'
import 'src/theme/theme.css'
// import 'src/theme/card.css'

import { MainUI } from '../widgets/misc/MainUI'

const root = document.getElementById('root') as HTMLElement
ReactDOM.createRoot(root).render(<MainUI />)
