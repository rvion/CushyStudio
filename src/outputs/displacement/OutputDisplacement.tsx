import type { STATE } from 'src/state/state'

import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { observer } from 'mobx-react-lite'
import { useEffect, useLayoutEffect, useMemo } from 'react'

import { OutputPreviewWrapperUI } from '../OutputPreviewWrapperUI'
import { DisplacementState } from './DisplacementState'
import { DisplacementUI } from './DisplacementUI'
// import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// const { OrbitControls } = require('three/examples/jsm/controls/OrbitControls')
import { FormUI } from 'src/controls/FormUI'
import { Cube } from 'src/controls/widgets/orbit/Cube3D'
import { createMediaImage_fromDataURI } from 'src/models/createMediaImage_fromWebFile'
import { Media3dDisplacementL } from 'src/models/Media3dDisplacement'
import { StepL } from 'src/models/Step'
import { PanelHeaderUI } from 'src/panels/PanelHeader'
import { useSt } from 'src/state/stateContext'
import { bang } from 'src/utils/misc/bang'

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

    const st = useSt()

    const menuConf = st.displacementConf.value.menu
    return (
        <div tw='relative flex-1 flex flex-col'>
            {menuConf.right ? (
                <div tw='absolute top-0 right-0 z-50 bg-base-200 p-2 !w-96'>
                    <FormUI form={st.displacementConf} />
                </div>
            ) : st.displacementConf.get('menu').left ? (
                <div tw='absolute top-0 left-0 z-50 bg-base-200 p-2 !w-96'>
                    <FormUI form={st.displacementConf} />
                </div>
            ) : (
                <PanelHeaderUI>
                    <FormUI form={st.displacementConf} />
                </PanelHeaderUI>
            )}

            <DisplacementUI uist={state} />
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
