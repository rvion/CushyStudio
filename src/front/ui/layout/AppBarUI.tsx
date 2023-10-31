import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { Button, ButtonGroup, IconButton } from 'rsuite'
import { assets } from 'src/assets/assets'
import { useSt } from '../../FrontStateCtx'
import { SchemaIndicatorUI } from './SchemaIndicatorUI'
import { UpdateBtnUI } from './UpdateBtnUI'
import { WebsocketIndicatorUI } from './WebsocketIndicatorUI'

export const AppBarUI = observer(function AppBarUI_(p: {}) {
    const st = useSt()
    // const themeIcon = st.theme.theme === 'light' ? 'highlight' : 'nights_stay'
    return (
        <div
            //
            id='CushyAppBar'
            // style={{ borderBottom: '1px solid #0f0f0f' }}
            tw='flex gap-2 p-1 overflow-auto'
            // style={{ borderBottom: '1px solid #383838' }}
        >
            <div>
                <img tw='p-2' style={{ width: '3rem' }} src={assets.public_CushyLogo_512_png} alt='' />
            </div>
            <div tw='flex-grow'>
                <div className='flex gap-2  items-center'>
                    <CushyStudioLinkUI />
                    <div tw='flex-grow'></div>
                    <ButtonGroup style={{ border: '1px solid gray' }}>
                        <Button
                            //
                            size='xs'
                            appearance='subtle'
                            color='orange'
                            startIcon={<I.Reload />}
                            onClick={() => window.location.reload()}
                        >
                            Reload
                        </Button>
                        <Button //
                            size='xs'
                            appearance='subtle'
                            color='orange'
                            startIcon={<span className='material-symbols-outlined'>bug_report</span>}
                            onClick={() => st.electronUtils.toggleDevTools()}
                        >
                            Open console
                        </Button>
                        <Button
                            size='xs'
                            appearance='subtle'
                            color='orange'
                            startIcon={<I.Reload />}
                            onClick={() => st.layout.resetCurrent()}
                        >
                            Reset Layout
                        </Button>
                    </ButtonGroup>
                </div>
                <div className='flex gap-2  items-center'>
                    {/* <GithubAppBarInputUI /> */}
                    <UpdateBtnUI updater={st.updater} />
                    <WebsocketIndicatorUI />
                    <SchemaIndicatorUI />
                    <div className='flex-grow'></div>
                    <Button
                        appearance='ghost'
                        loading={Boolean(st.db.saveTimeout)}
                        size='xs'
                        startIcon={<span className='material-symbols-outlined'>save</span>}
                        onClick={() => st.db.markDirty()}
                    >
                        save
                    </Button>
                    <DBHealthUI />
                    {/* <Button
                        appearance='ghost'
                        size='xs'
                        startIcon={<span className='material-symbols-outlined'>{themeIcon}</span>}
                        onClick={() => st.theme.toggle()}
                    >
                        Theme
                    </Button> */}
                </div>
            </div>
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
            {/* <span className='material-symbols-outlined text-yellow-600'>star</span> */}
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
