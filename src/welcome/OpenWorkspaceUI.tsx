import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { IconButton, Panel, Toggle } from 'rsuite'
import { useCushyStudio } from '../cushy/CushyContext'
import { Title1, Title3 } from '../ui/Text'

export const OpenWorkspaceUI = observer(function OpenWorkspaceUI_(p: {}) {
    const cs = useCushyStudio()
    return (
        <div className='col gap'>
            <Title1>🛋️ CushyStudio</Title1>
            <Title3>Recent workspaces</Title3>
            <div className='col gap1'>
                {cs.userConfig.value.recentProjects?.map((rp) => (
                    <div key={rp}>
                        <IconButton icon={<I.Grid />} onClick={() => cs.openWorkspace(rp)}>
                            {rp}
                        </IconButton>
                    </div>
                ))}
            </div>
            <IconButton icon={<I.Plus />} appearance='primary' onClick={cs.openWorkspaceDialog}>
                Add new workspace
            </IconButton>
            <div>
                <Toggle
                    //
                    size='lg'
                    checked={cs.userConfig.value.reOpenLastProject ?? false}
                    onChange={(next) => {
                        cs.userConfig.update({ reOpenLastProject: next })
                    }}
                />
                <label>Re-open last workspace on startup</label>
            </div>
        </div>
    )
})
