import { observer } from 'mobx-react-lite'
import { CivitaiUI } from '../civitai/CIvitaiUI'
import { ProjectTreeUI } from './ProjectTreeUI'
import { PConnectUI } from '../panels/pConnect'
import { PImportUI } from '../panels/pImport'
import { PUploadUI } from '../panels/pUpload'

export const CSMenuUI = observer(function IdeInfosUI_() {
    return (
        <div className='col gap h100'>
            <PImportUI />
            <ProjectTreeUI />
            <div className='grow'></div>
            <PConnectUI />
        </div>
    )
})
