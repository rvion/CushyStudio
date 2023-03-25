import { Button, Link } from '@fluentui/react-components'
import * as dialog from '@tauri-apps/api/dialog'
import { observer } from 'mobx-react-lite'
import { useCS } from '../config/CushyStudioContext'

export const WelcomeScreenUI = observer(function WelcomeScreenUI_(p: { children: React.ReactNode }) {
    return (
        <div className='welcome-screen'>
            <div className='welcome-popup col gap items-center'>
                <h1>CushyStudio</h1>
                {p.children}
            </div>
        </div>
    )
})

export const OpenWorkspaceUI = observer(function OpenWorkspaceUI_(p: {}) {
    const cs = useCS()
    return (
        <div className='col gap'>
            <Button
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
                open a workspace
            </Button>

            <div>
                <h3>recent workspaces:</h3>
                <div>
                    {cs.userConfig.value.recentProjects?.map((rp) => (
                        <Button
                            key={rp}
                            onClick={() => {
                                cs.openWorkspace(rp)
                            }}
                        >
                            {rp}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    )
})
