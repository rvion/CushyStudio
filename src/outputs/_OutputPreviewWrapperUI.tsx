import type { StepOutput } from '../types/StepOutput'
import type { ReactNode } from 'react'

import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'

import { ErrorBoundaryUI } from '../csuite/errors/ErrorBoundaryUI'
import { Frame } from '../csuite/frame/Frame'
import { useSt } from '../state/stateContext'

export const OutputPreviewWrapperUI = observer(function OutputPreviewWrapperUI_(p: {
   /** 3/4 letters max if possible */
   output: StepOutput

   /** must be able to scale to 64*64  */
   children: ReactNode

   /** size in px */
   size?: string
}) {
   const st = useSt()
   const size = p.size ?? '2rem'
   return (
      <ErrorBoundaryUI>
         <Frame // Div because only layouting, no color stuff.
            tw={[
               //
               // 'p-0.5',
               // Make children brighten when this is hovered, but not the element itself
               '[&>*]:hover:brightness-110',
               '!box-border !border-none p-0.5',
            ]}
            style={{ width: size, height: size }}
            onMouseDown={(e) => {
               if (e.button != 0) {
                  return
               }
               // e.preventDefault()
               e.stopPropagation()

               runInAction(() => (st.focusedStepOutput = p.output))
            }}
            onMouseEnter={(ev) => runInAction(() => (st.hovered = p.output))}
            onMouseLeave={() => {
               if (st.hovered === p.output) runInAction(() => (st.hovered = null))
            }}
         >
            {/* <Frame
               //
               tw='h-full w-full p-0.5'
               // square
            > */}
            {p.children}
            {/* </Frame> */}
         </Frame>
      </ErrorBoundaryUI>
   )
})
