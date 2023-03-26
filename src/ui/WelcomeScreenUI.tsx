import { Button } from '@fluentui/react-components'
import * as dialog from '@tauri-apps/api/dialog'
import { observer } from 'mobx-react-lite'
import { useCS } from '../config/CushyStudioContext'
import * as I from '@fluentui/react-icons'
export const WelcomeScreenUI = observer(function WelcomeScreenUI_(p: { children: React.ReactNode }) {
    return (
        <div className='welcome-screen'>
            <div className='welcome-popup col gap items-center'>{p.children}</div>
        </div>
    )
})

export const OpenWorkspaceUI = observer(function OpenWorkspaceUI_(p: {}) {
    const cs = useCS()
    return (
        <div className='col gap'>
            <h1>CushyStudio</h1>

            <div>
                <h3>Recent workspaces:</h3>
                <div className='col gap1'>
                    {cs.userConfig.value.recentProjects?.map((rp) => (
                        <div key={rp}>
                            <Button icon={<I.Open24Regular />} onClick={() => cs.openWorkspace(rp)}>
                                {rp}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
            <Button
                icon={<I.Add24Filled />}
                size='large'
                appearance='primary'
                onClick={async () => {
                    const workspaceFolder = await dialog.open({
                        title: 'Open',
                        directory: true,
                        filters: [
                            //
                            { name: 'Civitai Project', extensions: ['cushy'] },
                            { name: 'image', extensions: ['png'] },
                        ],
                    })
                    if (typeof workspaceFolder !== 'string') {
                        return console.log('❌ not a string:', workspaceFolder)
                    }
                    cs.openWorkspace(workspaceFolder)
                }}
            >
                Add new workspace
            </Button>
        </div>
    )
})
