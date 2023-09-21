import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { Button, ButtonGroup, IconButton, InputGroup, Nav } from 'rsuite'
import { useSt } from '../../FrontStateCtx'

export const AppBarUI = observer(function AppBarUI_(p: {}) {
    const st = useSt()
    return (
        <InputGroup>
            {/* <Nav.Item eventKey='home'></Nav.Item> */}
            <InputGroup.Addon>🛋️</InputGroup.Addon>
            <Button size='sm' startIcon={<I.FolderFill />} onClick={() => st.createFolder()}>
                Add
            </Button>
            <IconButton
                icon={st.showAllMessageReceived ? <I.InfoOutline /> : <I.EyeClose />}
                onClick={() => (st.showAllMessageReceived = !st.showAllMessageReceived)}
            />
            <IconButton size='sm' icon={<I.Reload />} onClick={() => window.location.reload()} />
            <IconButton
                size='sm'
                icon={st.cushyStatus?.connected ? <I.CheckRound color='green' /> : <I.ExpiredRound color='red' />}
            />
            <IconButton size='sm' onClick={() => st.db.reset()} icon={<I.Trash color='orange' />} />
            <Button startIcon={<I.AddOutline />} size='sm' className='self-start' onClick={() => st.startProject()}>
                create project
            </Button>
            <Button
                startIcon={<I.AddOutline />}
                size='sm'
                className='self-start'
                onClick={() => {
                    window.require('electron').shell.openExternal(st.getServerHostHTTP())
                }}
            >
                Open ComfyUI
            </Button>
            {/* biegert/ComfyUI-CLIPSeg */}
        </InputGroup>
    )
})
