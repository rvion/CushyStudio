import { observer } from 'mobx-react-lite'
import { PConnectUI } from '../panels/pConnect'
import { PImportUI } from '../panels/pImport'
import { ProjectTreeUI } from './ProjectTreeUI'

export const CSMenuUI = observer(function IdeInfosUI_() {
    return (
        <div className='col gap h100'>
            <ProjectTreeUI />
            <div className='grow'></div>
            <PImportUI />
            <PConnectUI />
        </div>
    )
})
