import { observer, useLocalObservable } from 'mobx-react-lite'
import { useSt } from '../../FrontStateCtx'
import { GalleryHoveredPreviewUI } from '../galleries/GalleryHoveredPreviewUI'
import { WidgetPaintUI } from '../widgets/WidgetPaintUI'
import { ComfyUIUI } from '../workspace/ComfyUIUI'
import { Loader } from 'rsuite'
import { projectContext } from '../../ProjectCtx'
import { LightBoxUI } from '../LightBox'
import { GraphUI } from '../workspace/GraphUI'
import { PanelConfigUI } from './PanelConfigUI'
import { GalleryUI } from '../galleries/GalleryUI'
import { Pane } from 'split-pane-react'
import SplitPane from 'split-pane-react/esm/SplitPane'

export const ProjectUI = observer(function ProjectUI_(p: {}) {
    const st = useSt()
    const project = st.db.projects.first()
    if (project == null) return <Loader />
    const action = st.action
    const uiSt = useLocalObservable(() => ({ sizes: [500, 100] }))
    return (
        <div className='flex-grow flex flex-col h-full'>
            <projectContext.Provider value={project} key={project.id}>
                <GalleryHoveredPreviewUI />
                <LightBoxUI lbs={st.lightBox} />
                <SplitPane
                    performanceMode
                    sashRender={() => <div className='bg-gray-200'></div>}
                    onChange={(ev) => (uiSt.sizes = ev)}
                    sizes={uiSt.sizes}
                    split='horizontal'
                >
                    <Pane className='col'>
                        {action.type === 'paint' ? ( //
                            <WidgetPaintUI action={action} />
                        ) : action.type === 'comfy' ? (
                            <ComfyUIUI action={action} />
                        ) : action.type === 'form' ? (
                            <GraphUI graph={project.rootGraph.item} depth={1} />
                        ) : (
                            <PanelConfigUI action={action} />
                        )}
                    </Pane>
                    {/* GALLERIE */}
                    <Pane minSize='100px' className='col' style={{ overflow: 'auto' }}>
                        <b className='text-lg bg-blue-950 text-center'>GALLERY</b>
                        <GalleryUI />
                    </Pane>
                </SplitPane>
            </projectContext.Provider>
        </div>
    )
})
