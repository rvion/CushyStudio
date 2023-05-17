import { observer } from 'mobx-react-lite'
import { useSt } from '../../front/FrontStateCtx'
import { flowContext } from '../../front/FrontFlowCtx'
import { Button } from 'rsuite'
import { WorkflowUI } from './WorkflowUI'

export const WorkspaceUI = observer(function WorkspaceUI_(p: {}) {
    const st = useSt()
    return (
        <div className='flex flex-col gap-4 p-4'>
            {st.flowArray.map((flow) => {
                return (
                    <flowContext.Provider value={flow} key={flow.id}>
                        <WorkflowUI key={flow.id} />
                    </flowContext.Provider>
                )
            })}
        </div>
    )
})
