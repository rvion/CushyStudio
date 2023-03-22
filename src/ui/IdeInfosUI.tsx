import { observer } from 'mobx-react-lite'
import { CivitaiUI } from './civitai/CIvitaiUI'
import { MenuUI } from './menu/MenuUI'
import { PConnectUI } from './pConnect/pConnect'
import { PImportUI } from './pConnect/pImport'

export const IdeInfosUI = observer(function IdeInfosUI_() {
    return (
        <div className='col gap h100'>
            <MenuUI />
            <div className='grow'></div>
            <CivitaiUI />
            <PConnectUI />
            <PImportUI />
        </div>
    )
})
