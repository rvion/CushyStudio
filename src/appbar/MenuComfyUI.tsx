import { openFolderInOS } from '../app/layout/openExternal'
import { Button } from '../csuite/button/Button'
import { MenuDivider } from '../csuite/dropdown/MenuDivider'
import { defineMenu, type Menu } from '../csuite/menu/Menu'
import { panels } from '../router/PANELS'

export const menuComfyUI2: Menu = defineMenu({
   title: 'ComfyUI',
   entries: (b) => [
      //
      ...panels.ComfyUI.menuEntries,
      ...panels['ComfyUI Node Explorer'].menuEntries,
      menuDivider,
      b.SimpleMenuAction({
         label: 'Hosts',
         onClick: () => cushy.layout.open('Hosts', {}),
         icon: 'mdiServerNetwork',
      }),
      ...cushy.hosts.map((host) => {
         return b.SimpleMenuAction({
            icon: 'mdiServerNetwork',
            label: host.data.name,
            onClick: () => host.electAsPrimary(),
         })
      }),
   ],
})

const menuDivider = (
   <MenuDivider>
      <div
         tw='flex' // TODO(bird_d: JOINER)
      >
         <Button
            icon='mdiClipboard'
            onClick={() => {
               void navigator.clipboard.writeText(cushy.configFile.value.mainComfyHostID ?? '')
            }}
         >
            Primary Host
         </Button>
         <Button
            icon='mdiFolderOpen'
            onClick={(ev) => {
               ev.stopPropagation()
               ev.preventDefault()
               return openFolderInOS(
                  `${cushy.rootPath}/schema/hosts/${cushy.configFile.value.mainComfyHostID}` as AbsolutePath,
               )
            }}
         />
      </div>
   </MenuDivider>
)

// export const MenuComfyUI = observer(function MenuComfyUI_(p: {}) {
//     const st = useSt()
//     const isConnected = st.ws?.isOpen ?? false
//     return (
//         <Dropdown
//             tw={[isConnected ? null : 'text-error-content bg-error']}
//             theme={isConnected ? undefined : { chroma: 0.1, hue: 0, contrast: 1 }}
//             title='ComfyUI'
//             content={() => (
//                 <>
//                     <MenuItem onClick={() => st.layout.open('ComfyUI', {})} label='ComfyUI' icon={'cdiNodes'} />
//                     <MenuItem //
//                         icon='mdiMagnify'
//                         onClick={() => st.layout.open('ComfyUINodeExplorer', {})}
//                         label='Nodes Explorer'
//                     />
//                     {menuDivider}
//                     <HostMenuItemUI host={st.mainHost} />
//                     <MenuDivider>
//                         <Button //
//                             subtle
//                             borderless
//                             onClick={() => cushy.layout.open('Hosts', {})}
//                             icon='mdiOpenInApp'
//                             children='Hosts'
//                         />
//                     </MenuDivider>
//                     {st.hosts.map((host) => {
//                         return <HostMenuItemUI key={host.id} host={host} />
//                     })}
//                 </>
//             )}
//         />
//     )
// })

// const HostMenuItemUI = observer(function HostMenuItemUI_(p: { host: HostL }) {
//     const host = p.host
//     const isMain = host.id === cushy.configFile.value.mainComfyHostID
//     return (
//         <MenuItem //
//             icon='mdiServerNetwork'
//             // icon={isMain ? 'mdiServerNetwork' : null}
//             onClick={() => host.electAsPrimary()}
//             afterShortcut={
//                 <Button
//                     subtle
//                     icon='cdiNodes'
//                     onClick={(ev) => {
//                         ev.preventDefault()
//                         ev.stopPropagation()
//                         cushy.layout.open('ComfyUI', {})
//                     }}
//                 />
//             }
//         >
//             <div tw='flex-grow pr-3'>{host.data.name}</div>
//         </MenuItem>
//     )
// })
