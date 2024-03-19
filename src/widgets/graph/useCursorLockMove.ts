import { useLocalObservable } from 'mobx-react-lite'

export const useCursorLockMove = (): {
    isDragging: boolean
    props: { onPointerDown: (event: React.PointerEvent) => void }
    dx: number
    dy: number
} => {
    const x = useLocalObservable(() => ({
        isDragging: false,
        dx: 0,
        dy: 0,
        lastX: 0,
        lastY: 0,
        setIsDragging(val:boolean) { x.isDragging = val }, // prettier-ignore
        setDx(val:number) { x.dx = val }, // prettier-ignore
        setDy(val:number) { x.dy = val }, // prettier-ignore
        setLastX(val:number) { x.lastX = val }, // prettier-ignore
        setLastY(val:number) { x.lastY = val }, // prettier-ignore
        unlockPointer: () => {
            document.exitPointerLock()
            x.setIsDragging(false)
            x.cleanup()
        },

        onPointerMove: (event: MouseEvent) => {
            x.setDx(x.dx + event.movementX)
            x.setDy(x.dy + event.movementY)
            x.setLastX(x.lastX + event.movementX)
            x.setLastY(x.lastY + event.movementY)
        },

        // Cleanup function to ensure we remove event listeners
        cleanup: () => {
            document.removeEventListener('mousemove', x.onPointerMove)
            document.removeEventListener('click', x.unlockPointer)
        },

        onPointerDown: (event: React.PointerEvent) => {
            // Request pointer lock for the target element
            x.dx = 0
            x.dy = 0
            document.addEventListener(
                'pointerlockchange',
                () => {
                    if (document.pointerLockElement) {
                        x.setIsDragging(true)
                        document.addEventListener('mousemove', x.onPointerMove)
                        document.addEventListener('click', x.unlockPointer, { once: true })
                    } else {
                        x.setIsDragging(false)
                        // document.removeEventListener('mousemove', onPointerMove)
                        x.cleanup()
                    }
                },
                { once: true },
            )
            ;(event.target as HTMLElement).requestPointerLock()
        },
    }))

    // Props to spread onto the target element
    const props = { onPointerDown: x.onPointerDown }

    return { isDragging: x.isDragging, props, dx: x.dx, dy: x.dy }
}
