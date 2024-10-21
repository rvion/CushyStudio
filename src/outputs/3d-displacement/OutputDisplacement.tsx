import type { Trigger } from '../../csuite/trigger/Trigger'
import type { Media3dDisplacementL } from '../../models/Media3dDisplacement'
import type { MediaImageL } from '../../models/MediaImage'
import type { StepL } from '../../models/Step'
import type { STATE } from '../../state/state'

import { mkdirSync } from 'fs'
import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import path, { dirname } from 'pathe'
import { useMemo } from 'react'

import { Button } from '../../csuite/button/Button'
import { FormUI } from '../../csuite/form/FormUI'
import { PanelHeaderUI } from '../../csuite/panel/PanelHeaderUI'
import { bang } from '../../csuite/utils/bang'
import { toastError } from '../../csuite/utils/toasts'
import { createMediaImage_fromBlobObject, createMediaImage_fromDataURI } from '../../models/createMediaImage_fromWebFile'
import { FPath } from '../../models/FPath'
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
            tw={['bg-orange-500 text-black', 'flex h-full w-full items-center justify-center']}
            style={{ lineHeight: sizeStr, fontSize: `${size / 3}px` }}
        >
            <div tw='text-xl font-bold'>3D</div>
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
    const saveImgBtn = <Button icon='mdiDownload' size='sm' onClick={(ev) => saveCanvasAsImage(uist.canvasRef.current)} />
    const menuConf = st.displacementConf.value.menu
    return (
        <div tw='relative flex flex-1 flex-col'>
            {menuConf.right ? (
                <div tw='absolute right-0 top-0 z-50 !w-96 p-2'>
                    {saveImgBtn}
                    <FormUI field={st.displacementConf} />
                </div>
            ) : menuConf.left ? (
                <div tw='absolute left-0 top-0 z-50 !w-96 p-2'>
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

export const saveCanvasAsImage = async (
    //
    canvas: Maybe<HTMLCanvasElement>,
    subfolder?: string,
): Promise<Trigger | undefined> => {
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
