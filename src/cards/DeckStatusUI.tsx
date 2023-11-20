import type { Deck } from './Deck'

import { observer } from 'mobx-react-lite'
import { UpdateBtnUI } from 'src/app/updater/UpdateBtnUI'

export const ActionPackStatusUI = observer(function PackStatusUI_(p: { pack: Deck }) {
    const ap = p.pack
    if (ap.BUILT_IN) return <div>built-in</div>
    return <UpdateBtnUI updater={ap.updater} />
})
