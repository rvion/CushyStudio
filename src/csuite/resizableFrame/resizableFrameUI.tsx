import type { ReactNode } from 'react'

import { useMemo } from 'react'

import { Button } from '../button/Button'
import { Frame, type FrameProps } from '../frame/Frame'
import { IkonOf } from '../icons/iconHelpers'
import { ResizableFrameStableState } from './ResizableFrameStableState'

export type ResizableFrameProps = {
   /** @default true */
   resizeHeight?: boolean

   /** @default false */
   resizeWidth?: boolean

   /**
    * The size of the container content
    * if null or undefined, will default to the `startSize`.
    **/
   currentSize?: Maybe<number>

   /**
    * Only taken into account when currentSize is null or undefined.
    * @default 200
    */
   startHeight?: number

   /**
    * Only taken into account when currentSize is null or undefined.
    * @default 200
    */
   startWidth?: number

   /**
    * Returns an absolute value by default,
    * use `relative` to make it return the mouse's movement.
    */
   onResize?: (val: number) => void

   /** shown inside the pane, above the children */
   header?: ReactNode

   /** shown inside the pane, below the children */
   footer?: ReactNode

   /**
    * If undefined, the footer will always be shown.
    * When True/False it will start with that value,
    * but will be toggle-able via an internal state.
    */
   showFooter?: boolean

   /**
    * When true, return relative mouse movement (e.movementY),
    * else return the starting value + offset.
    */
   relative?: boolean

   /**
    * Pixel interval to snap to.
    * Ignored for relative movement.
    */
   snap?: number // TODO(bird_d): This should snap by h-input's height when undefined
} & FrameProps

export const ResizableFrame = obs(function ResizableFrame_(p: ResizableFrameProps) {
   // create stable state, that we can programmatically mutate witout caring about stale references
   const uist = useMemo(() => new ResizableFrameStableState(p), [])
   const theme = cushy.preferences.theme.zValue

   const { resizeHeight = true, resizeWidth = false, currentSize, showFooter, ...props } = p

   let content = (
      <Frame // Content
         ref={uist.containerRef}
         tw='🔘ResizableFrame_Content w-full flex flex-grow overflow-auto'
         base={theme.global.contrast}
         style={{
            borderBottomLeftRadius: '0px',
            borderBottomRightRadius: '0px',
            height: resizeHeight ? `${uist.height}px` : undefined,
            width: resizeWidth ? `${uist.width}px` : undefined,
            padding: '0px !important',
         }}
      >
         {p.children}
      </Frame>
   )

   if (p.resizeWidth) {
      content = (
         <Frame tw='flex'>
            {content}
            <Frame
               hover
               base={theme.global.contrast}
               tw='h-full inset-0 z-10 flex w-4 cursor-ew-resize items-center justify-center'
               onMouseDown={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => uist.startResizingWidth(e)}
            >
               <IkonOf name={IKONS.mdiDragVerticalVariant} />
            </Frame>
         </Frame>
      )
   }
   return (
      <Frame // container
         // hover
         tw='🔘ResizableFrame flex flex-grow flex-col overflow-clip !p-0'
         style={{ gap: '0px', ...p.style }}
         border={theme.global.border}
         dropShadow={theme.global.shadow}
         roundness={theme.global.roundness}
         {...props}
      >
         {Boolean(p.header) && (
            <Frame // Header
               tw='p-1'
               row
               base={{ contrast: 0.0777 }}
            >
               {p.header}
            </Frame>
         )}
         {content}
         <Frame // Footer
            className='flex w-full flex-col'
            base={theme.global.contrast}
         >
            <Frame
               hover
               tw='inset-0 z-10 flex h-4 cursor-ns-resize items-center justify-center'
               onMouseDown={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => uist.startResizingHeight(e)}
            >
               {showFooter != undefined && (
                  <Button
                     // Workaround not having a background-less button option
                     tw='absolute left-0 !h-4 !w-8 !border-none !bg-transparent'
                     hover={{ lightness: -1000 }}
                     subtle
                     size='xs'
                     border={false}
                     icon={uist.showFooter ? IKONS.mdiChevronDown : IKONS.mdiChevronRight}
                     onMouseDown={() => void (uist.showFooter = !uist.showFooter)}
                  />
               )}
               <IkonOf name={IKONS.mdiDragHorizontalVariant} />
            </Frame>
            {/* TODO(bird_d): Make sure to fix image widget */}
            {showFooter != undefined && uist.showFooter && (
               <div tw='!z-50 flex-grow items-center'>{p.footer}</div>
            )}
         </Frame>
      </Frame>
   )
})
