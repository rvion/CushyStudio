import { observer } from 'mobx-react-lite'
import { SceneViewer } from 'src/widgets/3dview/3dview1'

export const Panel_3dScene = observer(function Panel_Scene_(p: { image: string; depth: string; normal: string }) {
    return (
        <SceneViewer //
            imageSrc={p.image}
            depthMapSrc={p.depth}
            normalMapSrc={p.normal}
        />
    )
})
