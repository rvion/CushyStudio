import type { OrbitControls as OrbitControlsT } from 'three/examples/jsm/controls/OrbitControls'
import type { Widget_orbit } from './WidgetOrbit'

import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useRef } from 'react'
import { clampMod } from './_orbitUtils'
import { Cube } from './Cube3D'

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
