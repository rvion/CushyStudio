import { observer } from 'mobx-react-lite'
import { Panel } from 'rsuite'
import { useSt } from 'src/front/FrontStateCtx'

export const HostListUI = observer(function HostListUI_(p: {}) {
    const st = useSt()
    const machines = st.configFile.value.machines
    return (
        <div>
            {machines?.map((m, ix) => (
                <Panel bordered tw='m-2 bg-gray-900' key={ix}>
                    <div className='flex gap-2'>
                        <span className='material-symbols-outlined'>computer</span>
                        <div>
                            <div>{m.comfyHost}</div>
                            <div>{m.comfyPort}</div>
                        </div>
                    </div>
                </Panel>
            ))}
        </div>
    )
})
