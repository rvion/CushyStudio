import type { STATE } from 'src/state/state'

import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { createRef, useEffect, useLayoutEffect, useMemo } from 'react'
import { Media3dDisplacementL } from 'src/models/Media3dDisplacement'
import { StepL } from 'src/models/Step'
import { InputNumberUI } from 'src/rsuite/InputNumberUI'
import { Button, Input, Slider, Toggle } from 'src/rsuite/shims'
import { useSt } from 'src/state/stateContext'
import { bang } from 'src/utils/misc/bang'
import { parseFloatNoRoundingErr } from 'src/utils/misc/parseFloatNoRoundingErr'
import * as THREE from 'three'
import { OutputPreviewWrapperUI } from './OutputPreviewWrapperUI'
// import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// const { OrbitControls } = require('three/examples/jsm/controls/OrbitControls')
import { createMediaImage_fromDataURI } from 'src/models/createMediaImage_fromWebFile'
import { OrbitControls } from '../panels/3d/controls/OrbitControls'
import { FieldAndLabelInlineUI } from 'src/widgets/misc/FieldAndLabelUI'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'
import { PanelHeaderUI } from 'src/panels/PanelHeader'

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
    const st = useSt()

    return (
        <div>
            <PanelHeaderUI>
                <FieldAndLabelInlineUI label='Points'>
                    <Toggle checked={state.usePoints} onChange={(e) => (state.usePoints = e.target.checked)} />
                </FieldAndLabelInlineUI>
                <FieldAndLabelInlineUI label='displacement'>
                    <InputNumberUI
                        mode='float'
                        style={{ width: '5rem' }}
                        step={0.01}
                        min={0}
                        max={5}
                        value={state.displacementScale}
                        onValueChange={(next) => {
                            state.displacementScale = next
                        }}
                    />
                </FieldAndLabelInlineUI>
                <FieldAndLabelInlineUI label='cutout'>
                    <InputNumberUI
                        mode='float'
                        style={{ width: '5rem' }}
                        min={0}
                        max={1}
                        step={0.01}
                        value={state.cutout}
                        onValueChange={(next) => {
                            state.cutout = next
                        }}
                    />
                </FieldAndLabelInlineUI>
                <FieldAndLabelInlineUI label='light'>
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
                </FieldAndLabelInlineUI>
                <FieldAndLabelInlineUI label='light color'>
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
                </FieldAndLabelInlineUI>
                <FieldAndLabelInlineUI label='Symmetric Model'>
                    <Toggle checked={state.isSymmetric} onChange={(e) => (state.isSymmetric = e.target.checked)} />
                </FieldAndLabelInlineUI>
                <FieldAndLabelInlineUI label='Screenshot'>
                    <Button onClick={() => state.takeScreenshot(st)}>Take Screenshot</Button>
                </FieldAndLabelInlineUI>
            </PanelHeaderUI>
            <div ref={state.mountRef} />
        </div>
    )
})

type OrbitControls2 = import('three/examples/jsm/controls/OrbitControls').OrbitControls

// export const saveCanvasAsImage = async (canvas: HTMLCanvasElement, st: STATE, subfolder?: string) => {
//     const imageID = nanoid()
//     const filename = `${imageID}.png`

//     const relPath = asRelativePath(subfolder ? path.join(subfolder, filename) : filename)
//     const absPath = st.resolve(st.outputFolderPath, relPath)
//     mkdirSync(dirname(absPath), { recursive: true })

//     const buffer = await new Promise<ArrayBuffer>((resolve) => canvas.toBlob((blob) => blob?.arrayBuffer().then(resolve)))
//     writeFileSync(absPath, Buffer.from(buffer))
//     console.log(`Image saved: ${absPath}, ${buffer.byteLength} bytes`)

//     st.db.media_images.create({ infos: { type: 'image-local', absPath } })
// }

export const saveDataUriAsImage = async (dataURI: string, st: STATE, subfolder?: string) => {
    return createMediaImage_fromDataURI(st, dataURI, subfolder)
}

// State class
class State {
    mountRef = createRef<HTMLDivElement>()

    // params to play with ----------------------------------------------------------------
    metalness = 0
    roughness = 1

    private _displacementScale = 1
    get displacementScale() { return this._displacementScale } // prettier-ignore
    set displacementScale(v: number) {
        this._displacementScale = v
        this.material.displacementScale = v
    }

