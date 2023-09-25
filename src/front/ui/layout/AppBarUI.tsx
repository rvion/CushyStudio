import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { Button, IconButton, Loader } from 'rsuite'
import { useSt } from '../../FrontStateCtx'

export const AppBarUI = observer(function AppBarUI_(p: {}) {
    const st = useSt()
    return (
        <div className='flex  gap-2 w-full'>
            {/* <Nav.Item eventKey='home'></Nav.Item> */}
            {/* <InputGroup.Addon>🛋️</InputGroup.Addon> */}
            <Button size='sm' startIcon={<I.FolderFill />} onClick={() => st.createFolder()}>
                Add folder
            </Button>
            <Button loading={Boolean(st.db.saveTimeout)} size='sm' startIcon={<I.Android />} onClick={() => st.db.markDirty()}>
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
            <IconButton size='sm' icon={<I.Reload />} onClick={() => window.location.reload()} />
            <IconButton
                size='sm'
                icon={st.cushyStatus?.connected ? <I.CheckRound color='green' /> : <I.ExpiredRound color='red' />}
            />
            <IconButton size='sm' onClick={() => st.db.reset()} icon={<I.Trash color='orange' />} />
            {/* <Button startIcon={<I.AddOutline />} size='sm' className='self-start' onClick={() => st.startProject()}>
                create project
            </Button> */}
            <Button
                // startIcon={<I.AddOutline />}
                size='sm'
                className='self-start'
                onClick={() => {
                    window.require('electron').shell.openExternal(st.getServerHostHTTP())
                }}
            >
                Open ComfyUI in Web
            </Button>
            {/* biegert/ComfyUI-CLIPSeg */}
            {st.schemaReady.done ? null : (
                <div className='flex gap-2'>
                    <Loader />
                    <div>loading schema</div>
                </div>
            )}
        </div>
    )
})
