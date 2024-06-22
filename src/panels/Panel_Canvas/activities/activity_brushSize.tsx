import { SimpleMouseActivity } from '../../../csuite/activity/SimpleMouseActivity'
import { command } from '../../../csuite/commands/Command'
import { ctx_unifiedCanvas } from '../../../operators/contexts/ctx_unifiedCanvas'

export const cmd_canvas_changeBrushSize = command({
    id: 'canvas.changeBrushSize',
    ctx: ctx_unifiedCanvas,
    combos: 'f',
    description: 'change brush size by moving ...',
    label: 'Change brush size',
    action: (ctx) => {
        const startSize = ctx.maskToolSize
        return cushy.activityManager.start_(
            new SimpleMouseActivity({
                onMove: (info) => {
                    console.log(`[🐭🟢] canvas.changeBrushSize: move`, info)
                    ctx.maskToolSize = startSize + info.offsetFromStart / 100
                },
                onCancel: (info) => {
                    console.log(`[🐭❌] canvas.changeBrushSize: cancel`, info)
                    ctx.maskToolSize = startSize
                },
            }),
        )
    },
})
