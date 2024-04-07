import { Environment, Grid, Html, OrbitControls, Sparkles, Sphere, SpotLight, Stage } from '@react-three/drei'
import { Canvas, useLoader } from '@react-three/fiber'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

export const CustomView_Model = view<{
    url1: string
    url2: string
    url3: string
}>({
    preview: (p) => <div>3d</div>,
    render: (p) => (
        <Canvas tw='flex-1' shadows>
            <RenderModelUI {...p} />
        </Canvas>
    ),
})

const RenderModelUI = (data: { url1: string; url2: string }) => {
    // fake MTL file --------------------------------------------------------
    const XX = [
        'newmtl defaultMat',
        'Ka 1 1 1',
        'Kd 1 1 1',
        'Ks 0 0 0',
        'illum 1',
        'Ns 0',
        // 'map_Kd 3DMesh_Picacho_albedo.png',
        'map_Kd ' + data.url2,
        '',
    ].join('\n')
    const url = `data:text/plain;base64,${btoa(XX)}`
    // Load OBJ and apply material --------------------------------------------------------
    const materials = useLoader(MTLLoader, url)
    const obj = useLoader(OBJLoader, data.url1, (loader) => {
        materials.preload()
        loader.setMaterials(materials)
    })
    // Load OBJ and apply material --------------------------------------------------------
    return (
        <Stage environment='forest' shadows={{ type: 'accumulative', bias: -0.001, intensity: Math.PI }} adjustCamera={1}>
            <Environment background blur={0.1} preset='forest' />
            <Grid //
                cellColor={'#6f6f6f'}
                cellSize={1}
                sectionColor={'#9d4b4b'}
                sectionSize={5}
                infiniteGrid
            />
            <ambientLight intensity={1.5} />
            <SpotLight position={[0, 5, 10]} penumbra={0.1} intensity={10} />
            <primitive
                //
                position={[0, 4, 0]}
                object={obj}
                scale={10}
                castShadow
            />
            <OrbitControls />
            <Sparkles />
            <Html>test T</Html>
        </Stage>
    )
}
