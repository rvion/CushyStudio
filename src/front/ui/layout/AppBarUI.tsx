import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { Button, ButtonGroup, IconButton, InputGroup, SelectPicker } from 'rsuite'
import { useSt } from '../../FrontStateCtx'
import { SchemaIndicatorUI } from './SchemaIndicatorUI'
import { UpdateBtnUI } from './UpdateBtnUI'
import { WebsocketIndicatorUI } from './WebsocketIndicatorUI'

export const AppBarUI = observer(function AppBarUI_(p: {}) {
    const st = useSt()
    return (
        // bg-gray-950
        <div
            //
            id='CushyAppBar'
            className='flex gap-1 items-center'
            style={{
                borderBottom: '1px solid #383838',
            }}
        >
            <div>🛋️ CushyStudio</div>

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
            <IconButton
                icon={
                    <span
                        //
                        className='material-symbols-outlined'
                    >
                        {st.theme.theme === 'light' ? 'highlight' : 'nights_stay'}
                    </span>
                }
                onClick={() => (st.theme.theme = st.theme.theme === 'light' ? 'dark' : 'light')}
            ></IconButton>
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

            <div tw='flex'>
                <div>
                    <SelectPicker
                        //

                        value={st.layout.currentPerspectiveName}
                        data={st.layout.allPerspectives}
                    />
                </div>
                <Button
                    //
                    size='xs'
                    // appearance='subtle'
                    startIcon={<I.Reload />}
                    onClick={() => st.layout.resetDefault()}
                >
                    Reset
                </Button>
            </div>
            {/* <IconButton
                size='sm'
                appearance='subtle'
                icon={st.cushyStatus?.connected ? <I.CheckRound color='green' /> : <I.ExpiredRound color='red' />}
            /> */}

            <UpdateBtnUI />
            <WebsocketIndicatorUI />
            <SchemaIndicatorUI />

            {/* <Button startIcon={<I.AddOutline />} size='sm' className='self-start' onClick={() => st.startProject()}>
                create project
            </Button> */}
            <div className='flex-grow'></div>
            <DBHealthUI />
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

export const DBHealthUI = observer(function DBHealthUI_(p: {}) {
    const st = useSt()
    const dbHealth = st.db.health
    const color = dbHealth.status === 'bad' ? 'red' : dbHealth.status === 'meh' ? 'yellow' : 'green'
    return (
        <div>
            <Button
                //
                size='sm'
                // appearance='subtle'
                color={color}
                onClick={() => st.db.reset()}
                startIcon={<span className='material-symbols-outlined'>power_settings_new</span>}
            >
                Reset DB ({dbHealth.sizeTxt})
            </Button>
        </div>
    )
})
