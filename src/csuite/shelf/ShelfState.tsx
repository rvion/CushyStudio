import type { ShelfProps } from './ShelfUI'

import { makeAutoObservable } from 'mobx'

let startValue = 0
export class ShelfState {
    constructor(
        //
        public props: ShelfProps,
    ) {
        this.size = props.defaultSize ?? 200
        makeAutoObservable(this)
    }

    size: number
    dragging: boolean = false

    begin = () => {
        startValue = this.size

        this.dragging = true
        window.addEventListener('mousemove', this.onMouseMove, true)
        window.addEventListener('pointerup', this.end, true)
        window.addEventListener('mousedown', this.cancel, true)
        window.addEventListener('keydown', this.cancel, true)
    }

    cancel = (ev: MouseEvent | KeyboardEvent) => {
        // Only cancel if right click
        if (ev instanceof MouseEvent && ev.button != 2) {
            return
        }

        if (ev instanceof KeyboardEvent && ev.key != 'Escape') {
            return
        }

        this.size = startValue
        this.end()
    }

    onMouseMove = (ev: MouseEvent) => {
        switch (this.props.anchor) {
            case 'left':
                return (this.size += ev.movementX)
            case 'right':
                return (this.size -= ev.movementX)
            case 'bottom':
                return (this.size += ev.movementY)
            case 'top':
                return (this.size -= ev.movementY)
        }
    }

    end = () => {
        this.dragging = false
        window.removeEventListener('mousemove', this.onMouseMove, true)
        window.removeEventListener('pointerup', this.end, true)
        window.removeEventListener('mousedown', this.cancel, true)
        window.removeEventListener('keydown', this.cancel, true)
    }

    isHorizontal = (): boolean => {
        return this.props.anchor == 'left' || this.props.anchor == 'right'
    }

    computeResizeAnchor = () => {
        switch (this.props.anchor) {
            case 'left':
                return 'right'
            case 'right':
                return 'left'
            case 'bottom':
                return 'top'
            case 'top':
                return 'bottom'
        }
    }
}
