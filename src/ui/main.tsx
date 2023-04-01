import ReactDOM from 'react-dom/client'

// dock css
import 'rc-dock/dist/rc-dock-dark.css'

// 🔴 todo remove this now that we have fluentui 9
import 'react-toastify/dist/ReactToastify.css'

// mixed back of overrides
import './index.css'

// single import allowed before loading demos
import { Workflow } from '../core/Workflow'

const start = async () => {
    // 1. monkey patch WORKFLOW so we can properly import demos without crahsing
    // due to missing virtual WORKFLOW function
    // @ts-ignore
    window.WORKFLOW = (...args: ConstructorParameters<typeof Workflow>) => {
        return new Workflow(...args)
    }

    const { AppUI } = await import('../layout/AppUI')

    // APP ENTRYPOINT
    ReactDOM.createRoot(
        //
        document.getElementById('root') as HTMLElement,
    ).render(<AppUI />)
}

void start()
