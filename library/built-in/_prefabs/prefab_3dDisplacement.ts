import type { FormBuilder } from '../../../src/CUSHY'
import type { MediaImageL } from '../../../src/models/MediaImage'
import type { OutputFor } from './_prefabs'

import { exhaust } from '../../../src/csuite/utils/exhaust'

export type UI_3dDisplacement = X.XGroup<{
    normal: X.XSelectOne<{ id: 'MiDaS' } | { id: 'BAE' } | { id: 'None' }>
    depth: X.XChoice<{
        MiDaS: X.XEmpty
        Zoe: X.XEmpty
        LeReS: X.XEmpty
        Marigold: ReturnType<FormBuilder['auto']['MarigoldDepthEstimation']>
    }>
}>

export function ui_3dDisplacement(): UI_3dDisplacement {
    const form = getCurrentForm()
    return form
        .group({
            icon: 'mdiRotate3d',
            items: {
                normal: form.selectOne({
                    tooltip: 'no Normal map may be better, bad model yields bumpy stuff',
                    default: { id: 'None' },
                    choices: [{ id: 'MiDaS' }, { id: 'BAE' }, { id: 'None' }],
                }),
                depth: form.choice({
                    default: 'Marigold',
                    appearance: 'tab',
                    items: {
                        MiDaS: form.empty(),
                        Zoe: form.empty(),
                        LeReS: form.empty(),
                        Marigold: form.auto.MarigoldDepthEstimation(),
                    },
                }),
            },
        })
        .addRequirements([
            //
            { type: 'customNodesByNameInCushy', nodeName: 'Zoe$7DepthMapPreprocessor' },
            { type: 'customNodesByNameInCushy', nodeName: 'MarigoldDepthEstimation' },
        ])
}

/** to output a 3d displacement map, once images are all ready */
export function run_Dispacement2(startImg: string | MediaImageL): void {
    const run = getCurrentRun()
    run.output_3dImage({ image: startImg, depth: 'depth', normal: 'normal' })
}

/** to add subgraph that will produce a depth and normal map */
export function run_Dispacement1(
    //
    show3d: OutputFor<typeof ui_3dDisplacement>,
    finalImage: _IMAGE,
): void {
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
