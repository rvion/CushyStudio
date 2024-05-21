// ---------------------------------------------------------------------

import { command } from '../Command'
import { ctx_global } from '../contexts/ctx_global'
import { menuWithoutProps, type MenuWithoutProps } from '../Menu'
import { Trigger } from '../RET'

export const menu_utils: MenuWithoutProps = menuWithoutProps({
    title: 'Utils',
    entries: () => [
        //
        cmd_nav_openGallery1,
        cmd_nav_openGallery2,
        cmd_nav_openGallery3,
        cmd_nav_openCivitaiPanel,
        menu_utils.bind({}),
    ],
})

const cmd_nav_openGallery = (ix?: number) => {
    return command({
        id: `nav.openGallery${ix ?? ''}`,
        label: `Open Gallery ${ix ?? ''}`,
        ctx: ctx_global,
        combos: ['mod+g mod+g mod+' + (ix ?? 1)],
        action: (p) => {
            cushy.layout.FOCUS_OR_CREATE('Gallery', { uid: ix })
            return Trigger.Success
        },
    })
}

export const cmd_nav_openGallery1 = cmd_nav_openGallery()
export const cmd_nav_openGallery2 = cmd_nav_openGallery(2)
export const cmd_nav_openGallery3 = cmd_nav_openGallery(3)
export const cmd_nav_openCivitaiPanel = command({
    id: 'nav.openCivitaiPanel',
    label: 'Open Civitai Panel',
    ctx: ctx_global,
    action: () => {
        cushy.layout.FOCUS_OR_CREATE('Models', {})
        return Trigger.Success
    },
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
