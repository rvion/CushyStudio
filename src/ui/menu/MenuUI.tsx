import { observer } from 'mobx-react-lite'
import { DropZoneUI } from '../DropZoneUI'
import { ProjectTreeUI } from './ProjectTreeUI'
import { NewProjectModalUI } from './NewProjectModalUI'

export const MenuUI = observer(function IdeInfosUI_() {
    return (
        <div className='col gap h100'>
            <NewProjectModalUI />
            <ProjectTreeUI />
            <div className='grow'></div>
            <DropZoneUI />
        </div>
    )
})
