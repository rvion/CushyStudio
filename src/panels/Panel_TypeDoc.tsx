import { observer } from 'mobx-react-lite'

import { CUSHY_PORT } from '../state/PORT'

export const Panel_TypeDoc = observer(function Panel_TypeDoc_(p: {}) {
    return (
        <iframe //
            className='h-full w-full'
            src={`http://localhost:${CUSHY_PORT}/library/_doc/index.html`}
            frameBorder='0'
        />
    )
})
