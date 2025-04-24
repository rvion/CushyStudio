import type { NO_PROPS } from '../../csuite/types/NO_PROPS'

import { Button } from '../../csuite/button/Button'
import { PanelUI } from '../../csuite/panel/PanelUI'
import { WidgetPromptUIBird_d } from '../../prompt/widgets/WidgetPromptUIBird_d'

export const PanelPromptingUI = obs(function PanelPromptingUI_(p: NO_PROPS) {
   return (
      <PanelUI>
         <PanelUI.Header>
            <Button>Mode</Button>
         </PanelUI.Header>
         <PanelUI.Content>
            {cushy.activePrompt && <WidgetPromptUIBird_d field={cushy.activePrompt}></WidgetPromptUIBird_d>}
         </PanelUI.Content>
      </PanelUI>
   )
})
