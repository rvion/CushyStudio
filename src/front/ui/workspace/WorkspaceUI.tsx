import { observer } from 'mobx-react-lite'
import { useSt } from '../../FrontStateCtx'
import { projectContext } from '../../ProjectCtx'
import { ProjectUI } from './ProjectUI'
import { LightBoxUI } from '../LightBox'
import { Loader } from 'rsuite'

export const WorkspaceUI = observer(function WorkspaceUI_(p: {}) {
    const st = useSt()
    return (
        <div className='flex flex-col'>
            {st.schemaReady.done ? null : (
                <div className='flex gap-2 m-2'>
                    <Loader />
                    <div>loading schema</div>
                </div>
            )}
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
