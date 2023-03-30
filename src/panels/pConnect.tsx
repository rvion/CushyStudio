import { Card, Input } from '@fluentui/react-components'
import { Alert, Field } from '@fluentui/react-components/unstable'
import * as I from '@fluentui/react-icons'
import { observer } from 'mobx-react-lite'
import { useWorkspace } from '../ui/WorkspaceContext'

export const PConnectUI = observer(function PConnectUI_(p: {}) {
    const client = useWorkspace()
    return (
        <div className='row gap items-start'>
            <Card>
                <h3 className='row'>
                    <div>Server </div>
                    <div className='grow'></div>
                    <div>{client.ws.emoji}</div>
                </h3>
                {/* <Switch value={} /> */}
                {/* <Field label='Workspace Folder'>
                                <Input
                                contentBefore={'📁'}
                                value={client._config.config.workspace}
                                onChange={(ev) => (client._config.config.workspace = ev.target.value)}
                                />
                            </Field> */}
                <Field label='http(s) URL to access Comfy'>
                    <Input
                        contentBefore={'🫖'}
                        value={client.workspaceConfigFile.value.comfyHTTPURL}
                        onChange={(ev) => client.workspaceConfigFile.update({ comfyHTTPURL: ev.target.value })}
                    />
                </Field>
                <Field label='ws(s) ENDPOINT to access Comfy'>
                    <Input
                        contentBefore={'🧦'}
                        value={client.workspaceConfigFile.value.comfyWSURL}
                        onChange={(ev) => client.workspaceConfigFile.update({ comfyWSURL: ev.target.value })}
                    />
                </Field>
                {/* <div className='row gap'>
                    <Button appearance='primary' onClick={() => client.config.save()} icon={<I.Save24Filled />}>
                        Save
                    </Button>
                </div> */}
                {client.workspaceConfigFile.value.comfyWSURL.endsWith('/ws') ? null : (
                    <Alert appearance='inverted' icon={<I.Warning24Filled color='red' />}>
                        did you forget `/ws` at the end of the websocket url ?
                    </Alert>
                )}
            </Card>
            {/* <LoggerUI className='grow' /> */}
        </div>
    )
})
