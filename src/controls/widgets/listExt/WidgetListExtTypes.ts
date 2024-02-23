import type { IWidget } from 'src/controls/IWidget'

export type BoardSize = {
    width: number
    height: number
    depth?: number
    fill?: string // color
}

export type BoardPosition = {
    // pos
    x: number
    y: number
    z: number

    // size
    width: number
    height: number
    depth: number

    // scale
    scaleX?: number
    scaleY?: number
    scaleZ?: number

    // color
    fill?: string

    // rotation
    rotation?: number

    // interraction
    isSelected?: boolean
    isDragging?: boolean
    isResizing?: boolean
}

export const boardDefaultItemShape: BoardPosition = {
    x: 50,
    y: 50,
    z: 0,
    width: 50,
    height: 50,
    depth: 0,
}

export type WithPosition<T extends IWidget> = {
    widget: T
    position: BoardPosition
}
