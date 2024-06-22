import 'react'

type ClassLike = import('../csuite/types/ClassLike').ClassLike

declare global {
    namespace JSX {
        interface IntrinsicAttributes {
            tw?: string | ClassLike[]
        }
    }
    /*
    defined on window, using observable cache + getter, to allow hot-reload
        | Object.defineProperty(window, 'CushyObservableCache' { value: observable({ st: this }) })
        | Object.defineProperty(window, 'cushy', { get() { return (window as any).st } }) // prettier-ignore
    */
    const cushy: import('../state/state').STATE
}

declare module 'react' {
    interface DOMAttributes<T> {
        tw?: string | ClassLike[]
    }
}

// -----------------
declare module '*.css' {}

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
