import type { ReactNode } from 'react'

import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'

import { useCSuite } from '../ctx/useCSuite'
import { Frame, type FrameProps } from '../frame/Frame'
import { IkonOf } from '../icons/iconHelpers'
import { PanelHeaderUI } from '../panel/PanelHeaderUI'
import { window_addEventListener } from '../utils/window_addEventListenerAction'

/* Used once per widget since they should not conflict. */
let startValue = 0
let offset = 0

const defaultSize = 200
type ResizableFrameProps = {
   /**
    * The size of the container content
    * if null or undefined, will default to the `startSize`
    **/
   currentSize?: Maybe<number>

   /**
    * only taken into account when currentSize is null or undefined
    * @default 200
    */
   startSize?: number

   /** Returns an absolute value by default, use `relative` to make it return the mouse's movement */
   onResize?: (val: number) => void

   header?: ReactNode
   footer?: ReactNode

   /** When true, return relative mouse movement (e.movementY), else return the starting value + offset */
   relative?: boolean

   /**
    * Pixel interval to snap to.
    * Ignored for relative movement
    * */
   snap?: number // TODO(bird_d): This should snap by h-input's height when undefined
} & FrameProps

class ResizableFrameStableState {
   size: number
   constructor(public props: ResizableFrameProps) {
      this.size = props.currentSize ?? props.startSize ?? defaultSize
      makeAutoObservable(this)
   }

   start = (): void => {
      startValue = this.size
      offset = 0
      window_addEventListener('mousemove', this.resize, true)
      window_addEventListener('pointerup', this.stop, true)
   }

   stop = (): void => {
      window.removeEventListener('mousemove', this.resize, true)
      window.removeEventListener('pointerup', this.stop, true)
   }

   resize = (e: MouseEvent): void => {
      if (this.props.relative) {
         return this.props.onResize?.(e.movementY)
      }

      offset += e.movementY
      let next = startValue + offset

      if (this.props.snap) {
         next = Math.round(next / this.props.snap) * this.props.snap
      }
      this.props.onResize?.(next)
      this.size = next
   }
}

export const ResizableFrame = observer(function ResizableFrame_(p: ResizableFrameProps) {
   // create stable state, that we can programmatically mutate witout caring about stale references
   const uist = useMemo(() => new ResizableFrameStableState(p), [])
   const csuite = useCSuite()
   const theme = cushy.theme.value

   const { currentSize, ...props } = p
   return (
      <Frame // container
         // hover
         tw='flex flex-col overflow-clip !p-0'
         style={{ gap: '0px', ...p.style }}
         dropShadow={theme.inputShadow}
         roundness={csuite.inputRoundness}
         {...props}
      >
         {p.header && <PanelHeaderUI>{p.header}</PanelHeaderUI>}

         <Frame // Content
            tw='w-full overflow-auto'
            base={csuite.inputContrast}
            style={{
               height: `${uist.size}px`,
               borderBottomLeftRadius: '0px',
               borderBottomRightRadius: '0px',
               padding: '0px !important',
            }}
         >
            {p.children}
         </Frame>

         <Frame // Footer
            className='h-input relative w-full'
            base={csuite.inputContrast}
            style={{ borderTop: '1px solid oklch(from var(--KLR) calc(l + 0.1 * var(--DIR)) c h)' }}
         >
            <Frame
               hover
               tw='absolute inset-0 !flex h-full cursor-ns-resize items-center justify-center'
               onMouseDown={() => uist.start()}
            >
               <IkonOf name='mdiDragHorizontalVariant'></IkonOf>
            </Frame>
            <div tw='lh-input absolute items-center'>{p.footer}</div>
         </Frame>
      </Frame>
   )
})
