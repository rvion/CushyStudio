import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { Button, IconButton, Loader } from 'rsuite'
import { useSt } from '../../FrontStateCtx'
import { WebsocketIndicatorUI } from './WebsocketIndicatorUI'
import { SchemaIndicatorUI } from './SchemaIndicatorUI'

export const AppBarUI = observer(function AppBarUI_(p: {}) {
    const st = useSt()
    return (
        <div className='bg-gray-950 p-2 flex gap-1 items-center' style={{ borderBottom: '1px solid #383838' }}>
            <div className='text-green-400'>🛋️ CushyStudio</div>

            {/* <Button
                //
                appearance='subtle'
                size='sm'
                startIcon={<span className='material-symbols-outlined'>create_new_folder</span>}
                onClick={() => st.createFolder()}
            >
                Add folder
            </Button> */}
            <Button
                appearance='subtle'
                loading={Boolean(st.db.saveTimeout)}
                size='sm'
                startIcon={<span className='material-symbols-outlined'>save</span>}
                onClick={() => st.db.markDirty()}
            >
                save
            </Button>
            {/* <Button
                //
                size='sm'
                startIcon={<I.ExpandOutline />}
                onClick={() => {
                    //
                    // console.log(window)
                }}
            >
                ComfyV2
            </Button> */}
            {/* <IconButton
                icon={st.showAllMessageReceived ? <I.InfoOutline /> : <I.EyeClose />}
                onClick={() => (st.showAllMessageReceived = !st.showAllMessageReceived)}
            /> */}
            <Button
                //
                size='sm'
                appearance='subtle'
                startIcon={<I.Reload />}
                onClick={() => window.location.reload()}
            >
                Reload
            </Button>
            {/* <IconButton
                size='sm'
                appearance='subtle'
                icon={st.cushyStatus?.connected ? <I.CheckRound color='green' /> : <I.ExpiredRound color='red' />}
            /> */}

            {st.updater.updateAvailable ? (
                <Button
                    className='animate-pulse'
                    color='orange'
                    appearance='primary'
                    startIcon={<span className='material-symbols-outlined'>update</span>}
                    onClick={async () => {
                        await st.updater.updateToLastCommitAvailable()
                        window.location.reload()
                    }}
                >
                    UPDATE to version {st.updater.nextVersion}
                </Button>
            ) : (
                <span className='text-green-400 material-symbols-outlined'>check_circle</span>
            )}
            <div className={st.updater.updateAvailable ? 'text-orange-400' : 'text-green-400'}>
                version {st.updater.commitCountOnHead ? st.updater.currentVersion : <Loader />}
            </div>

            <Button
                //
                size='sm'
                appearance='subtle'
                color='red'
                onClick={() => st.db.reset()}
                startIcon={<span className='material-symbols-outlined'>power_settings_new</span>}
            >
                Reset DB
            </Button>
            {/* <Button startIcon={<I.AddOutline />} size='sm' className='self-start' onClick={() => st.startProject()}>
                create project
            </Button> */}
            <div className='flex-grow'></div>
            {/* <Button
                // startIcon={<I.AddOutline />}
                size='sm'
                appearance='subtle'
                className='self-start'
                endIcon={<span className='material-symbols-outlined'>open_in_new</span>}
                onClick={() => {
                    window.require('electron').shell.openExternal(st.getServerHostHTTP())
                }}
            >
                ComfyUI Web
            </Button> */}
            {/* biegert/ComfyUI-CLIPSeg */}

            <WebsocketIndicatorUI />
            <SchemaIndicatorUI />
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
                <span className='underline text-blue-300'>github.com/rvion/CushyStudio</span>
            </a>
        </div>
    )
})
