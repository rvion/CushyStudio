import { observer } from 'mobx-react-lite'
import { useSt } from '../../FrontStateCtx'
import { projectContext } from '../../ProjectCtx'
import { LightBoxUI } from '../LightBox'
import { GraphUI } from './GraphUI'

export const WorkspaceUI = observer(function WorkspaceUI_(p: {}) {
    const st = useSt()
    return (
        <div className='h-full'>
            {st.db.projects.map((project) => {
                return (
                    <projectContext.Provider value={project} key={project.id}>
                        <GraphUI graph={project.rootGraph.item} depth={1} />
                        <LightBoxUI lbs={st.lightBox} />
                    </projectContext.Provider>
                )
            })}
        </div>
    )
})
