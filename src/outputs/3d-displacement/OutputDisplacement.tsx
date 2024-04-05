import type { STATE } from '../../state/state'

import { mkdirSync } from 'fs'
import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import path, { dirname } from 'pathe'
import { useMemo } from 'react'

import { FormUI } from '../../controls/FormUI'
import { SpacerUI } from '../../controls/widgets/spacer/SpacerUI'
import { createMediaImage_fromBlobObject, createMediaImage_fromDataURI } from '../../models/createMediaImage_fromWebFile'
import { Media3dDisplacementL } from '../../models/Media3dDisplacement'
import { StepL } from '../../models/Step'
import { PanelHeaderUI } from '../../panels/PanelHeader'
import { RevealUI } from '../../rsuite/reveal/RevealUI'
import { useSt } from '../../state/stateContext'
import { asRelativePath } from '../../utils/fs/pathUtils'
import { bang } from '../../utils/misc/bang'
import { toastError } from '../../utils/misc/toasts'
import { OutputPreviewWrapperUI } from '../OutputPreviewWrapperUI'
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
                <div tw='absolute top-0 right-0 z-50 bg-base-200 p-2 !w-96'>
                    {saveImgBtn}
                    <FormUI form={st.displacementConf} />
                </div>
            ) : st.displacementConf.root.get('menu').left ? (
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
