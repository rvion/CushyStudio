import { SimpleMouseActivity } from '../../../csuite/activity/SimpleMouseActivity'
import { command } from '../../../csuite/commands/Command'
import { mkPlacement } from '../../../csuite/fields/core-prefabs/ShapeSchema'
import { Trigger } from '../../../csuite/trigger/Trigger'
import { bang } from '../../../csuite/utils/bang'
import { toastError } from '../../../csuite/utils/toasts'
import {
   createMediaImage_fromBlobObject,
   createMediaImage_fromDataURI,
} from '../../../models/createMediaImage_fromWebFile'
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
      console.log(`[💩] FUCK`)
      const startSize = ctx.maskToolSize
      return cushy.activityManager.startSimpleMouseActivity_({
         onKeyDown: (key, info, routine) => routine.stop(),
         onCancel: (info): void => void ctx.setBrushSize(startSize),
         onMove: (info): void => {
            ctx.setBrushSize(
               Math.max(Math.round(startSize + info.offsetFromStart * (info.shiftKey ? 0.05 : 1)), 1),
            )
         },
      })
   },
})

export const cmd_canvas_drawRectMask = command({
   id: 'canvas.drawRectMask',
   ctx: ctx_unifiedCanvas,
   combos: 'q',
   description: 'quickly add a rectangle mask on active layer',
   label: 'add rect mask on active layer',
   action: (UC) => {
      return cushy.activityManager.startSimpleMouseActivity_({
         onKeyDown: (key, info, routine) => routine.stop(),
         // onCancel: (info): void => void ctx.setBrushSize(startSize),
         onCommit: (info) => {
            // 0. get activeLayer
            const al = UC.activeLayer
            if (al === null) return toastError('no active layer')
            const alWidth = al.Placement.Width.value || 512
            const alHeight = al.Placement.Height.value || 512

            // 1. compute mask placement
            const screenLeft = UC.cursor.xInWindow - UC.cursor.xInScreen
            const screenTop = UC.cursor.yInWIndow - UC.cursor.yInScreen

            const startXInScreen = info.startX - screenLeft
            const startYInScreen = info.startY - screenTop
            const startPosInWorld = UC.viewportInstance?.toWorld(startXInScreen, startYInScreen)

            const startXInWorld = startPosInWorld?.x || 0
            const startYInWorld = startPosInWorld?.y || 0

            const startXInImage = startXInWorld - al.Placement.X.value
            const startYInImage = startYInWorld - al.Placement.Y.value
            // UC.viewportInstance?.toWorld()
            console.log(
               `[💩] `,
               [
                  `\n    startXInScreen=${startXInScreen}`,
                  `\n     startXInWorld=${startXInWorld}`,
                  `\n     startXInImage=${startXInImage}`,
                  '\n',
                  `\n    startYInScreen=${startYInScreen}`,
                  `\n     startYInWorld=${startYInWorld}`,
                  `\n     startYInImage=${startYInImage}`,
                  '\n',
                  `\n             width=${info.width}`,
                  `\n            height=${info.height}`,
               ].join(''),
            )

            // 1. create a canvas and a mask
            const canvas = document.createElement('canvas')
            canvas.width = alWidth
            canvas.height = alHeight
            const ctx = canvas.getContext('2d')
            if (ctx == null) return toastError('Failed to get 2D context')
            // ctx.fillStyle = 'black'
            // ctx.fillRect(0, 0, alWidth, alHeight)
            ctx.fillStyle = 'red'
            ctx.fillRect(
               //
               startXInImage,
               startYInImage,
               info.width,
               info.height,
            )
            const dataURL = canvas.toDataURL()
            console.log(`[💩] dataURL`, dataURL)

            // 2. create a MediaImageL with that canvas buffer
            const image = createMediaImage_fromDataURI(dataURL)

            // 3. add the  mask to the UnifiedCanvas list of masks
            bang(UC.ucv2).Masks.push({
               name: 'rect mask',
               image,
               placement: al.Placement.value,
               visible: true,
            })

            const maskField = bang(UC.ucv2?.Masks.last)

            // 4. enable the mask on the active layer
            UC.activeLayer?.Content.match({
               aiGeneration: (x) => {
                  x.Masks.value.push(maskField.id)
               },
            })
         },
         // onMove: (info): void => {
         //     ctx.setBrushSize(Math.max(Math.round(startSize + info.offsetFromStart * (info.shiftKey ? 0.05 : 1)), 1))
         // },
      })
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
