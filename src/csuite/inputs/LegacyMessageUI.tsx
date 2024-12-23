import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'

import { Ikon } from '../icons/iconHelpers'
import { exhaust } from '../utils/exhaust'

type MessageType = 'error' | 'info' | 'warning'

const messageIcon = (type: MessageType): ReactNode => {
   if (type === 'error') return <Ikon.mdiAlertCircle tw=' !text-xl' />
   if (type === 'info') return <Ikon.mdiAlert tw=' !text-xl' />
   if (type === 'warning') return <Ikon.mdiInformationSlabBox tw=' !text-xl' />
   exhaust(type)
   return null
}

export const LegacyMessageUI = observer(function LegacyMessageUI_(p: {
   //
   type: MessageType
   header?: ReactNode
   showIcon?: boolean
   children?: ReactNode
}) {
   const { showIcon, ...rest } = p
   return (
      <div
         tw={[
            p.type === 'error' //
               ? 'bg-error text-error-content'
               : p.type === 'warning'
                 ? 'bg-warning text-warning-content'
                 : 'bg-base',
         ]}
         {...rest}
      >
         {p.header}
         <div
            //
            className='flex flex-wrap items-center gap-2 p-2'
         >
            {messageIcon(p.type)}
            <div>{p.children}</div>
         </div>
      </div>
   )
})
