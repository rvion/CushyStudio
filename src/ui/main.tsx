import ReactDOM from 'react-dom/client'

// dock css
// import 'rc-dock/dist/rc-dock-dark.css'

// 🔴 todo remove this now that we have fluentui 9
// import 'react-toastify/dist/ReactToastify.css'

// import 'rsuite/dist/rsuite.css' // or 'rsuite/dist/rsuite.min.css'
// import 'rsuite/styles/index.less'

// mixed back of overrides
import './webview.css'
import { vscode } from '../core-front/WebviewClientState'
import { FooUI } from './FooUI'

// single import allowed before loading demos
// import { Workflow } from '../core/Workflow'

// const start = async () => {
//     // 1. monkey patch WORKFLOW so we can properly import demos without crahsing
//     // due to missing virtual WORKFLOW function
//     // @ts-ignore
//     // window.WORKFLOW = (...args: ConstructorParameters<typeof Workflow>) => {
//     //     return new Workflow(...args)
//     // }

//     // const { AppUI } = await import('../layout/AppUI')

//     // APP ENTRYPOINT
// }

// void start()

export function handleHowdyClick() {
    vscode.postMessage({
        command: 'hello',
        text: 'Hey there partner! 🤠',
    })
}
ReactDOM.createRoot(
    //
    document.getElementById('root') as HTMLElement,
).render(<FooUI />)
