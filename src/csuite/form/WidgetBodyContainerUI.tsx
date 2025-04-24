import { ErrorBoundaryUI } from '../errors/ErrorBoundaryUI'
import { Frame, type FrameProps } from '../frame/Frame'

export type BodyContainerProps = FrameProps
export const WidgetBodyContainerUI = obs(function WidgetBodyContainerUI_(
   //
   p: BodyContainerProps,
) {
   return (
      <ErrorBoundaryUI>
         <Frame {...p} />
      </ErrorBoundaryUI>
   )
})
