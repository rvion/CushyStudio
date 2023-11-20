import { observer } from 'mobx-react-lite'
import { Button } from 'src/rsuite/shims'
import { assets } from 'src/utils/assets/assets'
import { useSt } from '../../state/stateContext'
import { UpdateBtnUI } from '../updater/UpdateBtnUI'
import { MainNavBarUI } from './MainNavBarUI'
import { SchemaIndicatorUI } from '../layout/SchemaIndicatorUI'
import { WebsocketIndicatorUI } from '../layout/WebsocketIndicatorUI'
import { openExternal } from '../layout/openExternal'

export const AppBarUI = observer(function AppBarUI_(p: {}) {
    const st = useSt()
    return (
        <div
            tw='overflow-auto'
            id='CushyAppBar'
            // style={{ borderBottom: '1px solid #2b2b2b' }}
        >
            <div
                // style={{ borderBottom: '1px solid #2b2b2b' }}
                tw='flex items-center gap-0.5 px-1 overflow-visible'
            >
                <img style={{ width: '1.6rem' }} src={assets.public_CushyLogo_512_png} alt='' />
                <div tw='whitespace-nowrap px-2 text-xl'>CushyStudio</div>
                <MainNavBarUI />

                <div className='flex flex-grow'></div>
                <WebsocketIndicatorUI />
                <SchemaIndicatorUI />
                <UpdateBtnUI updater={st.updater} />
                <CushyStudioLinkUI />
                <label tw='swap swap-flip text-2xl'>
                    <input type='checkbox' />
                    <div tw='swap-on'>😈</div>
                    <div tw='swap-off'>😇</div>
                </label>
            </div>
            {/* <MainNavBarUI /> */}
        </div>
    )
})

export const CushyStudioLinkUI = observer(function CushyStudioLinkUI_(p: {}) {
    return (
        <Button
            tw='self-start flex-shrink-0'
            appearance='subtle'
            size='sm'
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
            size='sm'
            appearance='subtle'
            color={color}
            onClick={() => st.db.reset()}
            icon={<span className='text-orange-500 material-symbols-outlined'>sync</span>}
            // startIcon={<span className='material-symbols-outlined'>power_settings_new</span>}
        >
            DB ({dbHealth.sizeTxt})
        </Button>
    )
})

export const OpenComfyExternalUI = observer(function OpenComfyExternalUI_(p: {}) {
    const st = useSt()
    return (
        <Button
            size='sm'
            appearance='subtle'
            className='self-start'
            icon={<span className='material-symbols-outlined'>open_in_new</span>}
            onClick={() => openExternal(st.getServerHostHTTP())}
            // endIcon={}
        >
            {/* ComfyUI Web */}
        </Button>
    )
})
