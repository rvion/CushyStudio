import 'react'

type ClassLike = string | { [cls: string]: any } | null | undefined | boolean

declare global {
    namespace JSX {
        interface IntrinsicAttributes {
            tw?: string | ClassLike[]
        }
    }
}

declare module 'react' {
    interface DOMAttributes<T> {
        tw?: string | ClassLike[]
    }
}

// -----------------
declare module '*.css' {}

// -----------------
// docusaurus
declare module '@docusaurus/tsconfig' {}

// -----------------
// https://github.com/pmndrs/react-three-fiber/issues/2501#issuecomment-1250058445
// R3F XRFrame
type XRFrameImpl = XRFrame
type XRFrameRequestCallbackImpl = XRFrameRequestCallback

declare module 'three' {
    interface XRFrame extends XRFrameImpl {}
    type XRFrameRequestCallback = XRFrameRequestCallbackImpl
}

// HDRCubeTextureLoader.d.ts
