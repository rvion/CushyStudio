import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { observer } from 'mobx-react-lite'
import { Dropdown } from 'src/rsuite/Dropdown'
import { useSt } from '../../state/stateContext'

export const MenuAuthUI = observer(function MenuAuthUI_(p: {}) {
    const st = useSt()
    const isConnected = st.auth.isConnected
    const avatar = st.auth.avatar ? (
        <img tw='rounded' style={{ width: '1.2rem', height: '1.2rem' }} src={st.auth.avatar} alt='user avatar' />
    ) : (
        <span className='material-symbols-outlined'>person</span>
    )
    const username = !st.auth.isConnected ? (
        'LOGIN'
    ) : (
        <div
            tw='flex items-center'
            onClick={async () => {
                console.log(await st.supabase.auth.getSession())
                const res = await st.supabase.auth.getUser()
                console.log(res.data.user)
            }}
        >
            {st.auth.username ?? '---'}
        </div>
    )

    return (
        <Dropdown
            // tw={[isConnected ? null : 'text-warning-content bg-warning']}
            startIcon={avatar}
            title={username}
            appearance='subtle'
        >
            {st.auth.isConnected ? (
                <div>
                    <div onClick={() => st.supabase.auth.signOut()} tw='btn'>
                        Log-Out
                    </div>
                </div>
            ) : (
                <div tw='w-96 px-8'>
                    <Auth
                        providers={[
                            //
                            'github',
                            // 'google',
                            // 'facebook',
                            // 'twitter',
                        ]}
                        appearance={{ theme: ThemeSupa }}
                        supabaseClient={st.supabase}
                    />
                </div>
            )}
        </Dropdown>
    )
})

// // <RevealUI disableHover>
// {
//     /* </RevealUI> */
// }
// // <RevealUI disableHover>
// // <div>LOGIN</div>
// // </RevealUI>
// {
//     /* <div
//                     tw='btn'
//                     onClick={() => {
//                         st.startLoginFlowWithGithub()
//                     }}
//                 >
//                     login
//                 </div> */
// }

/* <MenuItem
    onClick={() => st.layout.FOCUS_OR_CREATE('ComfyUI', {})}
    label='Comfy'
    icon={<span className='material-symbols-outlined text-cyan-400'>account_tree</span>}
/> */
