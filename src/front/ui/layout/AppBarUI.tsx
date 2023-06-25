import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { Button, IconButton, Nav } from 'rsuite'
import { useSt } from '../../FrontStateCtx'

export const AppBarUI = observer(function AppBarUI_(p: {}) {
    const st = useSt()
    return (
        <Nav appearance='subtle'>
            <Nav.Item eventKey='home'>🛋️</Nav.Item>
            <Button startIcon={<I.FolderFill />} onClick={() => st.createFolder()}>
                Add
            </Button>
            <Button
                size='sm'
                startIcon={st.flowDirection === 'down' ? <I.SortDown /> : <I.SortUp />}
                onClick={() => (st.flowDirection = st.flowDirection === 'down' ? 'up' : 'down')}
            >
                Sort
            </Button>
            <IconButton
                icon={st.showAllMessageReceived ? <I.InfoOutline /> : <I.EyeClose />}
                onClick={() => (st.showAllMessageReceived = !st.showAllMessageReceived)}
            />
            <IconButton icon={<I.Reload />} onClick={() => window.location.reload()} />
            <IconButton icon={st.cushyStatus?.connected ? <I.CheckRound color='green' /> : <I.ExpiredRound color='red' />} />
            <IconButton onClick={() => st.db.reset()} icon={<I.Trash color='orange' />} />
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
        </Nav>
    )
})
