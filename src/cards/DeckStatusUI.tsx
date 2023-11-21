import type { Package } from './Deck'

import { observer } from 'mobx-react-lite'
import { UpdateBtnUI } from 'src/updater/UpdateBtnUI'

export const ActionPackStatusUI = observer(function PackStatusUI_(p: { pack: Package }) {
    const ap = p.pack
    if (ap.isBuiltIn) return <div>built-in</div>
    return <UpdateBtnUI updater={ap.updater} />
})
