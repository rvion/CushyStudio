import { CushyFormManager } from '../controls/FormBuilder'
import { MediaImageL } from '../models/MediaImage'
import { Check, command } from './Command'
import { menu, type Menu } from './Menu'
import { RET } from './RET'

// ---------------------------------------------------------------------
// example 1: when the mouse is over an image in the gallery
export const cmd_copyGalleryHoveredImage = command({
    id: 'gallery.copyHoveredImage',
    label: 'Copy Hovered Image in Gallery',
    description: `Copy the image under the mouse in the gallery to the clipboard (as png)`,
    when: (): Check<MediaImageL> => {
        if (cushy.layout.currentTabIs('Gallery') && cushy.hovered instanceof MediaImageL) return cushy.hovered
        return RET.UNMATCHED
    },
    run: async (p: { format: AvailableImageCopyFormats }, image: MediaImageL) => {
        return await image.copyToClipboard(p)
    },
})

// ---------------------------------------------------------------------
// example 2: image actions:
type AvailableImageCopyFormats = 'PNG' | 'JPG' | 'WEBP'
type CopyImageParams = { image: MediaImageL; format?: AvailableImageCopyFormats }
export const cmd_copyImage = command({
    id: 'gallery.copyImage',
    label: 'Copy Image',
    run: (p: CopyImageParams) => p.image.copyToClipboard({ format: p.format, quality: form_foo.fields.quality.value }),
    // when: (p: CopyImageParams) => true,
})

// simply open a menu to show both options
export const cmd_copyImageAs = command({
    id: 'gallery.copyImageAs',
    label: 'Copy Image as...',
    run: (image: MediaImageL) => menu_copyImageAs.open(image),
    // when: (p: CopyImageParams) => (p ? (p.image instanceof MediaImageL ? p.image : RET.UNMATCHED) : RET.UNMATCHED),
})

const form_foo = CushyFormManager.form((ui) => ({
    quality: ui.float({ min: 0, softMin: 0.3, max: 1, step: 0.01, alignLabel: false, label: 'test' }),
}))

// ---------------------------------------------------------------------
export const menu_imageActions = menu({
    title: 'image actions',
    entries: (image: MediaImageL) => [
        //
        cmd_copyImage.bind({ image }),
        menu_copyImageAs.bind(image),
    ],
})

export const menu_copyImageAs: Menu<MediaImageL> = menu({
    title: 'Save image as',
    entries: (image: MediaImageL) => [
        cmd_copyImage.bind({ image, format: 'PNG' }, { label: 'Copy as Png' }),
        cmd_copyImage.bind({ image, format: 'WEBP' }, { label: 'Copy as WebP' }),
        cmd_copyImage.bind({ image, format: 'JPG' }, { label: 'Copy as Jpeg' }),
        form_foo.fields.quality,
    ],
})

// --------------------------------------------------------------------------------------------------------------
// const Stack = StackItem[]
// const st = 0 as any
// const op_startMove = operator(st.in3dView && st.itemSelected, startActivity(sk_moveObject, T))
// const kb_startmove = trigger(op_startMove, 'G')
// const sk_moveObject= activity()

// menu():MenuActivity

// ------------------------------------------------------------------------------------------------------------
// const copyImageOp = operator({
//     id: 'GALLERY_OT_copy_hovered',
//     label: 'Copy Hovered Image in Gallery',
//     description: `Copy the image under the mouse in the gallery to the clipboard (as png)`,
//     preCheck: (/* self: Operator, */ ctx: STATE, event: Event) => {
//         if (ctx.hovered instanceof MediaImageL) return ctx.hovered
//         return 'UNMATCHED'
//     },
//     invoke: (/* self: Operator, */ ctx: STATE, image: MediaImageL) => {
//         image.copyToClipboard()
//         return 'FINISHED'
//     },
// })

// KeyBinding -----------------------------------------------------------------------------------------------------
// KeyBinding -----------------------------------------------------------------------------------------------------
// const keybinding = kb({
//     id: 'GALLERY_OT_copy_hovered',
//     when: () => {
//         if (cushy.mouse.isOver('Gallery') && cushy.hovered instanceof MediaImageL) return cushy.hovered
//         return 'UNMATCHED'
//     },
//     defaultKeyMap: 'Ctrl+C',
//     action: copyImageOp,
// })
