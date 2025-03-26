import { MessageUI } from './MessageUI'

export const MessageErrorUI = obs(function MessageErrorUI_(p: {
   title?: string
   children?: React.ReactNode
   markdown?: string
   className?: string
   closable?: boolean
}) {
   return (
      <MessageUI //
         type='error'
         icon={IKONS.mdiAlertCircle}
         hue={0}
         {...p}
      />
   )
})
