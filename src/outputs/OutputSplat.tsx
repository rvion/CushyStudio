import GaussianSplats3D from 'gaussian-splats-3d'
import * as THREE from 'three'

const renderWidth = 800
const renderHeight = 600

const rootElement = document.createElement('div')
rootElement.style.width = renderWidth + 'px'
rootElement.style.height = renderHeight + 'px'
document.body.appendChild(rootElement)

const renderer = new THREE.WebGLRenderer({
    antialias: false,
})
renderer.setSize(renderWidth, renderHeight)
rootElement.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(65, renderWidth / renderHeight, 0.1, 500)
camera.position.copy(new THREE.Vector3().fromArray([-1, -4, 6]))
camera.lookAt(new THREE.Vector3().fromArray([0, 4, -0]))
camera.up = new THREE.Vector3().fromArray([0, -1, -0.6]).normalize()

const viewer = new GaussianSplats3D.Viewer({
    cameraUp: [0, -1, -0.6],
    renderer: renderer,
    initialCameraPosition: [-1, -4, 6],
    initialCameraLookAt: [0, 4, 0],
    ignoreDevicePixelRatio: false,
})
viewer
    .loadFile('<path to .ply or .splat file>', {
        splatAlphaRemovalThreshold: 5, // out of 255
        halfPrecisionCovariancesOnGPU: true,
    })
    .then(() => {
        viewer.start()
    })
