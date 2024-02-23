import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { createRef, useEffect, useLayoutEffect, useMemo } from 'react'
import * as THREE from 'three'

import { Slider, Toggle } from 'src/rsuite/shims'
import { parseFloatNoRoundingErr } from 'src/utils/misc/parseFloatNoRoundingErr'
import { FieldAndLabelUI } from 'src/widgets/misc/FieldAndLabelUI'

const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls')

type Panel_DisplacementProps = {
    //
    image: string
    depthMap: string
    normalMap: string
    width: number
    height: number
}

export const Panel_3dScene = observer(function SceneViewer_(p: Panel_DisplacementProps) {
    return null
})
