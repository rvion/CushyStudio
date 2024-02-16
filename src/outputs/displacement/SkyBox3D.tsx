import { useThree } from '@react-three/fiber'
import { CubeTextureLoader } from 'three'

// Loads the skybox texture and applies it to the scene.

export function SkyBox3D() {
    // highlight-start
    const { scene } = useThree()
    const loader = new CubeTextureLoader()
    // The CubeTextureLoader load method takes an array of urls representing all 6 sides of the cube.
    const texture = loader.load([
        'library/built-in/_assets/skybox/xneg.jpeg',
        'library/built-in/_assets/skybox/xpos.jpeg',
        'library/built-in/_assets/skybox/yneg.jpeg',
        'library/built-in/_assets/skybox/ypos.jpeg',
        'library/built-in/_assets/skybox/zneg.jpeg',
        'library/built-in/_assets/skybox/zpos.jpeg',
    ])

    // Set the scene background property to the resulting texture.
    scene.background = texture
    // highlight-end
    return null
}
