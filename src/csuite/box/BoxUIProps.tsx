import type { Box } from './Box'

export type BoxUIProps<T extends Element = HTMLElement> = Box & BoxBasicProps<T>

export type HtmlElementTagName = keyof HTMLElementTagNameMap
export type HTMLElementForTag<K extends keyof HTMLElementTagNameMap> = HTMLElementTagNameMap[K]

export type BoxBasicProps<T extends Element = HTMLElement> = {
   //
   className?: string
   style?: React.CSSProperties
   children?: any // React.ReactNode
   tabIndex?: number
   id?: string
   ref?: React.Ref<T>

   // mouse
   onClick?: (ev: React.MouseEvent<T>) => unknown
   onMouseDown?: (ev: React.MouseEvent<T>) => void
   onMouseUp?: (ev: React.MouseEvent<T>) => void
   onMouseEnter?: (ev: React.MouseEvent<T>) => void
   onMouseLeave?: (ev: React.MouseEvent<T>) => void
   onContextMenu?: (ev: React.MouseEvent<T>) => void
   onAuxClick?: (ev: React.MouseEvent<T>) => void
   onWheel?: (ev: React.WheelEvent<T>) => void

   // focus
   onFocus?: (ev: React.FocusEvent<T>) => void
   onBlur?: (ev: React.FocusEvent<T>) => void

   //
   onChange?: (ev: React.ChangeEvent<T>) => void

   onKeyUp?: (ev: React.KeyboardEvent<T>) => void
   onKeyDown?: (ev: React.KeyboardEvent<T>) => void
}
