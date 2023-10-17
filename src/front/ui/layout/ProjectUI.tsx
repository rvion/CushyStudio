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
    const action = st.action
    const uiSt = useLocalObservable(() => ({ sizes: [500, 100] }))
    if (project == null)
        return (
            <>
                <Loader />
                <PanelConfigUI action={{ type: 'config' }} />
            </>
        )
    return (
        <div className='flex-grow flex flex-col h-full'>
            <projectContext.Provider value={project} key={project.id}>
                <GalleryHoveredPreviewUI />
                <div
                    id='hovered-graph'
                    className='absolute top-3 left-3 right-3 bottom-3 [z-index:2000] overflow-auto pointer-events-none'
                    style={{ transition: 'all 0.2s ease-in-out', opacity: 0 }}
                />
                <LightBoxUI lbs={st.lightBox} />
                <st.layout.UI />
                {/* <SplitPane
                    performanceMode
                    sashRender={() => <div className='bg-gray-200'></div>}
                    onChange={(ev) => (uiSt.sizes = ev)}
                    sizes={uiSt.sizes}
                    split='horizontal'
                > */}
                {/* <Pane className='col'>
                        {action.type === 'paint' ? ( //
                            <WidgetPaintUI action={action} />
                        ) : action.type === 'comfy' ? (
                            <ComfyUIUI action={action} />
                        ) : action.type === 'form' ? (
                            <GraphUI depth={1} />
                        ) : action.type === 'iframe' ? (
                            <iframe className='grow' src={action.url} frameBorder='0'></iframe>
                        ) : (
                            <PanelConfigUI action={action} />
                        )}
                    </Pane> */}
                {/* GALLERIE */}
                {/* <b className='text-lg bg-blue-950 text-center'>GALLERY</b> */}
                {/* <Pane minSize='100px' className='col' style={{ borderTop: '2px solid #363636', overflow: 'auto' }}>
                        <GalleryUI />
                    </Pane> */}
                {/* </SplitPane> */}
            </projectContext.Provider>
        </div>
    )
})
