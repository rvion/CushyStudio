import { observer } from 'mobx-react-lite'
import { useSt } from './EditorState'

export const ProjectInfoUI = observer(function ProjectInfoUI_(p: {}) {
    const proejct = useSt().project
    return (
        <div className='px'>
            <h3>Project Config</h3>
            <input type='text' value={proejct.name} />
            <input type='text' value={proejct.serverIP} />
            <input type='number' value={proejct.serverPort} />
        </div>
    )
})
