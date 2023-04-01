import { Button } from '@fluentui/react-components'
import * as I from '@fluentui/react-icons'
import { observer } from 'mobx-react-lite'
import { useCS } from '../config/CushyStudioContext'

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
            <Button icon={<I.Add24Filled />} size='large' appearance='primary' onClick={cs.openWorkspaceDialog}>
                Add new workspace
            </Button>
        </div>
    )
})
