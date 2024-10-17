import { observer } from 'mobx-react-lite'

import { useCSuite } from '../../csuite/ctx/useCSuite'
import { Frame } from '../../csuite/frame/Frame'
import { MessageInfoUI } from '../../csuite/messages/MessageInfoUI'
import { SelectUI } from '../../csuite/select/SelectUI'
import { Panel, type PanelHeader } from '../../router/Panel'
import { useSt } from '../../state/stateContext'
import { HostUI } from '../host/HostUI'
import { AddHostBtnUI } from './AddHostBtnUI'

export type PanelComfyHostProps = {
    hostID?: HostID
}

export const PanelComfyHosts = new Panel({
    name: 'Hosts',
    category: 'ComfyUI',
    widget: (): React.FC<PanelComfyHostProps> => PanelComfyHostsUI,
    header: (): PanelHeader => ({ title: 'Hosts' }),
    def: (): PanelComfyHostProps => ({}),
    icon: 'mdiDesktopTower',
})

export const PanelComfyHostsUI = observer(function PanelComfyHostsUI_(p: PanelComfyHostProps) {
    const st = useSt()
    const allHosts = st.hosts
    const mainHost = st.mainHost
    const csuite = useCSuite()

    return (
        <div tw='w-full h-full flex flex-col gap-2 p-2'>
            <div className='line'>
                <div>Primary Host</div>
                <Frame //
                    align
                    border
                    line
                    tw='flex flex-grow'
                    roundness={csuite.inputRoundness}
                >
                    <SelectUI
                        tooltip='The Primary host is the one used for typings, and to send prompts to by default.'
                        options={() => allHosts}
                        value={() => mainHost}
                        getLabelText={(host) => host.data.name}
                        onOptionToggled={(host) => host.electAsPrimary()}
                    />
                    <AddHostBtnUI />
                </Frame>
            </div>
            <div tw='text-xl font-bold'>My Custom Hosts</div>
            <div tw='flex flex-wrap gap-2'>
                {allHosts
                    ?.filter((g) => !g.isReadonly)
                    .map((host) => {
                        return <HostUI key={host.id} host={host} />
                    })}
            </div>
            <div tw='divider'></div>
            <div tw='text-xl font-bold'>Pre-configured Hosts</div>
            <div tw='flex flex-wrap gap-2'>
                {allHosts
                    ?.filter((g) => g.isReadonly)
                    .map((host) => {
                        return <HostUI key={host.id} host={host} />
                    })}
            </div>
        </div>
    )
})
