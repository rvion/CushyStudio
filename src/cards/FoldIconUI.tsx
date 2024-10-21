import { observer } from 'mobx-react-lite'

import { Ikon } from '../csuite/icons/iconHelpers'

export const FoldIconUI = observer(function FoldIconUI_(p: {
    //
    val?: boolean
    set?: (next: boolean) => void
}) {
    const val = p.val ?? false
    return val ? <Ikon.mdiChevronRight /> : <Ikon.mdiChevronDown />
})
