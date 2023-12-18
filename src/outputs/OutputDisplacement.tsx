import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { createRef, useEffect, useLayoutEffect, useMemo } from 'react'
import { Input, Slider, Toggle } from 'src/rsuite/shims'
import { parseFloatNoRoundingErr } from 'src/utils/misc/parseFloatNoRoundingErr'
import { FieldAndLabelUI } from 'src/widgets/misc/FieldAndLabelUI'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Media3dDisplacementL } from 'src/models/Media3dDisplacement'
import { StepL } from 'src/models/Step'
import { useSt } from 'src/state/stateContext'
import { OutputPreviewWrapperUI } from './OutputPreviewWrapperUI'
import { bang } from 'src/utils/misc/bang'
import { InputNumberUI } from 'src/rsuite/InputNumberUI'

export const OutputDisplacementPreviewUI = observer(function OutputImagePreviewUI_(p: {
    step?: Maybe<StepL>
    output: Media3dDisplacementL
}) {
    const st = useSt()
    const size = st.historySize
    const sizeStr = st.historySizeStr
    return (
        <OutputPreviewWrapperUI size={size} output={p.output}>
            {/*  */}
            <div
                tw={[
                    //
                    'bg-orange-500 text-black',
                    'text-center w-full font-bold',
                ]}
                style={{ lineHeight: sizeStr, fontSize: `${size / 3}px` }}
            >
                3D
            </div>
        </OutputPreviewWrapperUI>
    )
})

type Panel_DisplacementProps = {
    //
    image: string
    depthMap: string
    normalMap: string
    width: number
    height: number
}

// React component
// export const Panel_3dScene = observer(function SceneViewer_(p: Panel_DisplacementProps) {
export const OutputDisplacementUI = observer(function OutputDisplacementUI_(p: {
    step?: Maybe<StepL>
    output: Media3dDisplacementL
}) {
    const state = useMemo(
        () =>
            new State({
                image: bang(p.output.data.image),
                depthMap: bang(p.output.data.depthMap),
                normalMap: bang(p.output.data.normalMap),
                width: bang(p.output.data.width),
                height: bang(p.output.data.height),
            }),
        [JSON.stringify(p)],
    )

    useEffect(() => state.cleanup, [state])
    useLayoutEffect(() => state.mount(), [state])

    return (
        <div>
            <div tw='flex gap-2 px-2'>
                <FieldAndLabelUI label='displacement'>
                    <InputNumberUI
                        mode='float'
                        style={{ width: '5rem' }}
                        min={0}
                        max={8}
                        value={state.displacementScale}
                        onValueChange={(next) => {
                            state.displacementScale = next
                        }}
                    />
                </FieldAndLabelUI>
                <FieldAndLabelUI label='light'>
                    <Slider
                        style={{ width: '5rem' }}
                        min={0}
                        max={8}
                        value={state.ambientLightIntensity}
                        onChange={(ev) => {
                            const next = parseFloatNoRoundingErr(ev.target.value)
                            state.ambientLightIntensity = next
                        }}
                    />
                </FieldAndLabelUI>
                <FieldAndLabelUI label='light color'>
                    <Input
                        tw='join-item input-xs'
                        type='color'
                        style={{ width: '5rem' }}
                        value={state.ambientLightColor}
                        onChange={(ev) => {
                            const next = ev.target.value
                            const hex = typeof next === 'string' ? parseInt(next.replace('#', ''), 16) : next
                            state.ambientLightColor = hex
                        }}
                    />
                </FieldAndLabelUI>
                <FieldAndLabelUI label='Symmetric Model'>
                    <Toggle checked={state.isSymmetric} onChange={(e) => (state.isSymmetric = e.target.checked)} />
                </FieldAndLabelUI>
            </div>
            <div ref={state.mountRef} />
        </div>
    )
})

// State class
class State {
    mountRef = createRef<HTMLDivElement>()

    // params to play with ----------------------------------------------------------------
    metalness = 0
    roughness = 1

    private _displacementScale = 3
    get displacementScale() { return this._displacementScale } // prettier-ignore
    set displacementScale(v: number) {
        this._displacementScale = v
        this.material.displacementScale = v
    }

    ambientLight: THREE.AmbientLight
    private _ambientLightColor = 0xffffff
    get ambientLightColor() { return this._ambientLightColor } // prettier-ignore
    set ambientLightColor(v: number) {
        this._ambientLightColor = v
        this.ambientLight.color.setHex(v)
    }
    private _ambientLightIntensity = 1
    get ambientLightIntensity() { return this._ambientLightIntensity } // prettier-ignore
    set ambientLightIntensity(v: number) {
        this._ambientLightIntensity = v
        this.ambientLight.intensity = v
    }

