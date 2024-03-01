import type { OutputFor } from './_prefabs'
import type { MediaImageL } from 'src/models/MediaImage'

import { exhaust } from 'src/utils/misc/ComfyUtils'

export const ui_3dDisplacement = () => {
    const form = getCurrentForm()
    return form.group({
        requirements: [
            //
            { type: 'customNodesByNameInCushy', nodeName: 'Zoe$7DepthMapPreprocessor' },
            { type: 'customNodesByNameInCushy', nodeName: 'MarigoldDepthEstimation' },
        ],
        items: () => {
            return {
                normal: form.selectOne({
                    tooltip: 'no Normal map may be better, bad model yields bumpy stuff',
                    default: { id: 'None' },
                    choices: [{ id: 'MiDaS' }, { id: 'BAE' }, { id: 'None' }],
                }),
                depth: form.choice({
                    default: 'Marigold',
                    appearance: 'tab',
                    items: {
                        MiDaS: form.group(),
                        Zoe: form.group(),
                        LeReS: form.group(),
                        Marigold: form.auto.MarigoldDepthEstimation(),
                    },
                }),
            }
        },
    })
}

/** to output a 3d displacement map, once images are all ready */
export const run_Dispacement2 = (startImg: string | MediaImageL) => {
    const run = getCurrentRun()
    run.output_3dImage({ image: startImg, depth: 'depth', normal: 'normal' })
}

/** to add subgraph that will produce a depth and normal map */
export const run_Dispacement1 = (
    //
    show3d: OutputFor<typeof ui_3dDisplacement>,
    finalImage: _IMAGE,
) => {
    const run = getCurrentRun()
    const graph = run.nodes
    run.add_previewImage(finalImage).storeAs('base')
    const depth = (() => {
        if (show3d.depth.MiDaS) return graph.MiDaS$7DepthMapPreprocessor({ image: finalImage })
        if (show3d.depth.Zoe) return graph.Zoe$7DepthMapPreprocessor({ image: finalImage })
        if (show3d.depth.LeReS) return graph.LeReS$7DepthMapPreprocessor({ image: finalImage })
        if (show3d.depth.Marigold) return graph.MarigoldDepthEstimation({ image: finalImage })
        throw new Error('❌ show3d activated, but no depth option choosen')
    })()
    run.add_previewImage(depth).storeAs('depth')

    const normal = (() => {
        if (show3d.normal.id === 'MiDaS') return graph.MiDaS$7NormalMapPreprocessor({ image: finalImage })
        if (show3d.normal.id === 'BAE') return graph.BAE$7NormalMapPreprocessor({ image: finalImage })
        if (show3d.normal.id === 'None') return graph.EmptyImage({ color: 0x7f7fff, height: 512, width: 512 })
        return exhaust(show3d.normal)
    })()
    run.add_previewImage(normal).storeAs('normal')
}
