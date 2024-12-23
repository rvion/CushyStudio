import { observer } from 'mobx-react-lite'

import { knownOKLCHHues } from '../tinyCSS/knownHues'
import { MessageUI } from './MessageUI'

export const MessageInfoUI = observer(function MessageInfoUI_(p: {
   title?: string
   children?: React.ReactNode
   markdown?: string
   className?: string
   closable?: boolean
}) {
   return (
      <MessageUI //
         type='info'
         icon='mdiInformationOutline'
         hue={knownOKLCHHues.info}
         {...p}
      />
   )
})
