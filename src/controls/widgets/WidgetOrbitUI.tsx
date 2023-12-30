import type { OrbitControls as OrbitControlsT } from 'three/examples/jsm/controls/OrbitControls'

import { OrbitControls, PerspectiveCamera, RenderTexture, Text } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useRef } from 'react'
import { Widget_orbit } from '../Widget'

const clampMod = (v: number, min: number, max: number) => {
    const rangeSize = max - min + 1
    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min
}

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
                            p.widget.state.val.azimuth = clampMod(-90 + curr.getAzimuthalAngle() * (180 / Math.PI), -180, 180)
                            p.widget.state.val.elevation = clampMod(90 - curr.getPolarAngle() * (180 / Math.PI), -180, 180) // (Math.PI / 4 - curr.getPolarAngle()) * (180 / Math.PI)
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

// import { suspend } from 'suspend-react'
// const inter = import('@pmndrs/assets/fonts/inter_regular.woff')
// useFrame((state) => (textRef.current!.position!.x = Math.sin(state.clock.elapsedTime) * 2))
