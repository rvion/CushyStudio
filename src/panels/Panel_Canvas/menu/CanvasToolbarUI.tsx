import type { ICanvasTool } from '../utils/_ICanvasTool'

import { observer } from 'mobx-react-lite'

import { DraftIllustrationUI } from '../../../cards/fancycard/DraftIllustration'
import { ToolShelfButtonUI, ToolShelfUI } from '../../../csuite/shelf/ToolShelfUI'
import { useUnifiedCanvas } from '../states/UnifiedCanvasCtx'

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
                {canvas.allTools
                    .toSorted((x, y) => x.category.localeCompare(y.category))
                    .map((tool: ICanvasTool) => (
                        <ToolShelfButtonUI
                            key={tool.id}
                            panelState={canvas.toolShelf}
                            tooltip={tool.description}
                            tooltipPlacement='right'
                            icon={tool.icon}
                            iconSize='2rem'
                            text={tool.id}
                            value={canvas.currentTool === tool}
                            onValueChange={() => (canvas.currentTool = tool)}
                        />
                    ))}
            </div>
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
