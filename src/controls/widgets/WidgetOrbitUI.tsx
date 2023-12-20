import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { runInAction } from 'mobx'
import { useRef } from 'react'
import type { OrbitControls as OrbitControlsT } from 'three/examples/jsm/controls/OrbitControls'
import { Widget_orbit } from '../Widget'
import { useLocalObservable } from 'mobx-react-lite'

// extend({ MeshBasicMaterial })

export const WidgetOrbitUI = (p: { widget: Widget_orbit }) => {
    const ref = useRef<any>(null)
    return (
        <div tw='virtualBorder'>
            <div
                tw='btn'
                onClick={() => {
                    p.widget.reset()
                }}
            >
                reset
            </div>
            <Canvas>
                <ambientLight intensity={1.5} />
                <pointLight position={[10, 10, 10]} />
                <Cube />
                <OrbitControls
                    // getPolarAngle={() => p.widget.state.val.elevation / (180 / Math.PI)}
                    // getAzimuthalAngle={() => p.widget.state.val.azimuth / (180 / Math.PI)}
                    ref={ref}
                    // enableZoom={false}
                    onChange={(e) => {
                        const curr = ref.current as OrbitControlsT
                        runInAction(() => {
                            p.widget.state.val.azimuth = curr.getAzimuthalAngle() * (180 / Math.PI)
                            p.widget.state.val.elevation = -(curr.getPolarAngle() * (180 / Math.PI) - 90)
                            console.log(`[👙] `, JSON.stringify(p.widget.state.val))
                        })
                        // if (e == null) return
                        // const azimuthDeg = e.azimuthalAngle * (180 / Math.PI)
                        // const elevationDeg = console.log(`[👙] `, { rotation, azimuthDeg, elevationDeg })
                    }}
                />
            </Canvas>
        </div>
    )
}

const Cube = () => {
    return (
        <mesh>
            <boxGeometry attach='geometry' args={[3, 3, 3]} />
            <meshStandardMaterial attach='material' color={'#e88686'} />

            {/* {['Front', 'Back', 'Left', 'Right', 'Top', 'Bottom'].map((text, index) => (
                <meshBasicMaterial key={index} attach='material' color='white'>
                        <RenderTexture attach="map"><Text>hello</Text><RenderTexture />
                    <textGeometry attach='geometry' args={[text, { size: 0.2, height: 0.1 }]} />
                </meshBasicMaterial>
            ))} */}
            {/* <boxBufferGeometry attach='geometry' args={[1, 1, 1]} /> */}
        </mesh>
    )
}