    // Symmetry controls
    private _isSymmetric = false
    get isSymmetric() { return this._isSymmetric } // prettier-ignore
    set isSymmetric(v: boolean) {
        this._isSymmetric = v
        this.updateGeometry()
    }

    updateGeometry = () => {
        const geometry = this.planeSym.geometry
        // Flip the normals
        const normals = geometry.attributes.normal
        for (let i = 0; i < normals.count; i++) {
            normals.setX(i, -normals.getX(i))
            normals.setY(i, normals.getY(i)) // Normally, you don't need to flip Y and Z
            normals.setZ(i, normals.getZ(i)) // But adjust if your use case requires it
        }
        normals.needsUpdate = true

        // Correct the winding order by flipping the indices
        if (geometry.index) {
            const indices = geometry.index
            for (let i = 0; i < indices.count; i += 3) {
                // Swap the indices of the first and last vertex of the triangle
                const tmp = indices.getX(i)
                indices.setX(i, indices.getX(i + 2))
                indices.setX(i + 2, tmp)
            }
            indices.needsUpdate = true
        }

        // Update the geometry to apply the changes
        geometry.computeVertexNormals()
        geometry.computeVertexNormals()
        this.planeSym.geometry.computeVertexNormals()
        this.planeSym.geometry.attributes.position.needsUpdate = true
    }

    // ------------------------------------------------------------------------------------
    // canvas size
    WIDTH = 800
    HEIGHT = 800
    // const WIDTH = window.innerWidth
    // const HEIGHT = window.innerHeight

    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer

    controls: OrbitControls

    // plane
    geometry: THREE.PlaneGeometry
    material: THREE.MeshStandardMaterial
    plane: THREE.Mesh
    planeSym: THREE.Mesh

    mount = () => {
        // Add renderer to DOM
        const x = this.mountRef.current
        if (x && x.children[0]) x?.removeChild(x.children[0])
        x?.appendChild(this.renderer.domElement)
    }

    constructor(public p: Panel_DisplacementProps) {
        // Set up scene, camera, and renderer
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(
            //
            75,
            this.WIDTH / this.HEIGHT,
            0.1,
            1000,
        )
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize(this.WIDTH, this.HEIGHT)

        // // Add renderer to DOM
        // this.mountRef.current?.appendChild(renderer.domElement)

        // OrbitControls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enableDamping = true
        this.controls.dampingFactor = 0.25
        this.controls.enableZoom = true

        // Load textures
        const loader = new THREE.TextureLoader()
        const texture = loader.load(p.image)
        // texture.encoding = THREE.sRGBEncoding
        texture.colorSpace = THREE.SRGBColorSpace
        const depthTexture = loader.load(p.depthMap)
        const normalTexture = loader.load(p.normalMap)

        const aspectRatio = p.height / p.width
        // Create a plane geometry for the image
        this.geometry = new THREE.PlaneGeometry(
            //
            5,
            5 * aspectRatio,
            Math.round(p.width),
            Math.round(p.height),
        )
        this.material = new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true,
            displacementMap: depthTexture,
            displacementScale: this.displacementScale,
            normalMap: normalTexture,
            metalness: this.metalness,
            roughness: this.roughness,
        })
        this.plane = new THREE.Mesh(this.geometry, this.material)
        this.planeSym = new THREE.Mesh(this.geometry.clone(), this.material)

        // Add plane to scene
        this.scene.add(this.plane)
        this.scene.add(this.planeSym)

        // Camera position
        this.camera.position.z = 7

        // Lighting
        this.ambientLight = new THREE.AmbientLight(0xffffff, 3)
        this.scene.add(this.ambientLight)

        const pointLight = new THREE.PointLight(0xffffff, 1)
        this.camera.add(pointLight)

        // Render loop
        const animate = () => {
            requestAnimationFrame(animate)
            this.controls.update() // only required if controls.enableDamping = true, or if controls.autoRotate = true
            // renderer.gammaOutput = true;

            // Animation logic here
            // plane.rotation.x += 0.01
            this.renderer.render(this.scene, this.camera)
        }

        // Start animation loop
        animate()

        // Handle cleanup on unmount
        this.cleanup = () => {
            this.mountRef.current?.removeChild(this.renderer.domElement)
            this.scene.clear()
            this.geometry.dispose()
            this.material.dispose()
            texture.dispose()
            depthTexture.dispose()
            normalTexture.dispose()
        }

        makeAutoObservable(this)
    }
    cleanup: () => void
}
