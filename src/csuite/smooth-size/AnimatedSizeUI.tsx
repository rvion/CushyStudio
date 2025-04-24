import type { ReactNode } from 'react'

import { useSizeOf } from './useSizeOf'

/**
 * this widget allow to make size transition smooth
 * there might be better ways to do that;
 * I did that pretty naively, but it seems to be working
 */
export const AnimatedSizeUI: React.FC<{ className?: string; children?: ReactNode }> = obs(
   function AnimatedSize({ className, children, ...rest }) {
      const { ref: refFn, size } = useSizeOf()
      return (
         <div
            style={{ height: `${size.height}px` }}
            className={className}
            tw='smooth-resize-container animated overflow-y-hidden'
            {...rest}
         >
            <div className='smooth-resize-content' ref={refFn}>
               {children}
            </div>
         </div>
      )
   },
)
