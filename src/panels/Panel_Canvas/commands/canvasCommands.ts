import { cmd_canvas_activateGenerateTool } from './_cmd_canvas_activateGenerateTool'
import { cmd_canvas_activateMaskTOol } from './_cmd_canvas_activateMaskTOol'
import { cmd_canvas_changeBrushSize } from './_cmd_canvas_changeBrushSize'
import { cmd_canvas_toggleToolshelf } from './_cmd_canvas_toggleToolshelf'
import { cmd_canvas_undo } from './_cmd_canvas_undo'

export const allCanvasCommands = [
    cmd_canvas_activateGenerateTool,
    cmd_canvas_activateMaskTOol,
    cmd_canvas_changeBrushSize,
    cmd_canvas_undo,
    cmd_canvas_toggleToolshelf,
]
