import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { createRef, useEffect, useLayoutEffect, useMemo } from 'react'
import * as THREE from 'three'

import { InputSliderUI_legacy } from '../csuite/input-slider/Slider'
import { Toggle } from '../csuite/inputs/shims'
import { parseFloatNoRoundingErr } from '../csuite/utils/parseFloatNoRoundingErr'
import { FieldAndLabelUI } from '../widgets/misc/FieldAndLabelUI'

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
