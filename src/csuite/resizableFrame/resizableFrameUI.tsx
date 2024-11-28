import type { ReactNode } from 'react'

import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'

import { Button } from '../button/Button'
import { useCSuite } from '../ctx/useCSuite'
import { Frame, type FrameProps } from '../frame/Frame'
import { IkonOf } from '../icons/iconHelpers'
import { PanelHeaderUI } from '../panel/PanelHeaderUI'
import { window_addEventListener } from '../utils/window_addEventListenerAction'

/* Used once per widget since they should not conflict. */
let startValue: number = 0
let offset: number = 0

const defaultSize: 200 = 200
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

   /** If undefined, the footer will always be shown. When True/False it will start with that value, but will be toggle-able via an internal state  */
   showFooter?: boolean

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
   showFooter?: boolean

   constructor(public props: ResizableFrameProps) {
      this.size = props.currentSize ?? props.startSize ?? defaultSize
      this.showFooter = props.showFooter
      makeAutoObservable(this)
   }

   start = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
      startValue = this.size
      offset = 0
      window_addEventListener('mousemove', this.resize, true)
      window_addEventListener('pointerup', this.stop, true)

      e.preventDefault()
      e.stopPropagation()
   }

   stop = (e: MouseEvent): void => {
      window.removeEventListener('mousemove', this.resize, true)
      window.removeEventListener('pointerup', this.stop, true)

      e.preventDefault()
      e.stopPropagation()
   }

   resize = (e: MouseEvent): void => {
      e.preventDefault()
      e.stopPropagation()
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
         tw='flex flex-grow flex-col overflow-clip !p-0'
         style={{ gap: '0px', ...p.style }}
         border={{ contrast: 0 }}
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
            className='flex w-full flex-col'
            base={csuite.inputContrast}
            style={{ borderTop: '1px solid oklch(from var(--KLR) calc(l + 0.1 * var(--DIR)) c h)' }}
         >
            <Frame
               tw='h-input inset-0 z-10 flex cursor-ns-resize items-center justify-center'
               onMouseDown={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => uist.start(e)}
            >
               {p.showFooter != undefined && (
                  <Button
                     tw='absolute left-0'
                     subtle
                     border={false}
                     icon={uist.showFooter ? 'mdiChevronDown' : 'mdiChevronRight'}
                     onMouseDown={() => {
                        uist.showFooter = !uist.showFooter
                     }}
                  />
               )}
               <IkonOf name='mdiDragHorizontalVariant' />
            </Frame>
            {
               //TODO(bird_d): Make sure to fix image widget
            }
            {p.showFooter != undefined && uist.showFooter && (
               <div tw='!z-50 flex-grow items-center'>{p.footer}</div>
            )}
         </Frame>
      </Frame>
   )
})
