import { Button, Divider, Switch, Title1, Title3 } from '@fluentui/react-components'
import * as I from '@fluentui/react-icons'
import { observer } from 'mobx-react-lite'
import { useCS } from '../config/CushyStudioContext'

export const OpenWorkspaceUI = observer(function OpenWorkspaceUI_(p: {}) {
    const cs = useCS()
    return (
        <div className='col gap'>
            <Title1 align='center'>🛋️ CushyStudio</Title1>

            <Divider appearance='strong' />
            <Title3>Recent workspaces:</Title3>
            <div className='col gap1'>
                {cs.userConfig.value.recentProjects?.map((rp) => (
                    <div key={rp}>
                        <Button appearance='secondary' icon={<I.Open24Regular />} onClick={() => cs.openWorkspace(rp)}>
                            {rp}
                        </Button>
                    </div>
                ))}
            </div>
            <Switch
                //
                label={'Re-open last workspace on startup'}
                checked={cs.userConfig.value.reOpenLastProject ?? false}
                onChange={(_, val) => {
                    cs.userConfig.update({ reOpenLastProject: val.checked })
                }}
            />
            <Button icon={<I.Add24Filled />} size='large' appearance='primary' onClick={cs.openWorkspaceDialog}>
                Add new workspace
            </Button>
        </div>
    )
})
