import { observer } from 'mobx-react-lite'

import { useUnifiedCanvas } from '../UnifiedCanvasCtx'
import { DraftIllustrationUI } from 'src/cards/fancycard/DraftIllustration'

export const CanvasAppListUI = observer(function CanvasAppListUI_(p: {}) {
    const canvas = useUnifiedCanvas()

    return (
        <div tw='flex'>
            {
                /* canvas.tool === 'generate' && */
                canvas.st.favoriteDrafts.map((draft) => (
                    <div tw={[draft === canvas.currentDraft ? 'bd' : null]}>
                        <DraftIllustrationUI
                            onClick={() => {
                                draft.openOrFocusTab()
                                canvas.currentDraft = draft
                            }}
                            draft={draft}
                            size='3rem'
                        />
                    </div>
                ))
            }
        </div>
    )
})
