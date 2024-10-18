import type { ICanvasTool } from '../utils/_ICanvasTool'

import { observer } from 'mobx-react-lite'

import { DraftIllustrationUI } from '../../../cards/fancycard/DraftIllustration'
import { ToolShelfButtonUI, ToolShelfUI } from '../../../csuite/shelf/ToolShelfUI'
import { useUnifiedCanvas } from '../states/UnifiedCanvasCtx'

export const CanvasToolbarUI = observer(function CanvasToolbarUI_(p: {}) {
    const canvas = useUnifiedCanvas()
    return (
        <ToolShelfUI
            tw='[z-index:99999]'
            anchor='left'
            floating
            panelState={canvas.toolShelf}
            defaultSize={cushy.preferences.interface.value.toolBarIconSize}
        >
            <div tw='flex flex-col gap-1 p-2'>
                {/* <Button // NONE ----------------------------------------------------------------
                    icon='mdiSetNone'
                    onClick={() => canvas.enable_none()}
                    tw={[canvas.tool === 'none' ? 'btn-primary' : null]}
                >
                    none
                    <ComboUI combo='0' />
                </Button> */}
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
                                console.log(`[🤠] CLICKED`)
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
