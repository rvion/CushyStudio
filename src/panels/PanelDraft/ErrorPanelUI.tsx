import { MessageErrorUI } from '../../csuite'

export const ErrorPanelUI = obs(function ErrorPanelUI_(p: { children: React.ReactNode }) {
   return (
      <div tw='h-full'>
         <MessageErrorUI>
            <div>{p.children}</div>
         </MessageErrorUI>
      </div>
   )
})
