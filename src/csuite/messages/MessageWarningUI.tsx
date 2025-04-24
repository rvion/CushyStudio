import { knownOKLCHHues } from '../tinyCSS/knownHues'
import { MessageUI } from './MessageUI'

export const MessageWarningUI = obs(function MessageWarningUI_(p: {
   title?: string
   children?: React.ReactNode
   markdown?: string
   className?: string
   closable?: boolean
}) {
   return (
      <MessageUI //
         type='warning'
         icon={IKONS.mdiAlert}
         hue={knownOKLCHHues.warning}
         {...p}
      />
   )
})
