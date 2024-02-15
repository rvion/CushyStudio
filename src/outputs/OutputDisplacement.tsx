import type { STATE } from 'src/state/state'

import { observer } from 'mobx-react-lite'
import { useEffect, useLayoutEffect, useMemo } from 'react'
import { Media3dDisplacementL } from 'src/models/Media3dDisplacement'
import { StepL } from 'src/models/Step'
import { useSt } from 'src/state/stateContext'
import { bang } from 'src/utils/misc/bang'
import { OutputPreviewWrapperUI } from './OutputPreviewWrapperUI'
// import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// const { OrbitControls } = require('three/examples/jsm/controls/OrbitControls')
import { FormUI } from 'src/controls/FormUI'
import { createMediaImage_fromDataURI } from 'src/models/createMediaImage_fromWebFile'
import { PanelHeaderUI } from 'src/panels/PanelHeader'
import { DisplacementState } from './displacement/DisplacementState'
import { DisplacementFooUI } from './displacement/DisplacementFormUI'

export const OutputDisplacementPreviewUI = observer(function OutputImagePreviewUI_(p: {
    step?: Maybe<StepL>
    output: Media3dDisplacementL
}) {
    const st = useSt()
    const size = st.historySize
    const sizeStr = st.historySizeStr
    return (
        <OutputPreviewWrapperUI size={size} output={p.output}>
            {/*  */}
            <div
                tw={[
                    //
                    'bg-orange-500 text-black',
                    'text-center w-full font-bold',
                ]}
                style={{ lineHeight: sizeStr, fontSize: `${size / 3}px` }}
            >
                3D
            </div>
        </OutputPreviewWrapperUI>
    )
})

export type Panel_DisplacementProps = {
    //
    image: string
    depthMap: string
    normalMap: string
    width: number
    height: number
}

// React component
// export const Panel_3dScene = observer(function SceneViewer_(p: Panel_DisplacementProps) {
export const OutputDisplacementUI = observer(function OutputDisplacementUI_(p: {
    step?: Maybe<StepL>
    output: Media3dDisplacementL
}) {
    const state = useMemo(
        () =>
            new DisplacementState({
                image: bang(p.output.data.image),
                depthMap: bang(p.output.data.depthMap),
                normalMap: bang(p.output.data.normalMap),
                width: bang(p.output.data.width),
                height: bang(p.output.data.height),
            }),
        [JSON.stringify(p)],
    )

    useEffect(() => state.cleanup, [state])
    useLayoutEffect(() => state.mount(), [state])
    const st = useSt()

    return (
        <div>
            <PanelHeaderUI>
                <DisplacementFooUI />
                {/* */}
            </PanelHeaderUI>
            <div ref={state.mountRef} />
        </div>
    )
})

export type OrbitControls2 = import('three/examples/jsm/controls/OrbitControls').OrbitControls

// export const saveCanvasAsImage = async (canvas: HTMLCanvasElement, st: STATE, subfolder?: string) => {
//     const imageID = nanoid()
//     const filename = `${imageID}.png`

//     const relPath = asRelativePath(subfolder ? path.join(subfolder, filename) : filename)
//     const absPath = st.resolve(st.outputFolderPath, relPath)
//     mkdirSync(dirname(absPath), { recursive: true })

//     const buffer = await new Promise<ArrayBuffer>((resolve) => canvas.toBlob((blob) => blob?.arrayBuffer().then(resolve)))
//     writeFileSync(absPath, Buffer.from(buffer))
//     console.log(`Image saved: ${absPath}, ${buffer.byteLength} bytes`)

//     st.db.media_images.create({ infos: { type: 'image-local', absPath } })
// }

export const saveDataUriAsImage = async (dataURI: string, st: STATE, subfolder?: string) => {
    return createMediaImage_fromDataURI(st, dataURI, subfolder)
}
