import { observer } from 'mobx-react-lite'

import { Dropdown } from '../../rsuite/dropdown/Dropdown'
import { useSt } from '../../state/stateContext'
import { JsonViewUI } from '../../widgets/workspace/JsonViewUI'

export const MenuAuthUI = observer(function MenuAuthUI_(p: {}) {
    const st = useSt()
    const username = st.auth.isConnected ? <div tw='flex items-center'>{st.auth.username}</div> : 'Login'
    const avatar = st.auth.avatar ? (
        <img tw='rounded' style={{ width: '1rem', height: '1rem' }} src={st.auth.avatar} alt='user avatar' />
    ) : (
        <span className='material-symbols-outlined'>person</span>
    )

    console.log(`[🔑 AUTH] ui updating: isConnected =`, st.auth.isConnected)
    return (
        <Dropdown
            startIcon={avatar == null ? 'mdiLoginVariant' : undefined}
            title={username}
            content={() => (
                <div tw='flex flex-col'>
                    {st.auth.isConnected ? (
                        <div onClick={() => st.auth.logout()} tw='btn btn-sm btn-outline btn-error'>
                            LogOut
                        </div>
                    ) : (
                        <div
                            tw='btn'
                            onClick={() => {
                                st.auth.startLoginFlowWithGithub()
                            }}
                        >
                            login
                        </div>
                    )}
                    {st.auth.user && <JsonViewUI value={st.auth.user} />}
                </div>
            )}
        />
    )
})
