import { observer } from 'mobx-react-lite'

import { DraftIllustrationUI } from '../../../cards/fancycard/DraftIllustration'
import { ComboUI } from '../../../csuite/accelerators/ComboUI'
import { Ikon } from '../../../csuite/icons/iconHelpers'
import { RevealUI } from '../../../csuite/reveal/RevealUI'
import { useUnifiedCanvas } from '../UnifiedCanvasCtx'
import { ToolShelfButtonUI, ToolShelfUI } from '../../../csuite/shelf/ToolShelfUI'

export const CanvasToolbarUI = observer(function CanvasToolbarUI_(p: {}) {
    const canvas = useUnifiedCanvas()
    return (
        <ToolShelfUI
            anchor='left'
            floating
            panelState={canvas.toolShelf}
            defaultSize={cushy.preferences.interface.value.toolBarIconSize}
        >
            <div tw='flex flex-col p-2 gap-1'>
                {/* <div // NONE ----------------------------------------------------------------
                    onClick={() => canvas.enable_none()}
                    tw={['btn btn-xs', canvas.tool === 'none' ? 'btn-primary' : null]}
                >
                    none
                    <Ikon.mdiSetNone />
                    <ComboUI combo='0' />
                </div> */}
                <RevealUI // GENERATE -------------------------------------------------------
                    trigger='hover'
                    placement='right'
                    content={() => (
                        <div tw='flex gap-1'>
                            Generate <ComboUI combo='1' />
                        </div>
                    )}
                >
                    <div
                        onClick={() => canvas.enable_generate()}
                        tw={['btn btn-square', canvas.tool === 'generate' ? 'btn-primary' : null]}
                    >
                        <Ikon.mdiPlay />
                    </div>
                </RevealUI>
                <ToolShelfButtonUI panelState={canvas.toolShelf} icon='mdiAbTesting' text='Generate' />
                <div // MASK --------------------------------
                    onClick={() => canvas.enable_mask()}
                    tw={['btn btn-square', canvas.tool === 'mask' ? 'btn-primary' : null]}
                >
                    Mask
                    <Ikon.mdiTransitionMasked />
                    <ComboUI combo='2' />
                </div>
                <div
                    onClick={() => canvas.enable_paint()}
                    tw={['btn btn-square', canvas.tool === 'paint' ? 'btn-primary' : null]}
                >
                    Paint
                    <ComboUI combo='2' />
                </div>
                <div
                    onClick={() => canvas.enable_move()}
                    tw={['btn btn-lg btn-square', canvas.tool === 'move' ? 'btn-primary' : null]}
                >
                    Move
                    <ComboUI combo='4' />
                </div>
            </div>
            <hr />
            <CanvasToolCategoriesUI />
            {/* <CanvasToolsUI /> */}
        </ToolShelfUI>
    )
})

export const CanvasToolCategoriesUI = observer(function CanvasToolCategoriesUI_(p: {}) {
    const categories = cushy.canvasCategories
    return (
        <div>
            {categories.map((category) => {
                return (
                    <div tw='flex'>
                        <div>{category}</div>
                        <div>
                            <CanvasToolsUI category={category} />{' '}
                        </div>
                    </div>
                )
            })}
        </div>
    )
})
export const CanvasToolsUI = observer(function CanvasToolsUI_(p: { category?: string }) {
    const canvasTools = p.category ? cushy.getCanvasToolsInCategory(p.category) : cushy.canvasTools
    const canvas = useUnifiedCanvas()
    return (
        <div tw='flex'>
            {
                /* canvas.tool === 'generate' && */
                canvasTools.map((draft) => (
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
