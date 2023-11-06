import { observer } from 'mobx-react-lite'
import { Form, Panel, Toggle } from 'rsuite'
import { useSt } from '../../FrontStateCtx'
import { SectionTitleUI } from '../workspace/SectionTitle'

export const PanelConfigUI = observer(function PanelConfigUI_() {
    const st = useSt()
    const config = st.configFile
    return (
        <div className='flex flex-col items-start p-2'>
            <Panel header={<SectionTitleUI label='CONFIG' className='block' />} className='col flex-grow'>
                <Form layout='horizontal'>
                    <FieldUI label='Comfig file path'>
                        <Form.ControlLabel>{config.path}</Form.ControlLabel>
                        {/* <Form.Control //
                            value={config.value.githubUsername}
                            onChange={(v) => config.update({ githubUsername: v })}
                            name='githubUsername'
                        /> */}
                    </FieldUI>

                    <FieldUI label='Your github username'>
                        <Form.Control //
                            value={config.value.githubUsername}
                            onChange={(v) => config.update({ githubUsername: v })}
                            name='githubUsername'
                        />
                    </FieldUI>
                    <FieldUI label='use Https?'>
                        <Form.Control //
                            accepter={Toggle}
                            value={config.value.useHttps}
                            onChange={(v) => config.update({ useHttps: v })}
                            name='useHttps'
                        />
                    </FieldUI>
                    <FieldUI label='comfy host'>
                        <Form.Control
                            //
                            value={config.value.comfyHost}
                            onChange={(v) => config.update({ comfyHost: v })}
                            placeholder='localhost'
                            type='text'
                            name='comfyHost'
                        />
                    </FieldUI>
                    <FieldUI label='comfy port'>
                        <Form.Control //
                            value={config.value.comfyPort}
                            onChange={(v) =>
                                config.update({
                                    comfyPort:
                                        typeof v === 'string' //
                                            ? parseInt(v)
                                            : typeof v === 'number'
                                            ? Math.abs(v)
                                            : 8788,
                                })
                            }
                            type='number'
                            placeholder='8188'
                            name='comfyPort'
                        />
                    </FieldUI>
                    <FieldUI label='Gallery Image Size (px)'>
                        <Form.Control //
                            value={config.value.galleryImageSize ?? 48}
                            onChange={(v) =>
                                config.update({
                                    galleryImageSize:
                                        typeof v === 'string' //
                                            ? parseInt(v)
                                            : typeof v === 'number'
                                            ? Math.abs(v)
                                            : 48,
                                })
                            }
                            type='number'
                            placeholder='48'
                            name='galleryImageSize'
                        />
                    </FieldUI>
                    <FieldUI label='Check update every X minutes'>
                        <Form.Control //
                            value={config.value.checkUpdateEveryMinutes ?? 5}
                            min={0.5}
                            onChange={(v) =>
                                config.update({
                                    checkUpdateEveryMinutes:
                                        typeof v === 'string' //
                                            ? parseFloat(v)
                                            : typeof v === 'number'
                                            ? v
                                            : 5,
                                })
                            }
                            type='number'
                            placeholder='48'
                            name='galleryImageSize'
                        />
                    </FieldUI>
                </Form>
                {/* <Message type='info' showIcon className='self-start'>
                    <JSONHighlightedCodeUI code={JSON.stringify(config.value, null, 3)} />
                </Message> */}
                {/* <pre>{JSON.stringify(action)}</pre> */}
            </Panel>
        </div>
    )
})

export const FieldUI = observer(function FieldUI_(p: {
    required?: boolean
    label?: string
    help?: string
    children: React.ReactNode
}) {
    return (
        <Form.Group>
            <Form.ControlLabel>{p.label}</Form.ControlLabel>
            {p.children}

            {p.required && <Form.HelpText>Required</Form.HelpText>}
        </Form.Group>
    )
})
