import type { OrbitControls as OrbitControlsT } from 'three/examples/jsm/controls/OrbitControls'

import { OrbitControls, PerspectiveCamera, RenderTexture, Text } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { makeAutoObservable, runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import { useRef } from 'react'
import { ComfySchemaL } from 'src/models/Schema'
import { FormBuilder } from '../FormBuilder'
import { IWidget, WidgetConfigFields, WidgetSerialFields, WidgetTypeHelpers } from '../IWidget'
import { WidgetDI } from '../widgets/WidgetUI.DI'

export type OrbitData = {
    azimuth: number
    elevation: number
}

// CONFIG
export type Widget_orbit_config = WidgetConfigFields<{
    default?: Partial<OrbitData>
}>

// SERIAL
export type Widget_orbit_serial = WidgetSerialFields<{
    type: 'orbit'
    active: true
    val: OrbitData
}>

// OUT
export type Widget_orbit_output = {
    azimuth: number
    elevation: number
    englishSummary: string
}

// TYPES
export type Widget_orbit_types = {
    $Type: 'orbit'
    $Input: Widget_orbit_config
    $Serial: Widget_orbit_serial
    $Output: Widget_orbit_output
}

// STATE
export interface Widget_orbit extends WidgetTypeHelpers<Widget_orbit_types> {}
export class Widget_orbit implements IWidget<Widget_orbit_types> {
    isVerticalByDefault = true
    isCollapsible = false
    id: string
    type: 'orbit' = 'orbit'

    /** reset azimuth and elevation */
    reset = () => {
        this.serial.val.azimuth = this.config.default?.azimuth ?? 0
        this.serial.val.elevation = this.config.default?.elevation ?? 0
    }

    /** practical to add to your textual prompt */
    get englishSummary() {
        return mkEnglishSummary(this.serial.val.azimuth, this.serial.val.elevation)
    }

    get euler() {
        const radius = 5
        const azimuthRad = this.serial.val.azimuth * (Math.PI / 180)
        const elevationRad = this.serial.val.elevation * (Math.PI / 180)
        const x = radius * Math.cos(elevationRad) * Math.sin(azimuthRad)
        const y = radius * Math.cos(elevationRad) * Math.cos(azimuthRad)
        const z = radius * Math.sin(elevationRad)
        // const cameraPosition =[x,y,z] as const
        return { x: y, y: z, z: -x }
    }

    serial: Widget_orbit_serial

    constructor(
        public builder: FormBuilder,
        public schema: ComfySchemaL,
        public config: Widget_orbit_config,
        serial?: Widget_orbit_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            type: 'orbit',
            collapsed: config.startCollapsed,
            active: true,
            val: {
                azimuth: config.default?.azimuth ?? 0,
                elevation: config.default?.elevation ?? 0,
            },
            id: this.id,
        }
        makeAutoObservable(this)
    }
    get result(): Widget_orbit_output {
        return {
            azimuth: this.serial.val.azimuth,
            elevation: this.serial.val.elevation,
            englishSummary: this.englishSummary,
        }
    }
}

// DI
WidgetDI.Widget_orbit = Widget_orbit

