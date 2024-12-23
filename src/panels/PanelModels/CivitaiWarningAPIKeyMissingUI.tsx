import { observer } from 'mobx-react-lite'

import { MessageWarningUI } from '../../csuite/messages/MessageWarningUI'

export const CivitaiWarningAPIKeyMissingUI = observer(function CivitaiWarningAPIKeyMissingUI_(p: {}) {
   return (
      <MessageWarningUI>
         <div>
            <div tw='font-bold'>Some files require an API token to download.</div>
            <div>
               👉 Find or create api key here:{' '}
               <a tw='link' href='https://civitai.com/user/account'>
                  https://civitai.com/user/account
               </a>
            </div>
            then paste it in the settings.
            <div>
               More infos here:{' '}
               <a tw='link' href='https://education.civitai.com/civitais-guide-to-downloading-via-api/'>
                  https://education.civitai.com/civitais-guide-to-downloading-via-api/
               </a>
            </div>
         </div>
         {/*  */}
      </MessageWarningUI>
   )
})
