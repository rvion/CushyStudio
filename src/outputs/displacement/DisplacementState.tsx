import type { STATE } from 'src/state/state'
import { makeAutoObservable } from 'mobx'
import { createRef } from 'react'
import * as THREE from 'three'
import { createMediaImage_fromDataURI } from 'src/models/createMediaImage_fromWebFile'
import { OrbitControls } from '../../panels/3d/controls/OrbitControls'
import { OrbitControls2, Panel_DisplacementProps } from './OutputDisplacement'

// State class

export class DisplacementState {
    materialRef = createRef<THREE.MeshStandardMaterial>()
    // mountRef = createRef<HTMLDivElement>()

    // // params to play with ----------------------------------------------------------------
    // metalness = 0
    // roughness = 1

    // private _displacementScale = 1
    // get displacementScale() { return this._displacementScale; } // prettier-ignore
    // set displacementScale(v: number) {
    //     this._displacementScale = v
    //     this.material.displacementScale = v
    // }

    // private _cutout = 0.1
    // get cutout() { return this._cutout; } // prettier-ignore
    // set cutout(v: number) {
    //     this._cutout = v
    //     // this.material.setValues({
    //     //     userData: { cutout: { value: this._cutout } },
    //     // })
    //     this.material.userData.cutout.value = v
    //     // this.material.needsUpdate = true
    // }

    onBeforeCompile = (
        //
        shader: THREE.WebGLProgramParametersWithUniforms,
        // mat: any,
        cutout: { value: number },
        // val: number,
        // shader: THREE.ShaderMaterial,
        // cutout: any,
    ) => {
        console.log(`[👙] mat1`, cutout)
        // console.log(`[👙] mat2`, mat.userData.cutout)
        shader.uniforms.cutout = cutout // mat.userData.cutout //{ value: 0.3 }
        // shader.uniforms.cutout = mat.userData.cutout
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

                // debug: visualize vTransformDiff
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

        // console.log(`vertexShader`, {
        //     vertexShader: shader.vertexShader,
        //     fragmentShader: shader.fragmentShader,
        // })
        // console.log(`[👙]`, shader.vertexShader)
        // console.log(`[👙]`, shader.fragmentShader)
    }
    // private setCutoutMaterial() {
    //     // const cutoutThreshold = 0.05
    //     // const displacementMapSizeX = p.width
    //     // const displacementMapSizeY = p.height
    //     const mat = this.material
    //     mat.userData = { cutout: { value: this._cutout } }

    //     // mat.onBeforeCompile =
    // }

    // private _usePoints = false
    // get usePoints() { return this._usePoints; } // prettier-ignore
    // set usePoints(v: boolean) {
    //     this._usePoints = v

    //     if (v) {
    //         this.scene.remove(this.plane)
    //         this.scene.remove(this.planeSym)
    //         this.scene.add(this.points)
    //     } else {
    //         this.scene.add(this.plane)
    //         this.scene.add(this.planeSym)
    //         this.scene.remove(this.points)
    //     }
    // }

    // ambientLight: THREE.AmbientLight
    // private _ambientLightColor = 16777215
    // get ambientLightColor() { return this._ambientLightColor; } // prettier-ignore
    // set ambientLightColor(v: number) {
    //     this._ambientLightColor = v
    //     this.ambientLight.color.setHex(v)
    // }
    // private _ambientLightIntensity = 1
    // get ambientLightIntensity() { return this._ambientLightIntensity; } // prettier-ignore
    // set ambientLightIntensity(v: number) {
    //     this._ambientLightIntensity = v
    //     this.ambientLight.intensity = v
    // }

    // // Symmetry controls
    // private _isSymmetric = false
    // get isSymmetric() { return this._isSymmetric; } // prettier-ignore
    // set isSymmetric(v: boolean) {
    //     this._isSymmetric = v
    //     this.updateGeometry()
    // }

    // updateGeometry = () => {
    //     const geometry = this.planeSym.geometry
    //     // Flip the normals
    //     const normals = geometry.attributes.normal
    //     for (let i = 0; i < normals.count; i++) {
    //         normals.setX(i, -normals.getX(i))
    //         normals.setY(i, normals.getY(i)) // Normally, you don't need to flip Y and Z
    //         normals.setZ(i, normals.getZ(i)) // But adjust if your use case requires it
    //     }
    //     normals.needsUpdate = true

    //     // Correct the winding order by flipping the indices
    //     if (geometry.index) {
    //         const indices = geometry.index
    //         for (let i = 0; i < indices.count; i += 3) {
    //             // Swap the indices of the first and last vertex of the triangle
    //             const tmp = indices.getX(i)
    //             indices.setX(i, indices.getX(i + 2))
    //             indices.setX(i + 2, tmp)
    //         }
    //         indices.needsUpdate = true
    //     }

    //     // Update the geometry to apply the changes
    //     geometry.computeVertexNormals()
    //     geometry.computeVertexNormals()
    //     this.planeSym.geometry.computeVertexNormals()
    //     this.planeSym.geometry.attributes.position.needsUpdate = true
    // }

    // ------------------------------------------------------------------------------------
    // canvas size
    // WIDTH = 800
    // HEIGHT = 800
    // // const WIDTH = window.innerWidth
    // // const HEIGHT = window.innerHeight
    // scene: THREE.Scene
    // camera: THREE.PerspectiveCamera
    // renderer: THREE.WebGLRenderer

