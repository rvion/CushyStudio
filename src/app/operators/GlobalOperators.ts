import { MediaImageL } from '../../models/MediaImage'
import { STATE } from '../../state/state'
import { Operator } from './OperatorManager'

const GLOBAL_OT_run_draft: Operator = {
    id: 'GLOBAL_OT_run_draft',
    label: 'Run Draft',
    description: `Send the active draft's workflow to Comfy`,
    invoke: (self: Operator, ctx: STATE, event: Event) => {
        console.log('[🧬] Running Prompt!')
        let draft = ctx
        // draft.st.layout.FOCUS_OR_CREATE('Output', {}, 'RIGHT_PANE_TABSET')
        // draft.setAutostart(false)
        // draft.start({})
        return 'FINISHED'
    },
}

// TODO: Ask how we should register things, do we need to unregister?
export function registerGlobalOperators(st: STATE) {
    st.operators.register(GLOBAL_OT_run_draft)
    st.operators.register(GALLERY_OT_copy_hovered)
}

// TODO: Ask where we should start putting operators for specific spaces and stuff.
const GALLERY_OT_copy_hovered: Operator = {
    id: 'GALLERY_OT_copy_hovered',
    label: 'Copy Hovered Image in Gallery',
    description: `Copy the image under the mouse in the gallery to the clipboard (as png)`,
    poll: (self: Operator, ctx: STATE, event: Event): boolean => {
        if (ctx.hovered) {
            return true
        }
        return false
    },
    invoke: (self: Operator, ctx: STATE, event: Event) => {
        if (ctx.hovered && ctx.hovered instanceof MediaImageL) {
            try {
                ctx.hovered.copyToClipboard()
            } catch (err) {
                console.error(err)
            }
        }
        return 'FINISHED'
    },
}
