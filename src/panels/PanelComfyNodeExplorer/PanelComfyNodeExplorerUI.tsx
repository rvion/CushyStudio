import type { NO_PROPS } from '../../csuite/types/NO_PROPS'

import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'

import { getColorForInputNameInComfy, getColorForOutputNameInCushy } from '../../core/Colors'
import { InputLegacy } from '../../csuite/inputs/shims'
import { ComfyNodeExplorerState } from './ComfyNodeExplorerState'

export const PanelComfyNodeExplorerUI = observer(function PanelComfyNodeExplorerUI_(p: NO_PROPS) {
   const pj = cushy.getProject()
   const search = useMemo(() => new ComfyNodeExplorerState(pj), [])
   const repo = cushy.comfyAddons
   return (
      <div className='_MD flex flex-col'>
         <table
            //
            cellPadding={0}
            cellSpacing={0}
            className='table-zebra-zebra table-zebra table-sm table'
         >
            <thead tw='sticky top-0 z-40'>
               <tr>
                  <th>
                     <div>name</div>
                     <InputLegacy value={search.name} onChange={(ev) => (search.name = ev.target.value)} />
                  </th>
                  <th>Found in...</th>
                  <th>
                     <div>input</div>
                     <InputLegacy value={search.input} onChange={(ev) => (search.input = ev.target.value)} />
                  </th>
                  <th>
                     <div>output</div>
                     <InputLegacy
                        value={search.output}
                        onChange={(ev) => (search.output = ev.target.value)}
                     />
                  </th>
                  <th>
                     <div>category</div>
                     <InputLegacy
                        value={search.category}
                        onChange={(ev) => (search.category = ev.target.value)}
                     />
                  </th>
               </tr>
            </thead>
            <tbody>
               {search.matches.map(([name, node], ix) => {
                  return (
                     <tr key={`${name}#${ix}`}>
                        <td tw='whitespace-pre-wrap'>
                           {node.nameInComfy}
                           {/* {name} */}
                        </td>
                        <td>
                           🔴
                           {/* {repo.plugins_byNodeNameInComfy
                              .get(node.nameInComfy)
                              ?.map((x) => x.title)
                              .join(', ')} */}
                        </td>
                        <td tw='whitespace-pre-wrap'>
                           <div tw='flex flex-wrap gap-0.5'>
                              {node.inputs.map((i) => (
                                 <span
                                    style={{ background: getColorForInputNameInComfy(i.nameInComfy) }}
                                    tw='rounded bg-gray-700 p-0.5'
                                 >
                                    {i.nameInComfy}
                                 </span>
                              ))}
                           </div>
                        </td>
                        <td>
                           <div tw='flex flex-wrap gap-0.5'>
                              {node.outputs.map((o) => (
                                 <span
                                    style={{ background: getColorForOutputNameInCushy(o.nameInCushy) }}
                                    tw='rounded bg-gray-700 p-0.5'
                                 >
                                    {o.nameInCushy}
                                 </span>
                              ))}
                           </div>
                        </td>
                        <td>{node.category}</td>
                     </tr>
                  )
               })}
            </tbody>
         </table>
      </div>
   )
})
