import type { UIActionComfig } from 'src/front/UIAction'

import { observer } from 'mobx-react-lite'
import { Form, Message, Panel, Toggle } from 'rsuite'
import { useSt } from '../../../front/FrontStateCtx'
import { JSONHighlightedCodeUI } from '../TypescriptHighlightedCodeUI'
import { SectionTitleUI } from '../workspace/SectionTitle'

export const PanelConfigUI = observer(function PanelConfigUI_(p: { action: UIActionComfig }) {
    const st = useSt()
    const config = st.configFile
    return (
        <div className='flex flex-col items-start p-2'>
            <Panel header={<SectionTitleUI label='CONFIG' className='bg-pink-900 block' />} className='col flex-grow'>
                <Form layout='horizontal'>
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
                                            : 8288,
                                })
                            }
                            type='number'
                            placeholder='8188'
                            name='comfyPort'
                        />
                    </FieldUI>
                </Form>
                <Message type='info' showIcon className='self-start'>
                    <div>path: {config.path}</div>
                    <JSONHighlightedCodeUI code={JSON.stringify(config.value, null, 3)} />
                </Message>
                {/* <pre>{JSON.stringify(action)}</pre> */}
            </Panel>
        </div>
    )
})

export const FieldUI = observer(function FieldUI_(p: { label?: string; help?: string; children: React.ReactNode }) {
    return (
        <Form.Group>
            <Form.ControlLabel>{p.label}</Form.ControlLabel>
            {p.children}

            <Form.HelpText>Required</Form.HelpText>
        </Form.Group>
    )
})
