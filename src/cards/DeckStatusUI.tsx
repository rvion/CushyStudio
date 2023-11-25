import type { Package } from './Pkg'

import { observer } from 'mobx-react-lite'
import { UpdateBtnUI } from 'src/updater/UpdateBtnUI'

export const ActionPackStatusUI = observer(function PackStatusUI_(p: { className?: string; pack: Package }) {
    const ap = p.pack
    if (ap.isBuiltIn) return <div tw='italic opacity-50 text-xs'>built-in</div>
    return <UpdateBtnUI updater={ap.updater} />
})
