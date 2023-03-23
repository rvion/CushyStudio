import { observer } from 'mobx-react-lite'
import { CivitaiUI } from './civitai/CIvitaiUI'
import { MenuUI } from './menu/MenuUI'
import { PConnectUI } from './panels/pConnect'
import { PImportUI } from './panels/pImport'
import { PUploadUI } from './panels/pUpload'

export const IdeInfosUI = observer(function IdeInfosUI_() {
    return (
        <div className='col gap h100'>
            <MenuUI />
            <div className='grow'></div>
            <PUploadUI />
            <CivitaiUI />
            <PConnectUI />
            <PImportUI />
        </div>
    )
})
