import { Box } from './Box'

export type BoxUIProps = Box & {
    //
    className?: string
    style?: React.CSSProperties
    children?: any // React.ReactNode
    tabIndex?: number
    id?: string
    ref?: React.Ref<HTMLDivElement>

    // mouse
    onClick?: (ev: React.MouseEvent<HTMLDivElement>) => unknown
    onMouseDown?: (ev: React.MouseEvent<HTMLDivElement>) => void
    onMouseUp?: (ev: React.MouseEvent<HTMLDivElement>) => void
    onMouseEnter?: (ev: React.MouseEvent<HTMLDivElement>) => void
    onMouseLeave?: (ev: React.MouseEvent<HTMLDivElement>) => void
    onContextMenu?: (ev: React.MouseEvent<HTMLDivElement>) => void
    onAuxClick?: (ev: React.MouseEvent<HTMLDivElement>) => void
    onWheel?: (ev: React.WheelEvent<HTMLDivElement>) => void

    // focus
    onFocus?: (ev: React.FocusEvent<HTMLDivElement>) => void
    onBlur?: (ev: React.FocusEvent<HTMLDivElement>) => void

    //
    onChange?: (ev: React.ChangeEvent<HTMLDivElement>) => void

    onKeyUp?: (ev: React.KeyboardEvent<HTMLDivElement>) => void
    onKeyDown?: (ev: React.KeyboardEvent<HTMLDivElement>) => void
}
