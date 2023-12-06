import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { createRef, useEffect, useLayoutEffect, useMemo } from 'react'
import { Button, Input, Slider, Toggle } from 'src/rsuite/shims'
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
import { STATE } from 'src/state/state'
import { mkdirSync, writeFileSync } from 'fs'
import path, { dirname, join } from 'path'
import { nanoid } from 'nanoid'
import { asRelativePath } from 'src/utils/fs/pathUtils'
import { warn } from 'console'

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
            <div tw='flex gap-2 px-2'>
                <FieldAndLabelUI label='Points'>
                    <Toggle checked={state.usePoints} onChange={(e) => (state.usePoints = e.target.checked)} />
                </FieldAndLabelUI>
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

                <FieldAndLabelUI label='Screenshot'>
                    <Button onClick={() => state.takeScreenshot(st)}>Take Screenshot</Button>
                </FieldAndLabelUI>
            </div>
            <div ref={state.mountRef} />
        </div>
    )
})

export const saveCanvasAsImage = async (canvas: HTMLCanvasElement, st: STATE, subfolder?: string) => {
    const imageID = nanoid()
    const filename = `${imageID}.png`

    const relPath = asRelativePath(subfolder ? path.join(subfolder, filename) : filename)
    const absPath = st.resolve(st.outputFolderPath, relPath)
    mkdirSync(dirname(absPath), { recursive: true })

    const buffer = await new Promise<ArrayBuffer>((resolve) => canvas.toBlob((blob) => blob?.arrayBuffer().then(resolve)))
    writeFileSync(absPath, Buffer.from(buffer))
    console.log(`Image saved: ${absPath}, ${buffer.byteLength} bytes`)

    st.db.media_images.create({ infos: { type: 'image-local', absPath } })
}

export const saveDataUriAsImage = async (dataUri: string, st: STATE, subfolder?: string) => {
    const imageID = nanoid()
    const filename = `${imageID}.png`

    const relPath = asRelativePath(subfolder ? path.join(subfolder, filename) : filename)
    const absPath = st.resolve(st.outputFolderPath, relPath)
    mkdirSync(dirname(absPath), { recursive: true })

    const buffer = Buffer.from(dataUri.split(',')[1], 'base64')
    writeFileSync(absPath, buffer)

    console.log(`Image saved: ${absPath}, ${buffer.byteLength} bytes`)

    st.db.media_images.create({ infos: { type: 'image-local', absPath } })
}

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
        const imgData = this.renderer.domElement.toDataURL(`image/png`)
        saveDataUriAsImage(imgData, st, `3d-snapshots`)

        // const w = window.innerWidth
        // const h = window.innerHeight

        // // Render the scene to the render target
        // this.renderer.setRenderTarget(this.renderTarget)
        // this.renderer.render(this.scene, this.camera)

        // // Read the pixel data from the render target
        // const pixelBuffer = new Uint8Array(w * h * 4)
        // this.renderer.readRenderTargetPixels(this.renderTarget, 0, 0, w, h, pixelBuffer)

        // // Create a canvas element to draw the image
        // this.renderCanvas.width = w
        // this.renderCanvas.height = h

        // // Draw the pixel data onto the canvas
        // const context = this.renderCanvas.getContext('2d')
        // if (!context) {
        //     return
        // }

        // const imageData = context.createImageData(w, h)
        // imageData.data.set(pixelBuffer)
        // context.putImageData(imageData, 0, 0)

        // // flip image
        // context.scale(1, -1)
        // context.drawImage(this.renderCanvas, 0, -h)

        // saveCanvasAsImage(this.renderCanvas, st, `3d-snapshots`)

        // reset
        // this.renderer.setRenderTarget(null)
    }

    controls: OrbitControls

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
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enableDamping = true
        this.controls.dampingFactor = 0.25
        this.controls.enableZoom = true

        // Load textures
        const loader = new THREE.TextureLoader()
        const texture = loader.load(p.image)
        texture.encoding = THREE.sRGBEncoding
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
        const cutoutThreshold = 0.05
        const displacementMapSizeX = p.width
        const displacementMapSizeY = p.height

        this.material.onBeforeCompile = (shader) => {
            shader.vertexShader = shader.vertexShader
                .replace(
                    `void main() {`,
                    `varying float vTransformDiff;
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

            // vDisplacementMapUv
            // vec2 pixelUv = vUv * vec2(${displacementMapSizeX.toFixed(1)}, ${displacementMapSizeY.toFixed(1)});
            // float displacementDiffX = abs(texture2D(displacementMap, pixelUv + vec2(1, 0)).r - texture2D(displacementMap, pixelUV).r)

            shader.fragmentShader = shader.fragmentShader
                .replace(
                    `void main() {`,
                    `varying float vTransformDiff;
        void main() {`,
                )
                .replace(
                    `#include <dithering_fragment>`,
                    `#include <dithering_fragment>

            // // debug: visualize vTransformDiff
            // vec3 visualizationColor = vec3(vTransformDiff, 0.0, 1.0 - vTransformDiff);
            // gl_FragColor = vec4(visualizationColor, 1.0);

            // Discard fragments if vTransformDiff is above a cutoff
            if (vTransformDiff > ${cutoutThreshold.toFixed(4)}) {
                // gl_FragColor = vec4(0.0,1.0,0.0, 1.0);
                // gl_FragColor = vec4(0.0,1.0,0.0, 0.0);
                discard;
            }
                      `,
                )
            console.log(`vertexShader`, { vertexShader: shader.vertexShader, fragmentShader: shader.fragmentShader })
        }

        // plane
        this.plane = new THREE.Mesh(this.geometry, this.material)
        this.planeSym = new THREE.Mesh(this.geometry.clone(), this.material)

        // Add plane to scene
        // this.scene.add(this.points)
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
