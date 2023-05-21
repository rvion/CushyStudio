import { observer } from 'mobx-react-lite'
import { useSt } from '../../FrontStateCtx'
import { projectContext } from '../../ProjectCtx'
import { WorkflowUI } from './ProjectUI'

export const WorkspaceUI = observer(function WorkspaceUI_(p: {}) {
    const st = useSt()
    return (
        <div className='flex flex-col gap-4 p-4'>
            {st.db.projects.map((prolject) => {
                return (
                    <projectContext.Provider value={prolject} key={prolject.id}>
                        <WorkflowUI key={prolject.id} />
                    </projectContext.Provider>
                )
            })}
        </div>
    )
})
