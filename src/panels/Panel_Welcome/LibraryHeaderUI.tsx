import { observer } from 'mobx-react-lite'

import { Button } from '../../csuite/button/Button'
import { useSt } from '../../state/stateContext'

export const IndexAllAppsBtnUI = observer(function IndexAllAppsBtnUI_(p: {}) {
    const st = useSt()
    return (
        <Button //
            icon='mdiMagnifyScan'
            look='primary'
            hue={200}
            onClick={st.startupFileIndexing}
        >
            Index Apps
        </Button>
    )
})

export const ForceUpdateAllAppsBtnUI = observer(function IndexAllAppsBtnUI_(p: {}) {
    const st = useSt()
    return <Button onClick={st.forceRefreshAllApps}>Force-Recompile All Apps</Button>
})
