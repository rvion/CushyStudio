import { observer } from 'mobx-react-lite'
import { ReactNode, useMemo } from 'react'
import { Input, InputGroup, Popover, Tag, Whisper } from 'rsuite'
import { assets } from 'src/assets/assets'
import { useSt } from '../../FrontStateCtx'
import { CreateDeckModalState, CreateDeckModalUI } from './CreateDeckModalUI'

export type RsuiteSize = 'lg' | 'md' | 'sm' | 'xs'
export const GithubUsernameInputUI = observer(function GithubUsernameInputUI_(p: {
    //
    size?: RsuiteSize
    children?: ReactNode
}) {
    const st = useSt()
    const githubUsername = st.configFile.value.githubUsername || '<your-github-username>'
    // const [open, setOpen] = useState(false)
    // const handleOpen = () => setOpen(true)
    // const handleClose = () => setOpen(false)
    const uist = useMemo(() => new CreateDeckModalState(), [])
    return (
        <>
            <InputGroup
                //
                size={p.size ?? 'sm'}
                tw='w-auto'
            >
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
                                    <Tag>actions/{githubUsername}/</Tag>
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
                <InputGroup.Button
                    onClick={uist.handleOpen}
                    tw='bg-green-600'
                    appearance='primary'
                    color='green'
                    startIcon={<span className='material-symbols-outlined'>add</span>}
                >
                    Create Deck
                </InputGroup.Button>
            </InputGroup>
            <CreateDeckModalUI uist={uist} />
        </>
    )
})
