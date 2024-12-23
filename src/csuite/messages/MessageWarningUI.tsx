import { observer } from 'mobx-react-lite'

import { knownOKLCHHues } from '../tinyCSS/knownHues'
import { MessageUI } from './MessageUI'

export const MessageWarningUI = observer(function MessageWarningUI_(p: {
   title?: string
   children?: React.ReactNode
   markdown?: string
   className?: string
   closable?: boolean
}) {
   return (
      <MessageUI //
         type='warning'
         icon='mdiAlert'
         hue={knownOKLCHHues.warning}
         {...p}
      />
   )
})
