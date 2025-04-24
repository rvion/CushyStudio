import 'react'

import type { WidgetsCatalog } from '../csuite-cushy/presenters/RenderCatalog'
import type { RenderRule } from '../csuite-cushy/presenters/RenderRule'
import type { Field } from '../csuite/model/Field'
import type { PixiReactElementProps } from '@pixi/react/types/typedefs/PixiReactNode'
import type { Viewport } from 'pixi-viewport'
import type { PropsOf } from '../csuite/types/PropsOf'

type ClassLike = import('../csuite/types/ClassLike').ClassLike

declare module 'react' {
   namespace JSX {
      interface IntrinsicAttributes {
         tw?: string | ClassLike[]
      }
      interface IntrinsicElements {
         viewport: PixiReactElementProps<typeof Viewport>
      }
   }
}

type AllIkons = import('../csuite/icons/icons').AllIkons

declare global {
   const app: import('../cards/App').GlobalFunctionToDefineAnApp
   const view: import('../cards/App').GlobalFunctionToDefineAView
   const getBuilder: import('../cards/App').GlobalGetBuilderFn
   const getCurrentRun: import('../cards/App').GlobalGetCurrentRun

   /*
    defined on window, using observable cache + getter, to allow hot-reload
        | Object.defineProperty(window, 'CushyObservableCache' { value: observable({ st: this }) })
        | Object.defineProperty(window, 'cushy', { get() { return (window as any).st } }) // prettier-ignore
    */
   const cushy: import('../state/state').STATE
   const uy: WidgetsCatalog

   // ----------------------------------------------------------------
   // 💬 2025-03-26 rvion: irrelevant for us
   // function obs2<P extends object, TRef = {}>(baseComponent: React.ForwardRefRenderFunction<TRef, P>): React.MemoExoticComponent<React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<TRef>>>;

   // 💬 2025-03-26 rvion: irrelevant for us
   // function obs2<P extends object, TRef = {}>(baseComponent: React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<TRef>>): React.MemoExoticComponent<React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<TRef>>>;

   interface FC_<P = {}> extends React.FunctionComponent<P> {
      with(p: Partial<P> | ((t: P) => Partial<P>)): React.FunctionComponent<P>
   }
   // prettier-ignore
   function obs<P extends object>(baseComponent: React.FunctionComponent<P>): FC_<P>

   // prettier-ignore
   function obs<C extends React.FunctionComponent<any> | React.ForwardRefRenderFunction<any>, Options extends any>(baseComponent: C, options?: Options): Options extends {
      forwardRef: true;
   } ? C extends React.ForwardRefRenderFunction<infer TRef, infer P> ? C & React.MemoExoticComponent<React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<TRef>>> : never : C & {
      displayName: string;
      with(p: Partial<PropsOf<C>> | ((t: PropsOf<C>) => Partial<PropsOf<C>>)): C
   };
   // ----------------------------------------------------------------

   const defaultRenderRules: RenderRule<Field>
   const IKONS: AllIkons
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
