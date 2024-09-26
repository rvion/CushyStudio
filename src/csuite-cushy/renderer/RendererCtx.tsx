// import type { Renderer } from './Renderer'

// import React, { useContext } from 'react'

// export const globalRendererRef = { current: null as Maybe<Renderer> }
// export const getGlobalRenderer = (): Renderer => globalRendererRef.current!

// export const RendererCtx = React.createContext<Maybe<Renderer>>(null)
// export const useRenderer = (props?: RENDERER.FieldRenderArgs<any>): Renderer => {
//     const fromCtx = useContext(RendererCtx)
//     if (props?.baseRenderer) return props.baseRenderer
//     if (fromCtx) return fromCtx
//     return getGlobalRenderer()
// }
