import { Card, Text } from '@fluentui/react-components'
import { observer } from 'mobx-react-lite'
import { logger, LogLevel } from './Logger'

export const LoggerUI = observer(function LoggerUI_(p: { className?: string }) {
    const msgs = logger.history.slice().reverse()
    return (
        <Card className={p.className}>
            <Text size={400}>Logger</Text>
            <div style={{ maxHeight: '30rem', overflow: 'auto' }}>
                {msgs.map((log, i) => (
                    <div key={i} className='row gap1'>
                        <div className='light mono'>{log.timestamp.toISOString().slice(11, 19)}</div>
                        <div>{log.category}</div>
                        {color(log.level)}
                        {log.message}
                    </div>
                ))}
            </div>
        </Card>
    )
})

const color = (logLevel: LogLevel) => {
    if (logLevel === LogLevel.INFO) return <span style={{ color: '#78bfd8' }}>INFO: </span>
    if (logLevel === LogLevel.WARN) return <span style={{ color: 'orange' }}>WARN: </span>
    if (logLevel === LogLevel.DEBUG) return <span style={{ color: 'green' }}>DEBUG: </span>
    if (logLevel === LogLevel.ERROR) return <span style={{ color: 'red' }}>ERROR: </span>
}
