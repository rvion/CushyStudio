import { observer } from 'mobx-react-lite'
import { useEffect, useMemo } from 'react'

import { observerWC } from '../dropdown/observerWC'
import { Frame, type FrameProps } from '../frame/Frame'
import { BasicShelf_ColumnUI } from './BasicShelf_ColumnUI'
import { BasicShelf_GroupUI } from './BasicShelf_GroupUI'
import { BasicShelfContentUI } from './BasicShelfContentUI'
import { ShelfState } from './ShelfState'

export type ShelfProps = FrameProps & OwnShelfProps

export type OwnShelfProps = {
   anchor: 'left' | 'right' | 'top' | 'bottom'
   defaultSize?: number
   floating?: boolean
}

//TODO(bird_d): Use the activity system for resizing, request a way to change the cursor on the fly for activities.
export const BasicShelfUI = observerWC(
   function BasicShelf({
      // own props
      anchor,
      defaultSize = 300,
      floating = false,

      // children and size need to not be passed since we'll add an extra children and modify the style
      children,
      style,

      // remaining props
      ...rest
   }: ShelfProps) {
      // ShelfState has some makeAutoObserable in it; let's make sure we're not passing jsx element or heaving objects
      const uist = useMemo(() => new ShelfState({ anchor, defaultSize, floating }), [])

      // ensure new properties that could change during lifetime of the component stays up-to-date in the stable state.
      useEffect(() => uist.syncProps({ anchor, defaultSize, floating }), [anchor, defaultSize, floating])

      // ensure any unmounting of this component will properly clean-up
      useEffect(() => uist.end, [])

      const isHorizontal = uist.isHorizontal()

      return (
         <Frame
            {...rest}
            container
            style={{
               width: isHorizontal ? uist.size : 'unset',
               height: !isHorizontal ? uist.size : 'unset',
               ...style,
            }}
            // tw is always overridable because of the magic in src/csuite/custom-jsx/jsx-dev-runtime.js
            tw={[
               // Feels hacky, makes sure the resize handle takes up the whole screen when dragging to not cause cursor flickering.
               !uist.dragging && 'relative',
               'flex-none',
               floating && '!absolute !bg-transparent',
               `${anchor}-0 ${isHorizontal ? 'top-0' : 'left-0'}`,
            ]}
         >
            <div //Resize Handle Area
               tw={[
                  'absolute select-none',
                  uist.dragging && '!left-0 !top-0',
                  isHorizontal ? 'hover:cursor-ew-resize' : 'hover:cursor-ns-resize',
               ]}
               style={{
                  width: uist.dragging ? '100%' : isHorizontal ? 6 : '100%',
                  height: uist.dragging ? '100%' : !isHorizontal && !uist.dragging ? 6 : '100%',
                  [uist.computeResizeAnchor()]: '-3px',
               }}
               onMouseDown={(ev) => {
                  if (ev.button != 0) {
                     return
                  }

                  uist.begin()
               }}
            />
            {children}
         </Frame>
      )
   },
   {
      // name: 'BasicShelfUI',
      Group: BasicShelf_GroupUI,
      Column: BasicShelf_ColumnUI,
      Content: BasicShelfContentUI,
   },
)
