import { observer } from 'mobx-react-lite'
import { ProjectTreeUI } from './ProjectTreeUI'

export const MenuUI = observer(function IdeInfosUI_() {
    return (
        <div className='col gap h100'>
            <ProjectTreeUI />
            <div className='grow'></div>
        </div>
    )
})
