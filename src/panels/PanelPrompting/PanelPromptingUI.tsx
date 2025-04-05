import type { NO_PROPS } from '../../csuite/types/NO_PROPS'

import { Button } from '../../csuite/button/Button'
import { PanelUI } from '../../csuite/panel/PanelUI'
import { PromptEditorUI } from '../../prompt/panel/PromptEditorUI'

export const PanelPromptingUI = obs(function PanelPromptingUI_(p: NO_PROPS) {
   return (
      <PanelUI>
         <PanelUI.Header>
            <Button>Mode</Button>
         </PanelUI.Header>
         <PanelUI.Content>
            {cushy.activePrompt && <PromptEditorUI promptID={cushy.activePrompt.zUid}></PromptEditorUI>}
         </PanelUI.Content>
      </PanelUI>
   )
})
