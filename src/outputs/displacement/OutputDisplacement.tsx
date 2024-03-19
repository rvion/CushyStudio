import type { STATE } from 'src/state/state'

import { mkdirSync, writeFileSync } from 'fs'
import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import path, { dirname } from 'pathe'
import { useMemo, useRef } from 'react'

import { OutputPreviewWrapperUI } from '../OutputPreviewWrapperUI'
import { DisplacementState } from './DisplacementState'
import { DisplacementUI } from './DisplacementUI'
import { FormUI } from 'src/controls/FormUI'
import { SpacerUI } from 'src/controls/widgets/spacer/SpacerUI'
import {
    createMediaImage_fromBlobObject,
    createMediaImage_fromDataURI,
    createMediaImage_fromPath,
} from 'src/models/createMediaImage_fromWebFile'
import { Media3dDisplacementL } from 'src/models/Media3dDisplacement'
import { StepL } from 'src/models/Step'
import { PanelHeaderUI } from 'src/panels/PanelHeader'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'
import { useSt } from 'src/state/stateContext'
import { asRelativePath } from 'src/utils/fs/pathUtils'
import { bang } from 'src/utils/misc/bang'
import { toastError } from 'src/utils/misc/toasts'

export const OutputDisplacementPreviewUI = observer(function OutputImagePreviewUI_(p: {
    step?: Maybe<StepL>
    output: Media3dDisplacementL
}) {
    const st = useSt()
    const size = st.historySize
    const sizeStr = st.historySizeStr
    return (
        <OutputPreviewWrapperUI size={size} output={p.output}>
            <div
                tw={['bg-orange-500 text-black', 'text-center w-full font-bold']}
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
    const uist = useMemo(
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
    const saveImgBtn = (
        <div tw='btn btn-sm' onClick={(ev) => saveCanvasAsImage(uist.canvasRef.current)}>
            <span className='material-symbols-outlined'>download</span>
        </div>
    )
    const menuConf = st.displacementConf.value.menu
    return (
        <div tw='relative flex-1 flex flex-col'>
            {menuConf.right ? (
                <div tw='absolute top-0 right-0 z-50 bg-base-200 p-2 !w-96'>
                    {saveImgBtn}
                    <FormUI form={st.displacementConf} />
                </div>
            ) : st.displacementConf.get('menu').left ? (
                <div tw='absolute top-0 left-0 z-50 bg-base-200 p-2 !w-96'>
                    {saveImgBtn}
                    <FormUI form={st.displacementConf} />
                </div>
            ) : (
                <PanelHeaderUI>
                    <SpacerUI />
                    <RevealUI
                        tw='WIDGET-FIELD'
                        title='Displacement Options'
                        content={() => (
                            <div tw='p-2'>
                                <FormUI form={st.displacementConf} />
                            </div>
                        )}
                    >
                        <div tw='flex px-1 cursor-default bg-base-200 rounded w-full h-full items-center justify-center hover:brightness-125 border border-base-100'>
                            <span className='material-symbols-outlined'>settings</span>
                            <span className='material-symbols-outlined'>expand_more</span>
                        </div>
                    </RevealUI>
                </PanelHeaderUI>
            )}

            <DisplacementUI uist={uist} />
        </div>
    )
})

export type OrbitControls2 = import('three/examples/jsm/controls/OrbitControls').OrbitControls

export const saveCanvasAsImage = async (canvas: Maybe<HTMLCanvasElement>, subfolder?: string) => {
    if (canvas == null) return toastError('❌ canvas is null')
    const imageID = nanoid()
    const filename = `${imageID}.png`

    const relPath = asRelativePath(subfolder ? path.join(subfolder, filename) : filename)
    const absPath = cushy.resolve(cushy.outputFolderPath, relPath)
    mkdirSync(dirname(absPath), { recursive: true })
    canvas.toBlob(async (blob) => {
        if (blob == null) return toastError('❌ canvas.toBlob returned null')
        createMediaImage_fromBlobObject(cushy, blob, absPath)
    })
}

export const saveDataUriAsImage = async (dataURI: string, st: STATE, subfolder?: string) => {
    return createMediaImage_fromDataURI(st, dataURI, subfolder)
}
