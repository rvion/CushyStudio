import { SimpleMouseActivity } from '../../../csuite/activity/SimpleMouseActivity'
import { command } from '../../../csuite/commands/Command'
import { Trigger } from '../../../csuite/trigger/Trigger'
import { ctx_image } from '../../../operators/contexts/ctx_image'
import { ctx_unifiedCanvas } from '../../../operators/contexts/ctx_unifiedCanvas'

export const cmd_canvas_changeBrushSize = command({
    id: 'canvas.changeBrushSize',
    ctx: ctx_unifiedCanvas.derive((ctx) => {
        if (ctx.currentTool === ctx.toolPaint) return ctx
        if (ctx.currentTool === ctx.toolMask) return ctx
        return Trigger.UNMATCHED
    }),
    combos: 'f',
    description: 'change brush size by moving ...',
    label: 'Change brush size',
    action: (ctx) => {
        const startSize = ctx.maskToolSize
        return cushy.activityManager.start_(
            new SimpleMouseActivity({
                onMove: (info): void => {
                    ctx.setBrushSize(Math.max(Math.round(startSize + info.offsetFromStart * (info.shiftKey ? 0.05 : 1)), 1))
                },
                onCancel: (info): void => {
                    ctx.setBrushSize(startSize)
                },
            }),
        )
    },
})

// export const cmd_gallery_changePreviewSize = command({
//     id: 'gallery.changePreviewSize',
//     ctx: ctx_image,
//     combos: 'f',
//     description: 'change brush size by moving ...',
//     label: 'Change brush size',
//     action: (ctx) => {
//         const startSize = ctx.hovered
//         return cushy.activityManager.start_(
//             new SimpleMouseActivity({
//                 onMove: (info): void => {
//                     ctx.setBrushSize(Math.max(Math.round(startSize + info.offsetFromStart * (info.shiftKey ? 0.05 : 1)), 1))
//                 },
//                 onCancel: (info): void => {
//                     ctx.setBrushSize(startSize)
//                 },
//             }),
//         )
//     },
// })
