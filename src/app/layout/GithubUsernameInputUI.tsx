import { observer } from 'mobx-react-lite'
import { ReactNode } from 'react'

import { useSt } from '../../state/stateContext'
import { Addon, Input, Joined, Popover, Tag, Whisper } from 'src/rsuite/shims'
import { assets } from 'src/utils/assets/assets'

export type RsuiteSize = 'lg' | 'md' | 'sm' | 'xs'
export const GithubUsernameInputUI = observer(function GithubUsernameInputUI_(p: {
    //
    children?: ReactNode
}) {
    const st = useSt()
    const githubUsername = st.configFile.value.githubUsername || '<your-github-username>'
    return (
        <Joined tw='w-auto join'>
            <Addon>
                <img src={assets.GithubLogo2_png} alt='Github Logo' style={{ width: '1.4rem', height: '1.4rem' }} />
                <Whisper
                    //
                    enterable
                    placement='bottomStart'
                    speaker={
                        <Popover>
                            <div>
                                Only folders in
                                <Tag>library/{githubUsername}/</Tag>
                                will have type-checking in your vscode
                            </div>
                        </Popover>
                    }
                >
                    <div>your github:</div>
                </Whisper>
            </Addon>
            <input
                tw='input input-sm input-bordered join-item'
                onChange={(ev) => {
                    st.configFile.update({ githubUsername: ev.target.value })
                    st.updateTsConfig()
                }}
                value={githubUsername}
                // tw='font-mono'
                // style={{ width: `${githubUsername.length + 4}ch` }}
                placeholder='your github username'
            ></input>
        </Joined>
    )
})
