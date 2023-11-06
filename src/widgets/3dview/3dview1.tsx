import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// State class
class State {
    constructor(
        //
        public imageSrc: string,
        public depthMapSrc: string,
        public normalMapSrc: string,
    ) {
        makeAutoObservable(this)
    }
}

// React component
export const SceneViewer = observer(function SceneViewer_(p: { imageSrc: string; depthMapSrc: string; normalMapSrc: string }) {
    const mountRef = useRef<HTMLDivElement>(null)

    const state = useMemo(
        () =>
            new State(
                //
                p.imageSrc, // 'path_to_your_image.jpg',
                p.depthMapSrc, // 'path_to_your_depth_map.jpg',
                p.normalMapSrc, // 'path_to_your_normal_map.jpg',
            ),
        [JSON.stringify(p)],
    )

    useEffect(() => {
        // Set up scene, camera, and renderer
        const scene = new THREE.Scene()
        // const WIDTH = window.innerWidth
        // const HEIGHT = window.innerHeight
        const WIDTH = 800
        const HEIGHT = 800
        const camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000)
        const renderer = new THREE.WebGLRenderer()
        renderer.setSize(WIDTH, HEIGHT)

        // Add renderer to DOM
        mountRef.current!.appendChild(renderer.domElement)

        // OrbitControls
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.25
        controls.enableZoom = true

        // Load textures
        const loader = new THREE.TextureLoader()
        const texture = loader.load(state.imageSrc)
        const depthTexture = loader.load(state.depthMapSrc)
        const normalTexture = loader.load(state.normalMapSrc)

        // Create a plane geometry for the image
        const geometry = new THREE.PlaneGeometry(5, 5, 128, 128)
        const material = new THREE.MeshStandardMaterial({
            map: texture,
            displacementMap: depthTexture,
            displacementScale: 3,
            normalMap: normalTexture,
        })
        const plane = new THREE.Mesh(geometry, material)

        // Add plane to scene
        scene.add(plane)

        // Camera position
        camera.position.z = 5

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        scene.add(ambientLight)

        const pointLight = new THREE.PointLight(0xffffff, 1)
        camera.add(pointLight)

        // Render loop
        const animate = function () {
            requestAnimationFrame(animate)
            controls.update() // only required if controls.enableDamping = true, or if controls.autoRotate = true

            // Animation logic here
            // plane.rotation.x += 0.01
            renderer.render(scene, camera)
        }

        // Start animation loop
        animate()

        // Handle cleanup on unmount
        return () => {
            mountRef.current?.removeChild(renderer.domElement)
            scene.clear()
            geometry.dispose()
            material.dispose()
            texture.dispose()
            depthTexture.dispose()
            normalTexture.dispose()
        }
    }, [state])

    return <div ref={mountRef} />
})
