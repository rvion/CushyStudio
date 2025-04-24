import type { ReactNode } from 'react'

export const BadgeContainerUI = obs(function BadgeGroupUI_(p: {
   /** @default true */
   wrap?: boolean
   children?: ReactNode
}) {
   return (
      <div
         tw={[
            //
            'UI-BadgeContainer flex gap-0.5',
            (p.wrap ?? true) && 'flex-wrap',
         ]}
      >
         {p.children}
      </div>
   )
})