export const WidgetOrbitUI = observer((p: { widget: Widget_orbit }) => {
    const ref = useRef<any>(null)
    return (
        <div tw='virtualBorder'>
            <div tw='flex items-center'>
                <div tw='btn' onClick={() => p.widget.reset()}>
                    reset
                </div>
                {/* <pre>{JSON.stringify(p.widget.euler, null, 2)}</pre> */}
                <pre tw='text-xs italic'>{JSON.stringify(p.widget.englishSummary, null, 2)}</pre>
            </div>
            <Canvas
                camera={{
                    //
                    fov: 15,
                    position: [
                        //
                        p.widget.euler.x,
                        p.widget.euler.y,
                        p.widget.euler.z,
                    ],
                }}
            >
                <ambientLight intensity={1.5} />
                <pointLight position={[10, 10, 10]} />
                <Cube />
                {/* <FlyControls /> */}
                <OrbitControls
                    // change start position
                    target={[0, 0, 0]}
                    enableDamping={false}
                    // getPolarAngle={() => p.widget.state.val.elevation / (180 / Math.PI)}
                    // getAzimuthalAngle={() => p.widget.state.val.azimuth / (180 / Math.PI)}
                    ref={ref}
                    // enableZoom={false}
                    onChange={(e) => {
                        const curr = ref.current as OrbitControlsT
                        runInAction(() => {
                            p.widget.serial.val.azimuth = clampMod(-90 + curr.getAzimuthalAngle() * (180 / Math.PI), -180, 180)
                            p.widget.serial.val.elevation = clampMod(90 - curr.getPolarAngle() * (180 / Math.PI), -180, 180) // (Math.PI / 4 - curr.getPolarAngle()) * (180 / Math.PI)
                            // console.log(`[👙] `, JSON.stringify(p.widget.state.val))
                        })
                        // if (e == null) return
                        // const azimuthDeg = e.azimuthalAngle * (180 / Math.PI)
                        // const elevationDeg = console.log(`[👙] `, { rotation, azimuthDeg, elevationDeg })
                    }}
                />
            </Canvas>
        </div>
    )
})

// prettier-ignore
const sides: { color: string; text: string }[] = [
    {text:'Front',  color: 'red' },
    {text:'Back',   color: 'cyan' },
    {text:'Top', color: 'green' },
    {text:'Bottom',    color: 'yellow' },
    {text:'Right',  color: 'orange' },
    {text:'Left',   color: 'purple' },
]

// https://codesandbox.io/p/sandbox/drei-rendertexture-0z8i2c?file=%2Fsrc%2FApp.js%3A11%2C22
function Cube() {
    const textRef = useRef<any>()
    return (
        <mesh>
            <boxGeometry />
            {sides.map((s, ix) => (
                <meshStandardMaterial key={s.text} attach={`material-${ix}`}>
                    <RenderTexture attach='map' anisotropy={16}>
                        <PerspectiveCamera makeDefault manual aspect={1 / 1} position={[0, 0, 5]} />
                        <color attach='background' args={[s.color]} />
                        <Text
                            //
                            // font={(suspend(inter) as any).default}
                            ref={textRef}
                            fontSize={2}
                            color='#555'
                        >
                            {s.text}
                        </Text>
                    </RenderTexture>
                </meshStandardMaterial>
            ))}
        </mesh>
    )
}

// UTILS
// import { suspend } from 'suspend-react'
// const inter = import('@pmndrs/assets/fonts/inter_regular.woff')
// useFrame((state) => (textRef.current!.position!.x = Math.sin(state.clock.elapsedTime) * 2))

const clampMod = (v: number, min: number, max: number) => {
    const rangeSize = max - min + 1
    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min
}

const inRange = (val: number, min: number, max: number, margin: number = 0) => {
    return val >= min - margin && val <= max + margin
}

const mkEnglishSummary = (
    /** in deg; from -180 to 180 */
    azimuth: number,
    /** in deg, from -90 to 90 */
    elevation: number,
): string => {
    const words: string[] = []
    // const azimuth = this.state.val.azimuth
    // faces: front, back, left, right
    const margin = 20

    if (inRange(elevation, -90, -80, margin)) words.push('from-below')
    else if (inRange(elevation, 80, 90, 0)) words.push('from-above')
    else {
        if (inRange(elevation, -80, -45, 0)) words.push('low')
        else if (inRange(elevation, 45, 80, 0)) words.push('high')

        if (inRange(azimuth, -180, -135, margin)) words.push('back')
        else if (inRange(azimuth, 135, 180, margin)) words.push('back')
        else if (inRange(azimuth, -45, 45, margin)) words.push('front')
        else {
            if (inRange(azimuth, -135, -45, margin)) words.push('righ-side') // 'right')
            else if (inRange(azimuth, 45, 135, margin)) words.push('left-side') // left')
        }
    }

    return `${words.join('-')} view`
}