    private _cutout = 0.1
    get cutout() { return this._cutout } // prettier-ignore
    set cutout(v: number) {
        this._cutout = v
        // this.material.setValues({
        //     userData: { cutout: { value: this._cutout } },
        // })
        this.material.userData.cutout.value = v
        // this.material.needsUpdate = true
    }

    private setCutoutMaterial() {
        // const cutoutThreshold = 0.05
        // const displacementMapSizeX = p.width
        // const displacementMapSizeY = p.height

        const mat = this.material
        mat.userData = { cutout: { value: this._cutout } }

        mat.onBeforeCompile = (shader) => {
            shader.uniforms.cutout = mat.userData.cutout

            shader.vertexShader = shader.vertexShader
                .replace(
                    `void main() {`,
                    `varying float vTransformDiff;
uniform float cutout;
void main() {`,
                )
                .replace(
                    `#include <displacementmap_vertex>`,
                    `#include <displacementmap_vertex>

            // Calculate the maximum absolute displacement difference from neighboring pixels
            vec2 dUv = vec2(1.0, 1.0) / vec2(textureSize(displacementMap, 0));

            float diffX = abs(
                texture2D(displacementMap, vDisplacementMapUv + vec2(dUv.x, 0.0)).x -
                texture2D(displacementMap, vDisplacementMapUv - vec2(dUv.x, 0.0)).x
            );

            float diffY = abs(
                texture2D(displacementMap, vDisplacementMapUv + vec2(0.0, dUv.y)).x -
                texture2D(displacementMap, vDisplacementMapUv - vec2(0.0, dUv.y)).x
            );

            vec3 transformDiffX = normalize(objectNormal) * vec3(diffX * displacementScale + displacementBias);
            vec3 transformDiffY = normalize(objectNormal) * vec3(diffY * displacementScale + displacementBias);

            vTransformDiff = max(length(transformDiffX), length(transformDiffY));
                    `,
                )

            shader.fragmentShader = shader.fragmentShader
                .replace(
                    `void main() {`,
                    `varying float vTransformDiff;
uniform float cutout;
void main() {`,
                )
                .replace(
                    `#include <dithering_fragment>`,
                    `#include <dithering_fragment>

            // // debug: visualize vTransformDiff
            // vec3 visualizationColor = vec3(vTransformDiff, 0.0, 1.0 - vTransformDiff);
            // gl_FragColor = vec4(visualizationColor, 1.0);

            // Discard fragments if vTransformDiff is above a cutoff
            if (vTransformDiff > cutout) {
                // gl_FragColor = vec4(0.0,1.0,0.0, 1.0);
                // gl_FragColor = vec4(0.0,1.0,0.0, 0.0);
                discard;
            }
                      `,
                )

            console.log(`vertexShader`, { vertexShader: shader.vertexShader, fragmentShader: shader.fragmentShader })
        }
    }

    private _usePoints = false
    get usePoints() { return this._usePoints } // prettier-ignore
    set usePoints(v: boolean) {
        this._usePoints = v

        if (v) {
            this.scene.remove(this.plane)
            this.scene.remove(this.planeSym)
            this.scene.add(this.points)
        } else {
            this.scene.add(this.plane)
            this.scene.add(this.planeSym)
            this.scene.remove(this.points)
        }
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

    // For screenshots
    // renderTarget: THREE.WebGLRenderTarget
    // renderCanvas: HTMLCanvasElement
    takeScreenshot = (st: STATE) => {
        const imgDataURL = this.renderer.domElement.toDataURL(`image/png`)
        return createMediaImage_fromDataURI(st, imgDataURL, `3d-snapshots`)
    }

    controls: OrbitControls2

    // point cloud
    pointsMaterial: THREE.PointsMaterial
    points: THREE.Points

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
        this.renderer = new THREE.WebGLRenderer({
            preserveDrawingBuffer: true,
        })
        this.renderer.setSize(this.WIDTH, this.HEIGHT)

        // this.renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight)
        // this.renderCanvas = document.createElement('canvas')
        // document.body.appendChild(this.renderCanvas)

        // // Add renderer to DOM
        // this.mountRef.current?.appendChild(renderer.domElement)

        // OrbitControls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement) as OrbitControls2
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
            1,
            1 * aspectRatio,
            Math.round(p.width),
            Math.round(p.height),
        )
        this.pointsMaterial = new THREE.PointsMaterial({
            map: texture,
            transparent: true,
            // displacementMap: depthTexture,
            // displacementScale: this.displacementScale,
            // normalMap: normalTexture,
            // metalness: this.metalness,
            // roughness: this.roughness,
        })
        this.points = new THREE.Points(this.geometry, this.pointsMaterial)

