import { observer } from 'mobx-react-lite'

import { Button } from '../../rsuite/button/Button'
import { useSt } from '../../state/stateContext'

export const LibraryHeaderUI = observer(function LibraryHeaderUI_(p: {}) {
    const st = useSt()
    return (
        <div tw='flex w-full gap-2'>
            <Button icon='mdiMagnify' sm expand onClick={() => st.toggleFullLibrary()}>
                Browse
            </Button>
            <IndexAllAppsBtnUI />
        </div>
    )
})

export const IndexAllAppsBtnUI = observer(function IndexAllAppsBtnUI_(p: {}) {
    const st = useSt()
    return (
        <Button icon='mdiMagnifyScan' sm look='primary' onClick={st.startupFileIndexing}>
            Index Apps
        </Button>
    )
})
export const ForceUpdateAllAppsBtnUI = observer(function IndexAllAppsBtnUI_(p: {}) {
    const st = useSt()
    return (
        <Button tw='btn-sm btn btn-warning' onClick={st.forceRefreshAllApps}>
            Force-Recompile All Apps
        </Button>
    )
})
