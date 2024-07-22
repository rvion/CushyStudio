import type { Field_orbit } from './FieldOrbit'
import type { OrbitControls as OrbitControlsT } from 'three/examples/jsm/controls/OrbitControls'

import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { observer } from 'mobx-react-lite'
import { useRef } from 'react'

import { Cube } from './Cube3D'

export const WidgetOrbitUI = observer((p: { field: Field_orbit }) => {
    const ref = useRef<any>(null)
    return (
        <div>
            <div tw='flex items-center'>
                <div tw='btn' onClick={() => p.field.reset()}>
                    reset
                </div>
                {/* <pre>{JSON.stringify(p.widget.euler, null, 2)}</pre> */}
                <pre tw='text-xs italic'>{JSON.stringify(p.field.englishSummary, null, 2)}</pre>
            </div>
            <Canvas camera={{ fov: 15, position: [p.field.euler.x, p.field.euler.y, p.field.euler.z] }}>
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
                        p.field.setForZero123({
                            azimuth_rad: curr.getAzimuthalAngle(),
                            elevation_rad: curr.getPolarAngle(),
                        })
                        // runInAction(() => {
                        //     p.widget.serial.val.azimuth = clampMod(-90 + curr.getAzimuthalAngle() * (180 / Math.PI), -180, 180)
                        //     p.widget.serial.val.elevation = clampMod(90 - curr.getPolarAngle() * (180 / Math.PI), -180, 180) // (Math.PI / 4 - curr.getPolarAngle()) * (180 / Math.PI)

                        //     // console.log(`[🧐] `, JSON.stringify(p.widget.state.val))
                        // })
                        // if (e == null) return
                        // const azimuthDeg = e.azimuthalAngle * (180 / Math.PI)
                        // const elevationDeg = console.log(`[🧐] `, { rotation, azimuthDeg, elevationDeg })
                    }}
                />
            </Canvas>
        </div>
    )
})
