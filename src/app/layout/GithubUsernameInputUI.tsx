import { observer } from 'mobx-react-lite'
import { ReactNode } from 'react'

import { Tag, Whisper } from '../../csuite/inputs/shims'
import { useSt } from '../../state/stateContext'
import { assets } from '../../utils/assets/assets'

export type RsuiteSize = 'lg' | 'md' | 'sm' | 'xs'
export const GithubUsernameInputUI = observer(function GithubUsernameInputUI_(p: {
    //
    children?: ReactNode
}) {
    const st = useSt()
    const githubUsername = st.configFile.value.githubUsername || '<your-github-username>'
    return (
        <div tw='w-auto join'>
            <div tw='flex items-center px-2 join-item'>
                <img src={assets.GithubLogo2_png} alt='Github Logo' style={{ width: '1.4rem', height: '1.4rem' }} />
                <Whisper
                    //
                    enterable
                    placement='bottomStart'
                    speaker={
                        <div>
                            <div>
                                Only folders in
                                <Tag>library/{githubUsername}/</Tag>
                                will have type-checking in your vscode
                            </div>
                        </div>
                    }
                >
                    <div>your github:</div>
                </Whisper>
            </div>
            <input
                tw='csuite-basic-input'
                value={githubUsername}
                placeholder='your github username'
                onChange={(ev) => {
                    st.configFile.update({ githubUsername: ev.target.value })
                    st.updateTsConfig()
                }}
            />
        </div>
    )
})
