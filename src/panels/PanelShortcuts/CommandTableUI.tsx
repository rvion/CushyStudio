import { observer } from 'mobx-react-lite'

import { ComboUI } from '../../csuite/accelerators/ComboUI'
import { BadgeUI } from '../../csuite/badge/BadgeUI'
import { commandManager } from '../../csuite/commands/CommandManager'
import { Frame } from '../../csuite/frame/Frame'
import { CommandContextDebugUI } from './CommandContextDebugUI'
import { CommandHistoryTableUI } from './CommandHistoryTableUI'

export const CommandTableUI = observer(function CommandTableUI_(p: {}) {
   return (
      <div tw='x_MD flex flex-col gap-2'>
         {/* <Frame row wrap tw='gap-2'> */}
         <CommandContextDebugUI border base tw='p-2' />
         <CommandHistoryTableUI border base tw='p-2' />
         {/* </Frame> */}
         <table>
            <Frame as='thead' base={10}>
               <tr>
                  <th>id</th>
                  <th>context</th>
                  <th>shortcut</th>
                  <th>commands</th>
               </tr>
            </Frame>
            <tbody>
               {[...commandManager.commands.values()].map((c, ix) => {
                  return (
                     <Frame as='tr' key={c.id} base={ix % 2 === 0 ? 5 : 0}>
                        <td tw='flex-1'>{c.id}</td>
                        <td tw='flex-1'>
                           <BadgeUI autoHue children={c.ctx.name} />
                        </td>
                        <td tw='flex-1'>{c.label}</td>
                        <td>
                           {c.combos == null ? (
                              <Frame line disabled icon='mdiCancel'>
                                 none
                              </Frame>
                           ) : Array.isArray(c.combos) ? (
                              c.combos.map((cc) => <ComboUI key={cc} combo={cc} />)
                           ) : (
                              <ComboUI combo={c.combos} />
                           )}
                        </td>
                     </Frame>
                  )
               })}
            </tbody>
         </table>
      </div>
   )
})
