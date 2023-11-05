import { observer } from 'mobx-react-lite'
import { ReactNode, useMemo } from 'react'
import { Button, Input, InputGroup, Popover, Tag, Whisper } from 'rsuite'
import { assets } from 'src/assets/assets'
import { useSt } from '../../FrontStateCtx'
import { CreateDeckModalState, CreateDeckModalUI } from './CreateDeckModalUI'

export const CreateDeckBtnUI = observer(function CreateDeckBtnUI_(p: {}) {
    const uist = useMemo(() => new CreateDeckModalState(), [])
    return (
        <div>
            <Button
                onClick={uist.handleOpen}
                // tw='w-full'
                appearance='primary'
                color='green'
                startIcon={<span className='material-symbols-outlined'>add</span>}
            >
                Create my own Deck
            </Button>
            <CreateDeckModalUI uist={uist} />
        </div>
    )
})

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
