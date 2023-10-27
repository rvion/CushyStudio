import type { ActionPack } from './ActionPack'
import type { Updater } from 'src/front/updater'

import { observer } from 'mobx-react-lite'
import { Button, Notification, toaster } from 'rsuite'
import { UpdateBtnUI } from 'src/front/ui/layout/UpdateBtnUI'

export const ActionPackStatusUI = observer(function PackStatusUI_(p: { pack: ActionPack }) {
    const ap = p.pack
    if (ap.BUILT_IN) return <div tw='text-gray-500'>built-in</div>
    return ap.isInstalled ? (
        <UpdateBtnUI updater={ap.updater} />
    ) : (
        <Button
            loading={ap.installK.isRunning}
            appearance='primary'
            size='xs'
            startIcon={<span className='text-gray-700 material-symbols-outlined'>cloud_download</span>}
            onClick={(ev) => {
                ev.stopPropagation()
                ev.preventDefault()
                ap.install()
            }}
        >
            Install
        </Button>
    )
})
