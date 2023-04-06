// import * as I from '@rsuite/icons'
// import { observer } from 'mobx-react-lite'
// import { useCushyStudio } from '../cushy/CushyContext'
// import { NewProjectModalUI } from '../menu/NewProjectModalUI'
// import { useWorkspace } from './WorkspaceContext'
// import { ButtonToolbar, IconButton } from 'rsuite'

// export const WorkspaceToolbarUI = observer(function WorkspaceToolbarUI_(p: {}) {
//     const cushy = useCushyStudio()
//     const client = useWorkspace()
//     const project = client.focusedProject

//     return (
//         <ButtonToolbar>
//             {/* <MenuItem icon={<I.AddOutline />}>New </MenuItem> */}
//             <IconButton
//                 size='sm'
//                 icon={<I.MoveDown />}
//                 onClick={() => {
//                     //
//                     throw new Error('not implemented')
//                     // const editor = client.editor.editorRef.current
//                     // if (editor == null) return console.log('❌ editor is null')
//                     // const otps = editor.getRawOptions().wordWrap
//                     // editor.updateOptions({ wordWrap: otps === 'off' ? 'on' : 'off' })
//                 }}
//                 aria-label='Toogle word wrap'
//             />
//             <IconButton size='sm' icon={<I.Close />} onClick={cushy.closeWorkspace}>
//                 Close workspace
//             </IconButton>
//             <IconButton
//                 size='sm'
//                 aria-label='Increase Font Size'
//                 icon={<I.Phone />}
//                 onClick={async () => {
//                     window.location.reload()
//                     // may not correctly work
//                     // const { relaunch } = await import('@tauri-apps/api/process')
//                     // await relaunch()
//                 }}
//             >
//                 Restart
//             </IconButton>
//         </ButtonToolbar>
//     )
// })
// export const ProjectToolbarUI = observer(function ToolbarUI_(p: {}) {
//     const cushy = useCushyStudio()
//     const client = useWorkspace()
//     const project = client.focusedProject
//     return (
//         <ButtonToolbar>
//             <IconButton
//                 size='sm'
//                 disabled={project == null}
//                 aria-label='Play'
//                 appearance='primary'
//                 icon={<I.PlayOutline />}
//                 onClick={() => project?.RUN('real')}
//             />
//             <IconButton
//                 size='sm'
//                 disabled={project == null}
//                 aria-label='Play (fake)'
//                 icon={<I.RunningRound />}
//                 onClick={() => project?.RUN('fake')}
//             />
//             {/* <IconButton aria-label='Reset Font Size' icon={<I.TextFont24Regular />} /> */}
//             {/* <hr /> */}
//             {/* <Menu>
//                 <MenuTrigger>
//                     <ToolbarButton aria-label='More' icon={<I.More />} />
//                 </MenuTrigger>

//                 <MenuPopover>
//                     <MenuList>
//                         <MenuItem disabled>New Window</MenuItem>
//                         <MenuItem disabled>Open File</MenuItem>
//                         <MenuItem disabled>Open Folder</MenuItem>
//                     </MenuList>
//                 </MenuPopover>
//             </Menu> */}
//         </ButtonToolbar>
//     )
// })
