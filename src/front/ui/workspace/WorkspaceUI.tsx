import { observer } from 'mobx-react-lite'
import { useSt } from '../../FrontStateCtx'
import { projectContext } from '../../ProjectCtx'
import { ProjectUI } from './ProjectUI'
import { LightBoxUI } from '../LightBox'

export const WorkspaceUI = observer(function WorkspaceUI_(p: {}) {
    const st = useSt()
    return (
        <div className='flex flex-col'>
            {st.db.projects.map((project) => {
                return (
                    <projectContext.Provider value={project} key={project.id}>
                        <ProjectUI key={project.id} />
                        <LightBoxUI lbs={st.lightBox} />
                    </projectContext.Provider>
                )
            })}
        </div>
    )
})
