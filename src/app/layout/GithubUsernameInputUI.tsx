import { observer } from 'mobx-react-lite'
import { ReactNode } from 'react'
import { Input, InputGroup, Popover, Tag, Whisper } from 'rsuite'
import { assets } from 'src/utils/assets/assets'
import { useSt } from '../../state/stateContext'

export type RsuiteSize = 'lg' | 'md' | 'sm' | 'xs'
export const GithubUsernameInputUI = observer(function GithubUsernameInputUI_(p: {
    //
    children?: ReactNode
}) {
    const st = useSt()
    const githubUsername = st.configFile.value.githubUsername || '<your-github-username>'
    return (
        <InputGroup tw='w-auto'>
            <InputGroup.Addon>
                <img src={assets.public_GithubLogo2_png} alt='Github Logo' style={{ width: '1.4rem', height: '1.4rem' }} />
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
            </InputGroup.Addon>
            <Input
                onChange={(next) => {
                    st.configFile.update({ githubUsername: next })
                    st.updateTsConfig()
                }}
                value={githubUsername}
                // tw='font-mono'
                // style={{ width: `${githubUsername.length + 4}ch` }}
                placeholder='your github username'
            ></Input>
        </InputGroup>
    )
})
