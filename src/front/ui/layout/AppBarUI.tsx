import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { Button, IconButton, Input, InputGroup, Popover, Tag, Whisper } from 'rsuite'
import { useSt } from '../../FrontStateCtx'
import { SchemaIndicatorUI } from './SchemaIndicatorUI'
import { UpdateBtnUI } from './UpdateBtnUI'
import { WebsocketIndicatorUI } from './WebsocketIndicatorUI'
import { assets } from 'src/assets/assets'

export const AppBarUI = observer(function AppBarUI_(p: {}) {
    const st = useSt()
    const themeIcon = st.theme.theme === 'light' ? 'highlight' : 'nights_stay'
    return (
        <div
            //
            id='CushyAppBar'
            className='flex gap-1 items-center'
            style={{ borderBottom: '1px solid #383838' }}
        >
            <CushyStudioLinkUI />
            <Button
                appearance='subtle'
                loading={Boolean(st.db.saveTimeout)}
                size='sm'
                startIcon={<span className='material-symbols-outlined'>save</span>}
                onClick={() => st.db.markDirty()}
            >
                save
            </Button>
            <GithubAppBarInputUI />
            <Button
                //
                size='sm'
                appearance='subtle'
                startIcon={<I.Reload />}
                onClick={() => window.location.reload()}
            >
                Reload
            </Button>
            <UpdateBtnUI updater={st.updater} />
            <WebsocketIndicatorUI />
            <SchemaIndicatorUI />

            <div className='flex-grow'></div>
            <Button size='xs' appearance='ghost' color='orange' startIcon={<I.Reload />} onClick={() => st.layout.resetCurrent()}>
                Layout
            </Button>
            <DBHealthUI />
            <IconButton
                appearance='ghost'
                size='xs'
                icon={<span className='material-symbols-outlined'>{themeIcon}</span>}
                onClick={() => st.theme.toggle()}
            />
        </div>
    )
})

export const CushyStudioLinkUI = observer(function CushyStudioLinkUI_(p: {}) {
    return (
        <a
            className='ml-auto flex'
            onClick={(ev) => {
                ev.preventDefault()
                ev.stopPropagation()
                window.require('electron').shell.openExternal('https://github.com/rvion/CushyStudio')
            }}
            href='#'
        >
            <span className='material-symbols-outlined text-yellow-600'>star</span>
            <img src={assets.public_GithubLogo2_png} alt='Github Logo' style={{ width: '1.4rem', height: '1.4rem' }} />
            <span className='underline text-blue-300'>rvion/CushyStudio</span>
        </a>
    )
})

export const DBHealthUI = observer(function DBHealthUI_(p: {}) {
    const st = useSt()
    const dbHealth = st.db.health
    const color = dbHealth.status === 'bad' ? 'red' : dbHealth.status === 'meh' ? 'yellow' : 'green'
    return (
        <div>
            <Button
                //
                size='xs'
                appearance='ghost'
                color={color}
                onClick={() => st.db.reset()}
                startIcon={<I.Reload />}
                // startIcon={<span className='material-symbols-outlined'>power_settings_new</span>}
            >
                DB ({dbHealth.sizeTxt})
            </Button>
        </div>
    )
})

export const OpenComfyExternalUI = observer(function OpenComfyExternalUI_(p: {}) {
    const st = useSt()
    return (
        <IconButton
            size='sm'
            appearance='subtle'
            className='self-start'
            icon={<span className='material-symbols-outlined'>open_in_new</span>}
            // endIcon={}
            onClick={() => {
                window.require('electron').shell.openExternal(st.getServerHostHTTP())
            }}
        >
            {/* ComfyUI Web */}
        </IconButton>
    )
})

export const GithubAppBarInputUI = observer(function GithubAppBarInputUI_(p: {}) {
    const st = useSt()
    const githubUsername = st.configFile.value.githubUsername || '<your-github-username>'
    return (
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
            <InputGroup size='xs' tw='w-auto' style={{ border: '1px solid #868516' }}>
                <InputGroup.Addon>
                    <img src={assets.public_GithubLogo2_png} alt='Github Logo' style={{ width: '1.4rem', height: '1.4rem' }} />
                    your github:
                </InputGroup.Addon>
                <Input
                    onChange={(next) => {
                        st.configFile.update({ githubUsername: next })
                        st.updateTsConfig()
                    }}
                    value={githubUsername}
                    tw='font-mono'
                    style={{ width: `${githubUsername.length + 4}ch` }}
                    placeholder='your github username'
                ></Input>
            </InputGroup>
        </Whisper>
    )
})
