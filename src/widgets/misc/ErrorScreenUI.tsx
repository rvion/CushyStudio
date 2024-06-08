import { observer } from 'mobx-react-lite'

import { CSCriticalError } from '../CSCriticalError'

export const ErrorScreenUI = observer(function ErrorScreenUI_(p: { err: CSCriticalError }) {
    return (
        <div
            style={{
                alignItems: 'center',
                justifyContent: 'center',
                color: 'red',
                background: '#280606',
                height: '100%',
                display: 'flex',
                overflow: 'auto',
                flexDirection: 'column',
            }}
        >
            <h1>{p.err.title}</h1>
            <h3>{p.err.help}</h3>
        </div>
    )
})
