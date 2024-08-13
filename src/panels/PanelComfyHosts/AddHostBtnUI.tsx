import { observer } from 'mobx-react-lite'
import { resolve } from 'pathe'

import { Button } from '../../csuite/button/Button'
import { SQLITE_false } from '../../csuite/types/SQLITE_boolean'
import { useSt } from '../../state/stateContext'
import { asAbsolutePath } from '../../utils/fs/pathUtils'

export const AddHostBtnUI = observer(function AddHostBtnUI_(p: {}) {
    const st = useSt()
    return (
        <Button
            icon='mdiPlus'
            look='primary'
            onClick={() => {
                st.configFile.update(() => {
                    st.db.host.create({
                        hostname: '192.168.1.19',
                        port: 8188,
                        name: '192.168.1.19',
                        isLocal: SQLITE_false,
                        useHttps: SQLITE_false,
                        absolutePathToComfyUI: asAbsolutePath(resolve('comfy')),
                        isVirtual: SQLITE_false,
                        isReadonly: SQLITE_false,
                    })
                })
            }}
        >
            Add Host
        </Button>
    )
})
