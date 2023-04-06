import { observer } from 'mobx-react-lite'
import { Container, Content, Form, Message, Panel } from 'rsuite'
import { Title3 } from '../ui/Text'
import { useWorkspace } from '../ui/WorkspaceContext'

export const PConnectUI = observer(function PConnectUI_(p: {}) {
    const workspace = useWorkspace()
    const cushy = workspace.cushy
    return (
        <Content className='col gap m'>
            <h2>Configuration</h2>
            <Form className='col gap'>
                <Panel>
                    <Form.Group controlId='workspace'>
                        <Form.ControlLabel>
                            <Title3>Root folder</Title3>
                        </Form.ControlLabel>
                        <Form.Control
                            disabled
                            name='workspace'
                            value={workspace.absoluteWorkspaceFolderPath}
                            onChange={(ev) => workspace.workspaceConfigFile.update({ comfyHTTPURL: ev.target.value })}
                        />
                        {/* <Form.HelpText>Required</Form.HelpText> */}
                    </Form.Group>
                </Panel>
                {/* <Title3></Title3>
                <Form.Group controlId='name'>
                    <Form.ControlLabel>Username</Form.ControlLabel>
                    <Form.Control name='name' />
                    <Form.HelpText>Username is required</Form.HelpText>
                </Form.Group>
                <Field label='Root folder'>
                    <Input
                        disabled
                        contentBefore={'📁'}
                        value={workspace.absoluteWorkspaceFolderPath}
                        onChange={(ev) => workspace.workspaceConfigFile.update({ comfyHTTPURL: ev.target.value })}
                    />
                </Field> */}
                <Panel
                    header={
                        <div className='row gap items-center'>
                            <Title3>Connection</Title3> <div>{workspace.ws.emoji}</div>
                        </div>
                    }
                >
                    {/* <Switch value={} /> */}
                    {/* <Field label='Workspace Folder'>
                                <Input
                                contentBefore={'📁'}
                                value={client._config.config.workspace}
                                onChange={(ev) => (client._config.config.workspace = ev.target.value)}
                                />
                            </Field> */}

                    <Form.Group controlId='workspace'>
                        <Form.ControlLabel>Comfy HTTP(s) server</Form.ControlLabel>
                        <Form.Control
                            type='text'
                            name='http-server-url'
                            // value={workspace.absoluteWorkspaceFolderPath}
                            // onChange={(ev) => workspace.workspaceConfigFile.update({ comfyHTTPURL: ev.target.value })}
                            value={workspace.workspaceConfigFile.value.comfyHTTPURL}
                            onChange={(ev) => workspace.workspaceConfigFile.update({ comfyHTTPURL: ev.target.value })}
                        />
                        {/* <Form.HelpText>Required</Form.HelpText> */}
                    </Form.Group>
                    {/* <Field label='Comfy HTTP(s) server'>
                    <Input contentBefore={'🫖'} />
                </Field> */}
                    {/* <Field label='Comfy websocket endpoint'>
                    <Input
                        contentBefore={'🧦'}
                        value={workspace.workspaceConfigFile.value.comfyWSURL}
                        onChange={(ev) => workspace.workspaceConfigFile.update({ comfyWSURL: ev.target.value })}
                    />
                </Field> */}
                    <Form.Group controlId='workspace'>
                        <Form.ControlLabel>Websocket endpoint</Form.ControlLabel>
                        <Form.Control
                            name='ws-server-url'
                            value={workspace.workspaceConfigFile.value.comfyWSURL}
                            onChange={(ev) => workspace.workspaceConfigFile.update({ comfyWSURL: ev.target.value })}
                        />
                        {/* <Form.HelpText>Required</Form.HelpText> */}
                    </Form.Group>
                    {/* <div className='row gap'>
                    <Button appearance='primary' onClick={() => client.config.save()} icon={<I.Save24Filled />}>
                        Save
                    </Button>
                </div> */}
                    {workspace.workspaceConfigFile.value.comfyWSURL.endsWith('/ws') ? null : (
                        <Message showIcon type='error'>
                            did you forget `/ws` at the end of the websocket url ?
                        </Message>
                    )}
                </Panel>
                {/* <LoggerUI className='grow' /> */}
                <Panel>
                    <Title3>Global Config</Title3>
                    <div>
                        <label>global config folder: </label>
                        <code className='highlighted'>"{cushy.rootFolder.absPath}"</code>
                    </div>
                    <div>
                        <label>global config file:</label>
                        <code className='highlighted'>"{cushy.globalConfigAbsPath}"</code>
                    </div>
                    <Panel>
                        <pre>{JSON.stringify(workspace.cushy.userConfig.value, null, 3)}</pre>
                    </Panel>
                </Panel>
            </Form>
        </Content>
    )
})
