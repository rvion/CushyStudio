import { observer } from 'mobx-react-lite'

import { MessageErrorUI } from '../../csuite'

export const ErrorPanelUI = observer(function ErrorPanelUI_(p: { children: React.ReactNode }) {
   return (
      <div tw='h-full'>
         <MessageErrorUI>
            <div>{p.children}</div>
         </MessageErrorUI>
      </div>
   )
})
