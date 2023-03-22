import { Button, Card, Input, Label, Text } from '@fluentui/react-components'
import { observer } from 'mobx-react-lite'
import { useSt } from '../stContext'

export const PConnectUI = observer(function PConnectUI_(p: {}) {
    const client = useSt()
    return (
        <Card>
            <div className='row'>
                <Text size={500}>Server</Text>
                <div className='grow'></div>
                <div>{client.wsStatusEmoji}</div>
            </div>
            <Label>
                Host
                <Input type='text' value={client.serverIP} onChange={(e) => (client.serverIP = e.target.value)} />
            </Label>
            <Label>
                Port
                <Input
                    type='number'
                    value={client.serverPort.toString()}
                    onChange={(e) => (client.serverPort = parseInt(e.target.value, 10))}
                />
            </Label>
            <Button appearance='primary' onClick={() => setTimeout(() => window.location.reload(), 1000)}>
                connect
            </Button>
        </Card>
    )
})
