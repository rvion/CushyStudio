// import { type KeyboardControlsEntry, KeyboardControls } from '@react-three/drei'
// import { observer } from 'mobx-react-lite'
// import { useMemo } from 'react'

// export const KBControlsUI = observer(function KBControlsUI_(p: { children: any }) {
//     enum Controls {
//         forward = 'forward',
//         back = 'back',
//         left = 'left',
//         right = 'right',
//         jump = 'jump',
//     }
//     const map = useMemo<KeyboardControlsEntry<Controls>[]>(
//         () => [
//             { name: Controls.forward, keys: ['ArrowUp', 'KeyW'] },
//             { name: Controls.back, keys: ['ArrowDown', 'KeyS'] },
//             { name: Controls.left, keys: ['ArrowLeft', 'KeyA'] },
//             { name: Controls.right, keys: ['ArrowRight', 'KeyD'] },
//             { name: Controls.jump, keys: ['Space'] },
//         ],
//         [],
//     )
//     return <KeyboardControls map={map}>{p.children}</KeyboardControls>
// })
