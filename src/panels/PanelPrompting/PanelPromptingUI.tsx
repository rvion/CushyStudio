import type { NO_PROPS } from '../../csuite/types/NO_PROPS'

import { observer } from 'mobx-react-lite'

import { Button } from '../../csuite/button/Button'
import { PanelUI } from '../../csuite/panel/PanelUI'
import { PromptEditorUI } from '../../prompt/panel/PromptEditorUI'

export const PanelPromptingUI = observer(function PanelPromptingUI_(p: NO_PROPS) {
   return (
      <PanelUI>
         <PanelUI.Header>
            <Button>Mode</Button>
         </PanelUI.Header>
         <PanelUI.Content>
            {cushy.activePrompt && <PromptEditorUI promptID={cushy.activePrompt.id}></PromptEditorUI>}
         </PanelUI.Content>
      </PanelUI>
   )
})