    // // For screenshots
    // // renderTarget: THREE.WebGLRenderTarget
    // // renderCanvas: HTMLCanvasElement
    // takeScreenshot = (st: STATE) => {
    //     const imgDataURL = this.renderer.domElement.toDataURL(`image/png`)
    //     return createMediaImage_fromDataURI(st, imgDataURL, `3d-snapshots`)
    // }

    // controls: OrbitControls2

    // // point cloud
    // pointsMaterial: THREE.PointsMaterial
    // points: THREE.Points

    // // plane
    // geometry: THREE.PlaneGeometry
    // material: THREE.MeshStandardMaterial
    // plane: THREE.Mesh
    // planeSym: THREE.Mesh

    // mount = () => {
    //     // Add renderer to DOM
    //     const x = this.mountRef.current
    //     if (x && x.children[0]) x?.removeChild(x.children[0])
    //     x?.appendChild(this.renderer.domElement)
    // }

    constructor(public p: Panel_DisplacementProps) {}
    // foo = () => {
    //     // Set up scene, camera, and renderer
    //     this.scene = new THREE.Scene()
    //     this.camera = new THREE.PerspectiveCamera(
    //         //
    //         75,
    //         this.WIDTH / this.HEIGHT,
    //         0.1,
    //         1000,
    //     )
    //     this.renderer = new THREE.WebGLRenderer({
    //         preserveDrawingBuffer: true,
    //     })
    //     this.renderer.setSize(this.WIDTH, this.HEIGHT)

    //     // this.renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight)
    //     // this.renderCanvas = document.createElement('canvas')
    //     // document.body.appendChild(this.renderCanvas)
    //     // // Add renderer to DOM
    //     // this.mountRef.current?.appendChild(renderer.domElement)
    //     // OrbitControls
    //     this.controls = new OrbitControls(this.camera, this.renderer.domElement) as OrbitControls2
    //     this.controls.enableDamping = true
    //     this.controls.dampingFactor = 0.25
    //     this.controls.enableZoom = true

    //     // Load textures
    //     const loader = new THREE.TextureLoader()
    //     const texture = loader.load(p.image)
    //     // texture.encoding = THREE.sRGBEncoding
    //     texture.colorSpace = THREE.SRGBColorSpace
    //     const depthTexture = loader.load(p.depthMap)
    //     const normalTexture = loader.load(p.normalMap)

    //     const aspectRatio = p.height / p.width
    //     // Create a plane geometry for the image
    //     this.geometry = new THREE.PlaneGeometry(
    //         //
    //         1,
    //         1 * aspectRatio,
    //         Math.round(p.width),
    //         Math.round(p.height),
    //     )
    //     this.pointsMaterial = new THREE.PointsMaterial({
    //         map: texture,
    //         transparent: true,
    //         // displacementMap: depthTexture,
    //         // displacementScale: this.displacementScale,
    //         // normalMap: normalTexture,
    //         // metalness: this.metalness,
    //         // roughness: this.roughness,
    //     })
    //     this.points = new THREE.Points(this.geometry, this.pointsMaterial)

    //     this.material = 0 as any /* new THREE.MeshStandardMaterial({
    //         map: texture,
    //         transparent: true,
    //         displacementMap: depthTexture,
    //         displacementScale: this.displacementScale,
    //         normalMap: normalTexture,
    //         metalness: this.metalness,
    //         roughness: this.roughness,
    //     }) */

    //     // Add custom shader code to achieve cutout based on displacement difference
    //     this.setCutoutMaterial()

    //     // plane
    //     this.plane = new THREE.Mesh(this.geometry, this.material)
    //     this.planeSym = new THREE.Mesh(this.geometry.clone(), this.material)

    //     // Add plane to scene
    //     // this.scene.add(this.points)
    //     this.scene.add(this.plane)
    //     this.scene.add(this.planeSym)

    //     // Camera position
    //     this.camera.position.z = 2

    //     // Lighting
    //     this.ambientLight = new THREE.AmbientLight(16777215, 3)
    //     this.scene.add(this.ambientLight)

    //     const pointLight = new THREE.PointLight(16777215, 1)
    //     this.camera.add(pointLight)

    //     // Render loop
    //     const animate = () => {
    //         requestAnimationFrame(animate)
    //         // only required
    //         // if controls.enableDamping = true,
    //         // or if controls.autoRotate = true
    //         this.controls.update()

    //         // renderer.gammaOutput = true;
    //         // Animation logic here
    //         // plane.rotation.x += 0.01
    //         this.renderer.render(this.scene, this.camera)
    //     }

    //     // Start animation loop
    //     animate()

    //     // Handle cleanup on unmount
    //     this.cleanup = () => {
    //         this.mountRef.current?.removeChild(this.renderer.domElement)
    //         this.scene.clear()
    //         this.geometry.dispose()
    //         this.material.dispose()
    //         texture.dispose()
    //         depthTexture.dispose()
    //         normalTexture.dispose()
    //     }

    //     // makeAutoObservable(this, { mountRef: false })
    // }
    // cleanup: () => void
}
