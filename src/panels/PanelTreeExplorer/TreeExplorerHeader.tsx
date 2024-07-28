import { observer } from 'mobx-react-lite'

import { Button } from '../../csuite/button/Button'
import { useSt } from '../../state/stateContext'
import { IndexAllAppsBtnUI } from '../PanelWelcome/LibraryHeaderUI'

export const LibraryHeaderUI = observer(function LibraryHeaderUI_(p: {}) {
    const st = useSt()
    return (
        <div tw='flex w-full gap-2'>
            <Button icon='mdiMagnify' onClick={() => st.toggleFullLibrary()}>
                Browse
            </Button>
            <IndexAllAppsBtnUI />
        </div>
    )
})
