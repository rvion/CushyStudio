import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { Button, ButtonGroup, IconButton } from 'rsuite'
import { assets } from 'src/assets/assets'
import { useSt } from '../../FrontStateCtx'
import { MainNavBarUI } from './MainNavBarUI'
import { SchemaIndicatorUI } from './SchemaIndicatorUI'
import { UpdateBtnUI } from './UpdateBtnUI'
import { WebsocketIndicatorUI } from './WebsocketIndicatorUI'

export const AppBarUI = observer(function AppBarUI_(p: {}) {
    const st = useSt()
    return (
        <div id='CushyAppBar' tw='flex items-center gap-2 px-1 overflow-auto'>
            <div tw='flex py-2 gap-1 self-start'>
                <img style={{ width: '1rem' }} src={assets.public_CushyLogo_512_png} alt='' />
                <div tw='whitespace-nowrap'>Cushy Studio</div>
                <UpdateBtnUI updater={st.updater} />
            </div>
            <MainNavBarUI />
            <div className='flex-grow'></div>
            <DebugButtonsUI />
            <div tw='flex py-2 self-start'>
                <WebsocketIndicatorUI />
                <SchemaIndicatorUI />
            </div>
            <CushyStudioLinkUI />
        </div>
    )
})

export const DebugButtonsUI = observer(function DebugButtonsUI_(p: {}) {
    const st = useSt()
    return (
        <ButtonGroup
            //
            tw='opacity-30 hover:opacity-100'
            // style={{ border: '1px solid gray' }}
        >
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
            <Button
                appearance='subtle'
                loading={Boolean(st.db.saveTimeout)}
                size='xs'
                startIcon={<span className='material-symbols-outlined'>save</span>}
                onClick={() => st.db.markDirty()}
            >
                save
            </Button>
            <DBHealthUI />
        </ButtonGroup>
    )
})

export const CushyStudioLinkUI = observer(function CushyStudioLinkUI_(p: {}) {
    return (
        <Button
            as='a'
            tw='self-start'
            appearance='link'
            href='#'
            onClick={(ev) => {
                ev.preventDefault()
                ev.stopPropagation()
                window.require('electron').shell.openExternal('https://github.com/rvion/CushyStudio')
            }}
        >
            {/* <span className='material-symbols-outlined text-yellow-600'>star</span> */}
            rvion/CushyStudio
            <img src={assets.public_GithubLogo2_png} alt='Github Logo' style={{ width: '1.4rem', height: '1.4rem' }} />
        </Button>
    )
})

export const DBHealthUI = observer(function DBHealthUI_(p: {}) {
    const st = useSt()
    const dbHealth = st.db.health
    const color = dbHealth.status === 'bad' ? 'red' : dbHealth.status === 'meh' ? 'yellow' : 'green'
    return (
        <Button
            //
            size='xs'
            appearance='subtle'
            color={color}
            onClick={() => st.db.reset()}
            startIcon={<I.Reload />}
            // startIcon={<span className='material-symbols-outlined'>power_settings_new</span>}
        >
            DB ({dbHealth.sizeTxt})
        </Button>
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
