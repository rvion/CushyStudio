import type { AnyFieldSerial } from '../../../src/csuite/model/EntitySerial'
import type { GroupProps } from '@react-three/fiber'
import type { Group } from 'three'

import { Environment, Html, Image, OrbitControls, Sparkles, Stage, useGLTF } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { forwardRef, useMemo, useRef } from 'react'

/** this custom view  */
export const CustomView3dCan = view<{
   imageID: MediaImageID
}>({
   preview: () => <div>🥤</div>,
   render: (p) => <CanUI imageID={p.imageID} />,
})

const CanUI = observer(function CanUI_(p: { imageID: MediaImageID | null }) {
   const image = cushy.db.media_image.get(p.imageID)
   const form = cushy.forms.use(
      (ui) =>
         ui.fields(
            {
               spotlightAngle: ui.float({ default: 0.15, max: 1 }),
               ambiantLight: ui.int({ default: 3, max: 100, min: 0, step: 5 }),
            },
            { label: 'controls' },
         ),
      {
         name: 'Playground Widget Showcase',
         serial: () => cushy.readJSON<AnyFieldSerial>('settings/beer.json'),
         onSerialChange: (form) => cushy.writeJSON('settings/beer.json', form.serial),
      },
   )
   return (
      <>
         <div tw='w-96 right-0 absolute z-20'>{form.UI()}</div>
         <Canvas tw='flex-1'>
            <axesHelper args={[]} />
            <OrbitControls target={[0, 0, 0]} enableDamping={true} dampingFactor={0.25} enableZoom={true} />
            <Stage
               adjustCamera={1}
               environment='dawn'
               shadows={{ type: 'accumulative', bias: -0.001, intensity: Math.PI }}
               // adjustCamera={2}
            >
               <Sparkles position={[0.8, 0.225, 0]} />
               {/* <Grid //
                        cellColor={'#6f6f6f'}
                        cellSize={1}
                        sectionColor={'#9d4b4b'}
                        sectionSize={5}
                        infiniteGrid
                    /> */}
               <Can3 //
                  _textureURL={image?.getBase64Url()}
                  // _textureURL='/src/outputs/3d-scene/can2_img1.webp'
                  position={[0.8, 0.225, 0]}
                  scale={[2.5, 2.5, 2.5]}
               />
            </Stage>
            <Environment resolution={1024} preset='dawn' background far={200} ground />
         </Canvas>
      </>
   )
})

const useGLTFProxy = (url: string): void => {}

const Can3 = observer(
   forwardRef(function Can3_(props: GroupProps & { _textureURL?: string }, forwardedRef /* ⁉️ */) {
      // writeFileSync('src/outputs/3d-scene/can3/test/can3.gltf,')
      const gltf = useGLTF(`/library/built-in/_views/_can3/can3.gltf`)
      const { nodes, materials } = gltf
      const uist = useLocalObservable(() => ({ hover: false }))
      const ref = useRef<Group>(null!)
      const cache = useMemo(() => ({ total: 0 }), [])
      useFrame((state, delta) => {
         ref.current.rotation.y += 0.03
         cache.total += delta
         ref.current.rotation.x = Math.cos(cache.total) * 0.3
      })

      return (
         <group {...props} dispose={null}>
            {/* quick way to debug gltf content */}
            {
               <Html>
                  <div>Gtlf content</div>
                  <pre tw='text-xs' style={{ color: 'black', background: 'white', opacity: 0.5 }}>
                     {JSON.stringify(
                        {
                           nodes: Object.keys(nodes),
                           materials: Object.keys(materials),
                        },
                        null,
                        3,
                     )}
                  </pre>
               </Html>
            }
            {props._textureURL && (
               <Image
                  position={[0, 0, -0.1]}
                  url={props._textureURL!}
                  scale={[0.3, 0.3]}
                  // material={textAlt ? new MeshStandardMaterial({ map: textAlt }) : undefined}
               />
            )}
            {/* <Image
                    position={[0.6, 0, 0]}
                    url={gltf.materials['lobster texture'].map.source.toJSON().url}
                    scale={[0.3, 0.3]}
                    // material={textAlt ? new MeshStandardMaterial({ map: textAlt }) : undefined}
                /> */}
            {/* actual glb(gltf) */}

            <group position={[0, 0, 0]} ref={ref}>
               {/* Auto-generated by: https://github.com/pmndrs/gltfjsx
                    Command: npx gltfjsx@6.2.16 /Users/loco/dev/CushyStudio/src/outputs/3d-scene/can3/can3.glb -h */}
               <mesh
                  // key={xx}
                  // onPointerLeave={() => {
                  //     console.log(`[🤠] gltf a`)
                  //     material.map.source = source1
                  //     material.map.needsUpdate = true
                  //     material.needsUpdate = true
                  // }}
                  // onPointerEnter={() => {
                  //     console.log(`[🤠] gltf b`)
                  //     material.map.source = source2
                  //     material.map.needsUpdate = true
                  //     material.needsUpdate = true
                  // }}
                  onPointerOver={() => (uist.hover = true)}
                  onPointerOut={() => (uist.hover = false)}
                  // @ts-ignore
                  geometry={nodes.Cylinder.geometry}
                  material={materials['lobster texture']}
                  // material={textAlt ? undefined : materials['lobster texture']}
               >
                  {/* {textAlt ? <meshStandardMaterial map={textAlt} /> : undefined} */}
               </mesh>
               {/* @ts-ignore */}
               <mesh geometry={nodes.Cylinder_1.geometry} material={materials.Top} />
               {/* <Sparkles count={20} scale={0.1} size={6} speed={0.4} /> */}
            </group>
         </group>
      )
   }),
)

// useGLTF.preload('/can3.glb')

// const [depthMap] = useTexture([p.texture])
// const n = 6
// // return null
/*     const k = Kwery.get('coke-texture', { a: p.texture }, async () => {
        try {
            // save image
            const img = await fetch(p.texture)
            const blob = await img.blob()
            writeFileSync('/Users/loco/dev/CushyStudio/public/can/img-custom.png', new Uint8Array(await blob.arrayBuffer()))
            // save modified gltf
            const res = await fetch('/public/can/scene.gltf?foo=1')
            const out = await res.json()
            ;(out as any).images[0].uri = 'img-custom.png' //p.texture
            writeFileSync('/Users/loco/dev/CushyStudio/public/can/scene-custom.gltf', JSON.stringify(out))
            // be happy
            console.log(`[🔴 2] `, out)
            return out
        } catch (e) {
            console.log(`[🔴 3] `, e)
        }
    }) */
// if (k.value === null) return null
// console.log(`[🔴] 3`, k.value)
// console.log(`[🔴] 4`, k.value)
// const fakeURL1 = URL.createObjectURL(new Blob([JSON.stringify(k.value)], { type: 'application/json' }))
// const fakeURL2 = new URL(fakeURL1, 'http://localhost:8788/public/can/').toString()
// console.log(`[🔴 5] `, fakeURL2)
