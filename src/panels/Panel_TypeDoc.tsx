import { observer } from 'mobx-react-lite'

export const Panel_TypeDoc = observer(function Panel_TypeDoc_(p: {}) {
    return <iframe className='w-full h-full' src={'http://localhost:8788/library/_docs/index.html'} frameBorder='0' />
})
