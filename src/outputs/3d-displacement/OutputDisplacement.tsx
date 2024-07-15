import type { MediaImageL } from '../../models/MediaImage'
import type { STATE } from '../../state/state'

import { mkdirSync } from 'fs'
import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import path, { dirname } from 'pathe'
import { useMemo } from 'react'

import { FormUI } from '../../csuite/form/FormUI'
import { bang } from '../../csuite/utils/bang'
import { toastError } from '../../csuite/utils/toasts'
import { PanelHeaderUI } from '../../csuite/wrappers/PanelHeader'
import { createMediaImage_fromBlobObject, createMediaImage_fromDataURI } from '../../models/createMediaImage_fromWebFile'
import { Media3dDisplacementL } from '../../models/Media3dDisplacement'
import { FPath } from '../../models/PathObj'
import { StepL } from '../../models/Step'
import { useSt } from '../../state/stateContext'
import { asRelativePath } from '../../utils/fs/pathUtils'
import { DisplacementState } from './DisplacementState'
import { DisplacementUI } from './DisplacementUI'

export const OutputDisplacementPreviewUI = observer(function OutputImagePreviewUI_(p: {
    step?: Maybe<StepL>
    output: Media3dDisplacementL
}) {
    const st = useSt()
    const size = st.historySize
    const sizeStr = st.historySizeStr
    return (
        <div
            tw={['bg-orange-500 text-black', 'flex items-center justify-center h-full w-full']}
            style={{ lineHeight: sizeStr, fontSize: `${size / 3}px` }}
        >
            <div tw='font-bold text-xl'>3D</div>
        </div>
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

export const OutputDisplacementUI = observer(function OutputDisplacementUI_(p: {
    step?: Maybe<StepL>
    output: Media3dDisplacementL
}) {
    const uist = useMemo(
        () =>
            new DisplacementState({
                image: bang(p.output.data.image, '❌ Displacement: missing image'),
                depthMap: bang(p.output.data.depthMap, '❌ Displacement: missing depthMap'),
                normalMap: bang(p.output.data.normalMap, '❌ Displacement: missing normalMap'),
                width: bang(p.output.data.width, '❌ Displacement: missing width'),
                height: bang(p.output.data.height, '❌ Displacement: missing height'),
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
                <div tw='absolute top-0 right-0 z-50 p-2 !w-96'>
                    {saveImgBtn}
                    <FormUI field={st.displacementConf} />
                </div>
            ) : menuConf.left ? (
                <div tw='absolute top-0 left-0 z-50 p-2 !w-96'>
                    {saveImgBtn}
                    <FormUI field={st.displacementConf} />
                </div>
            ) : (
                <PanelHeaderUI>{st.displacementConf.renderAsConfigBtn()}</PanelHeaderUI>
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
        return createMediaImage_fromBlobObject(blob, new FPath(absPath))
    })
}

export const saveDataUriAsImage = async (
    //
    dataURI: string,
    st: STATE,
    subfolder?: string,
): Promise<MediaImageL> => {
    return createMediaImage_fromDataURI(dataURI, subfolder)
}
