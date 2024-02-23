import { observer } from 'mobx-react-lite'

// import { TreeValue } from './LabelUI'
// import { useSt } from './stContext'

export const ProjectInfosUI = observer(function ProjectInfosUI_() {
    // const client = useSt()
    // const project = client.project
    return null
    // return (
    //     <div className='col gap1'>
    //         <TreeValue title='Project'>
    //             <select>
    //                 <option value=''>test</option>
    //             </select>
    //         </TreeValue>
    //         <TreeValue title='Name'>
    //             <input //
    //                 type='text'
    //                 value={project.name}
    //                 onChange={(ev) => (project.name = ev.target.value)}
    //             />
    //         </TreeValue>
    //         <TreeValue onClick={() => client.editor.openCODE()} title='code'>
    //             ...
    //         </TreeValue>
    //         <div className='row gap items-baseline'></div>
    //         <TreeValue title='Prompts'>
    //             <div className='col grow gap'>
    //                 <button className='success' onClick={() => project.run()}>
    //                     Eval
    //                 </button>
    //                 <button className='success' onClick={() => project.run('real')}>
    //                     RUN
    //                 </button>
    //             </div>
    //         </TreeValue>
    //         <TreeValue title='steps'>
    //             <div className='col grow gap'>
    //             </div>
    //         </TreeValue>
    //         {client.project.graphs.map((v, ix) => (
    //             // step ${ix}
    //             <TreeValue title={``} key={ix}>
    //                 <button
    //                     style={{ minWidth: '2rem', border: '1px solid #625858' }}
    //                     key={ix}
    //                     onClick={() => (project.focus = ix)}
    //                     className={project.focus === ix ? 'active' : undefined}
    //                 >
    //                     {ix + 1}
    //                 </button>
    //                 <div className='grow'></div>
    //                 <button>Fork</button>
    //             </TreeValue>
    //         ))}
    //     </div>
    // )
})
