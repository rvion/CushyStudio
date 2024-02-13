import { observer } from 'mobx-react-lite'
import { Dropdown } from 'src/rsuite/Dropdown'
import { JsonViewUI } from 'src/widgets/workspace/JsonViewUI'
import { useSt } from '../../state/stateContext'

export const MenuAuthUI = observer(function MenuAuthUI_(p: {}) {
    const st = useSt()

    const avatar = st.auth.avatar ? (
        <img tw='rounded' style={{ width: '1.2rem', height: '1.2rem' }} src={st.auth.avatar} alt='user avatar' />
    ) : (
        <span className='material-symbols-outlined'>person</span>
    )

    const username = st.auth.isConnected ? ( //
        <div tw='flex items-center'>{st.auth.username}</div>
    ) : (
        'Login'
    )
    console.log(`[🔑 AUTH] ui updating: isConnected =`, st.auth.isConnected)
    return (
        <Dropdown
            // tw={[isConnected ? null : 'text-warning-content bg-warning']}
            startIcon={avatar}
            title={username}
        >
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
                {st.auth.user && (
                    // <RevealUI>
                    //     <div tw='btn btn-ghost'>
                    //         <span className='material-symbols-outlined'>info</span>
                    //         Infos
                    //     </div>
                    <JsonViewUI value={st.auth.user} />
                    // {/* </RevealUI> */}
                )}
            </div>
        </Dropdown>
    )
})
