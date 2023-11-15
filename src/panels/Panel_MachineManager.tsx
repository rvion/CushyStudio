import { observer } from 'mobx-react-lite'
import { Button, Input, InputGroup, Panel, Toggle } from 'src/rsuite/shims'
import { useSt } from 'src/state/stateContext'

export const LabelUI = observer(function LabelUI_(p: { children: React.ReactNode }) {
    return <b>{p.children}: </b>
})
export const Panel_MachineManager = observer(function HostListUI_(p: {}) {
    const st = useSt()
    const mainComfyHost = st.configFile.value.comfyHost
    const mainComfyPort = st.configFile.value.comfyPort
    const machines = st.configFile.value.machines
    return (
        <div tw='flex flex-wrap gap-2 p-2'>
            {machines?.map((m, ix) => {
                const isMain = m.comfyHost === mainComfyHost && m.comfyPort === mainComfyPort
                return (
                    <Panel bordered tw='p-3 [min-width:20rem]'>
                        <div tw='flex flex-col gap-2'>
                            <InputGroup key={ix}>
                                {/* <InputGroupAddon>
                                {isMain ? (
                                    <span className='text-green-500 material-symbols-outlined'>done</span>
                                ) : (
                                    <span className='material-symbols-outlined'>power_off</span>
                                )}
                            </InputGroupAddon> */}
                                <Button
                                    //
                                    tw='w-full'
                                    appearance={isMain ? 'primary' : 'ghost'}
                                    color={isMain ? 'green' : 'blue'}
                                    // startIcon={<span className='material-symbols-outlined'>computer</span>}
                                    onClick={() => {
                                        st.configFile.update({
                                            comfyHost: m.comfyHost,
                                            comfyPort: m.comfyPort,
                                        })
                                    }}
                                    key={ix}
                                >
                                    <div className='flex gap-2'>
                                        <div>
                                            <div>
                                                {m.comfyHost}:{m.comfyPort}
                                            </div>
                                        </div>
                                        {isMain ? <span className='material-symbols-outlined'>star</span> : null}
                                    </div>
                                </Button>
                            </InputGroup>
                            <div>
                                <LabelUI>name</LabelUI>
                                <Input
                                    //
                                    onChange={(next) => (m.name = next)}
                                    value={m.name ?? 'unnamed'}
                                ></Input>
                            </div>
                            <div>
                                <LabelUI>server host</LabelUI>
                                <Input //
                                    value={m.comfyHost}
                                ></Input>
                            </div>
                            <div>
                                <LabelUI>Port</LabelUI>
                                <Input //
                                    value={m.comfyPort}
                                ></Input>
                            </div>
                            <div>
                                <LabelUI>is local</LabelUI>
                                <Toggle checked={m.isLocal ?? false}></Toggle>
                            </div>
                            <div>
                                <LabelUI>localPath</LabelUI>
                                <Input type='string' disabled={!Boolean(m.isLocal)} value={m.localPath}></Input>
                            </div>
                        </div>
                    </Panel>
                )
            })}
        </div>
    )
})
