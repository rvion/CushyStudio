import { observer } from 'mobx-react-lite'
import { useSt } from '../../FrontStateCtx'
import { GalleryHoveredPreviewUI } from '../galleries/GalleryHoveredPreviewUI'
import { WidgetPaintUI } from '../widgets/WidgetPaintUI'
import { ComfyUIUI } from '../workspace/ComfyUIUI'
import { Loader } from 'rsuite'
import { projectContext } from '../../ProjectCtx'
import { LightBoxUI } from '../LightBox'
import { GraphUI } from '../workspace/GraphUI'

export const ProjectUI = observer(function ProjectUI_(p: {}) {
    const st = useSt()
    const project = st.db.projects.first()
    if (project == null) return <Loader />
    const action = st.action
    return (
        <div className='flex-grow h-full'>
            <projectContext.Provider value={project} key={project.id}>
                <GalleryHoveredPreviewUI />
                <LightBoxUI lbs={st.lightBox} />
                {action.type === 'paint' ? ( //
                    <WidgetPaintUI action={action} />
                ) : action.type === 'comfy' ? (
                    <ComfyUIUI action={action} />
                ) : action.type === 'form' ? (
                    <GraphUI graph={project.rootGraph.item} depth={1} />
                ) : (
                    <div>{JSON.stringify(action)}</div>
                )}
            </projectContext.Provider>
        </div>
    )
})
