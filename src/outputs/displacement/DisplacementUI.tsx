import { CameraControls, OrbitControls, useTexture } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { observer } from 'mobx-react-lite'
import { type MeshStandardMaterial } from 'three'
import type { DisplacementState } from './DisplacementState'
import { Ground3D } from './Ground3d'
import { SkyBox3D } from './SkyBox3D'

export const DisplacementUI = observer(function DisplacementUI_(p: { uist: DisplacementState }) {
    return (
        <Canvas tw='flex-1' camera={{ fov: 10 }}>
            <DisplacementUI2 uist={p.uist} />
        </Canvas>
    )
})

export const DisplacementUI2 = observer(function DisplacementUI2_(p: { uist: DisplacementState }) {
    const uist = p.uist
    const st = cushy
    const [depthMap, normalMap, image] = useTexture([
        //
        uist.p.depthMap,
        uist.p.normalMap,
        uist.p.image,
    ])

    const conf = st.displacementConf.fields
    return (
        <>
            <ambientLight color={conf.ambientLightColor.value} intensity={conf.ambientLightIntensity.value} />
            <pointLight position={[10, 10, 10]} />

            {conf.ground.value && <Ground3D />}

            {conf.skyBox.value && <SkyBox3D />}

            <mesh>
                <planeGeometry attach='geometry' args={[1, 1, 800, 800]}></planeGeometry>
                <meshStandardMaterial
                    map={image}
                    ref={uist.materialRef}
                    transparent={true}
                    displacementMap={depthMap}
                    displacementScale={conf.displacementScale.value}
                    normalMap={normalMap}
                    metalness={conf.metalness.value}
                    roughness={conf.roughness.value}
                    onBeforeCompile={function (this: MeshStandardMaterial, x) {
                        uist.onBeforeCompile(x, conf.cutout)
                    }}
                    // attach='material'
                    // color='hotpink'
                />
            </mesh>

            {/*
            <points>
                <planeGeometry attach='geometry' args={[1, 1, 800, 800]}></planeGeometry>
                <pointsMaterial map={image} transparent={true} />
            </points>
            */}

            {conf.camera.value.orbit ? (
                <OrbitControls
                    // change start position
                    // getPolarAngle={() => p.widget.state.val.elevation / (180 / Math.PI)}
                    // getAzimuthalAngle={() => p.widget.state.val.azimuth / (180 / Math.PI)}
                    // enableZoom={false}
                    target={[0, 0, 0]}
                    enableDamping={true}
                    dampingFactor={0.25}
                    enableZoom={true}
                    // ref={ref}
                    // onChange={(e) => {
                    //     const curr = ref.current as OrbitControlsT
                    //     runInAction(() => {
                    //         p.widget.serial.val.azimuth = clampMod(-90 + curr.getAzimuthalAngle() * (180 / Math.PI), -180, 180)
                    //         p.widget.serial.val.elevation = clampMod(90 - curr.getPolarAngle() * (180 / Math.PI), -180, 180) // (Math.PI / 4 - curr.getPolarAngle()) * (180 / Math.PI)
                    //         // console.log(`[👙] `, JSON.stringify(p.widget.state.val))
                    //     })
                    //     // if (e == null) return
                    //     // const azimuthDeg = e.azimuthalAngle * (180 / Math.PI)
                    //     // const elevationDeg = console.log(`[👙] `, { rotation, azimuthDeg, elevationDeg })
                    // }}
                />
            ) : (
                // ) : conf.camera.value.wasd ? (
                //     <KeyboardControls map={} />
                <CameraControls />
            )}
        </>
    )
})