        this.material = new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true,
            displacementMap: depthTexture,
            displacementScale: this.displacementScale,
            normalMap: normalTexture,
            metalness: this.metalness,
            roughness: this.roughness,
        })

        // 1.
        // console.log(`shader.vertexShader`, { vertexShader: shader.vertexShader })

        // const customTransform = `
        //     vec3 transformed = vec3(position);
        //     vec2 pixelUV = vUv * vec2(${displacementMapSizeX.toFixed(1)}, ${displacementMapSizeY.toFixed(1)});

        //     // Calculate the difference in displacement values between neighboring pixels
        //     float displacementDiffX = abs(texture2D(displacementMap, pixelUV + vec2(1, 0)).r - texture2D(displacementMap, pixelUV).r);
        //     float displacementDiffY = abs(texture2D(displacementMap, pixelUV + vec2(0, 1)).r - texture2D(displacementMap, pixelUV).r);

        //     // If the difference is above the threshold, discard the pixel
        //     if (displacementDiffX > ${cutoutThreshold.toFixed(1)} || displacementDiffY > ${cutoutThreshold.toFixed(1)}) {
        //         discard;
        //     }
        // `
        //     const customTransform = `
        //     // Simplified code for debugging
        //     if (vUv.x > ${cutoutThreshold.toFixed(4)}) {
        //         discard;
        //     }
        // `
        // console.log(`shader.vertexShader`, { vertexShader: shader.vertexShader })

        // 1b.
        // // Add custom shader code to achieve cutout based on displacement difference
        // const cutoutThreshold = 10000
        // const displacementMapSizeX = p.width
        // const displacementMapSizeY = p.height

        // this.material.onBeforeCompile = (shader) => {
        //     const customTransform = `
        //     #include <map_fragment>
        //     vec3 transformed = vec3(position);
        //     vec2 pixelUV = vUv * vec2(${displacementMapSizeX.toFixed(1)}, ${displacementMapSizeY.toFixed(1)});

        //     // Calculate the difference in displacement values between neighboring pixels
        //     float displacementDiffX = abs(texture2D(displacementMap, pixelUV + vec2(1, 0)).r - texture2D(displacementMap, pixelUV).r);
        //     float displacementDiffY = abs(texture2D(displacementMap, pixelUV + vec2(0, 1)).r - texture2D(displacementMap, pixelUV).r);

        //     // If the difference is above the threshold, discard the pixel
        //     if (displacementDiffX > ${cutoutThreshold.toFixed(1)} || displacementDiffY > ${cutoutThreshold.toFixed(1)}) {
        //         discard;
        //     }
        //     `
        //     shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', customTransform)
        // }

        // 2.
        // // Add custom shader code to achieve cutout based on displacement difference
        // const cutoutThreshold = 0.1
        // const displacementMapSizeX = p.width
        // const displacementMapSizeY = p.height

        // this.material.onBeforeCompile = (shader) => {
        //     // Declare varying variables in both vertex and fragment shaders
        //     shader.fragmentShader = `
        //         #include <map_fragment>

        //         // Add custom code
        //         vec2 pixelUV = vUv * vec2(${displacementMapSizeX.toFixed(1)}, ${displacementMapSizeY.toFixed(1)});
        //         float displacementDiffX = abs(texture2D(displacementMap, pixelUV + vec2(1, 0)).r - texture2D(displacementMap, pixelUV).r);
        //         float displacementDiffY = abs(texture2D(displacementMap, pixelUV + vec2(0, 1)).r - texture2D(displacementMap, pixelUV).r);

        //         // If the difference is above the threshold, discard the pixel
        //         if (displacementDiffX > ${cutoutThreshold.toFixed(4)} || displacementDiffY > ${cutoutThreshold.toFixed(4)}) {
        //             discard;
        //         }
        //     `

        //     // Ensure the custom shader code replaces the correct placeholder
        //     shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', '')
        // }

        // 3.
        // Add custom shader code to achieve cutout based on displacement difference
        this.setCutoutMaterial()

        // plane
        this.plane = new THREE.Mesh(this.geometry, this.material)
        this.planeSym = new THREE.Mesh(this.geometry.clone(), this.material)

        // Add plane to scene
        // this.scene.add(this.points)
        this.scene.add(this.plane)
        this.scene.add(this.planeSym)

        // Camera position
        this.camera.position.z = 2

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

        makeAutoObservable(this, { mountRef: false })
    }
    cleanup: () => void
}
