import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'

import { BadgeUI } from '../../csuite/badge/BadgeUI'
import { InputStringUI } from '../../csuite/input-string/InputStringUI'
import { RevealUI } from '../../csuite/reveal/RevealUI'
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
                <RevealUI
                    placement='bottomStart'
                    content={() => (
                        <div>
                            <div>
                                Only folders in
                                <BadgeUI>library/{githubUsername}/</BadgeUI>
                                will have type-checking in your vscode
                            </div>
                        </div>
                    )}
                >
                    <div>your github:</div>
                </RevealUI>
            </div>
            <InputStringUI
                tw='csuite-basic-input'
                icon='mdiGithub'
                placeholder='your github username'
                getValue={() => githubUsername}
                setValue={(next) => void st.configFile.update({ githubUsername: next })}
            />
        </div>
    )
})
